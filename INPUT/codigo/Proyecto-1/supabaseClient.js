// ============================================================
// CLIENTE DE SUPABASE
// ============================================================
// mismo proyecto de Supabase que Supabase-1 (seccion 4.6 de la guia: se
// reutiliza el proyecto y solo cambia la tabla, "heroes").
// la anon key es publica: esta hecha para viajar al navegador. lo que
// decide que puede hacer cada quien son las politicas de RLS de la tabla.
// la "service_role" NUNCA va aca.
const SUPABASE_URL = "https://jkukstnejdppiqfhxnud.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprdWtzdG5lamRwcGlxZmh4bnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODg1NjQsImV4cCI6MjEwNzY2NDU2NH0.Ul0haXJU2UB5YSRBA7rblSl68PPwU9IC6EGVDy4p1Yw";

// el script del CDN crea la variable global "supabase". nuestro cliente se
// llama "db" para no pisarla: si se llamara "supabase", createClient
// dejaria de existir
const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
