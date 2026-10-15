// Cliente de Supabase. Reemplaza los valores con los de tu proyecto
// (Project Settings > API). Usa solo la clave "anon", nunca la "service_role".
const SUPABASE_URL = "https://jkukstnejdppiqfhxnud.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdWtzdG5lamRwcGlxZmh4bnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODg1NjQsImV4cCI6MjEwNzY2NDU2NH0.Ul0haXJU2UB5YSRBA7rblSl68PPwU9IC6EGVDy4p1Yw";

// "supabase" viene del script del CDN; guardamos el cliente en "clienteSupabase"
const clienteSupabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
