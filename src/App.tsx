import { Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InstallPrompt from '@/components/InstallPrompt'
import ScrollToTop from '@/components/ScrollToTop'
import { useLightbox, LightboxOverlay } from '@/components/ImageLightbox'
import HomePage from '@/pages/HomePage'
import ScenePage from '@/pages/ScenePage'
import TodayPage from '@/pages/TodayPage'
import AboutPage from '@/pages/AboutPage'
import PackingPage from '@/pages/PackingPage'
import './App.css'

function App() {
  const lightbox = useLightbox()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ScrollToTop />
      <InstallPrompt />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/today" element={<TodayPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/packing" element={<PackingPage />} />
          <Route path="/:sceneId" element={<ScenePage />} />
        </Routes>
      </main>
      <Footer />
      <LightboxOverlay {...lightbox} />
    </div>
  )
}

export default App
