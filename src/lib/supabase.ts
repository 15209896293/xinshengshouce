import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wcrfyaemxdynirwjrsmd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcmZ5YWVteGR5bmlyd2pyc21kIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MzUwODUzMiwiZXhwIjoyMDk5MDg0NTMyfQ.vb9J42uGkDMDwm8Y5xEYBMbG7hltH0ZOJ9iyCKXirC8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
