import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://pblucwnjvijknfzdbgrf.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBibHVjd25qdmlqa25memRiZ3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NDg0MzEsImV4cCI6MjA3MDMyNDQzMX0.hnhcO8BeHri81kxaW1xx67iNx3nahY40xoUy2iaaiko";

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
