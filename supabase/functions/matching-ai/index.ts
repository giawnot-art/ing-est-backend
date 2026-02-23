import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7"

serve(async (req) => {
  const { project_id, service_id } = await req.json()

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // 1. Recupera la descrizione tecnica della commessa [cite: 114]
  const { data: project } = await supabase
    .from('project_requests')
    .select('title, description')
    .eq('id', project_id)
    .single()

  // 2. Chiama la RPC SQL (Layer 1 & 2) che abbiamo creato prima
  const { data: candidates } = await supabase
    .rpc('match_engine', { p_service_id: service_id })

  // 3. Prompt per il Ranking AI (Layer 3) [cite: 147, 148]
  const prompt = `Analizza la seguente richiesta di ingegneria: "${project.description}". 
  Valuta questi 10 candidati e seleziona i 5 migliori. 
  Per ognuno, scrivi una motivazione tecnica sintetica basata sulle loro bio e competenze.
  Candidati: ${JSON.stringify(candidates)}`

  // 4. Chiamata a OpenAI (o modello integrato)
  const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [{ role: "system", content: "Sei un esperto di recruiting tecnico per studi di ingegneria." }, { role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })
  })

  const ranking = await aiResponse.json()

  // 5. Restituisce la Top 5 con Score Confidenza [cite: 147, 149]
  return new Response(JSON.stringify(ranking), { headers: { "Content-Type": "application/json" } })
})
