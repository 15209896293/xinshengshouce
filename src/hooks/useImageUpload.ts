import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const BUCKET = 'community-images'
const MAX_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_WIDTH = 800

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)

  const compressImage = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width
            width = MAX_WIDTH
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.7))
        }
        img.onerror = reject
        img.src = e.target?.result as string
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }, [])

  const upload = useCallback(async (files: File[]): Promise<string[]> => {
    setUploading(true)
    const urls: string[] = []

    for (const file of files.slice(0, 3)) { // 最多3张
      if (file.size > MAX_SIZE) continue

      // 压缩
      const base64 = await compressImage(file)
      const blob = await fetch(base64).then(r => r.blob())
      const ext = file.type.includes('png') ? 'png' : 'jpg'
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, blob, { contentType: file.type })

      if (error) continue

      const { data: { publicUrl } } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(filename)

      urls.push(publicUrl)
    }

    setUploading(false)
    return urls
  }, [compressImage])

  return { upload, uploading }
}
