export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST allowed' });
  }

  const { inputText, tone, language } = req.body;

  if (!inputText || !tone || !language) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  const prompt = `
Rispondi come se conoscessi davvero il contesto di attualità e sapessi cosa è successo.  
Non inventare cose generiche, sii specifico, sarcastico o reattivo come faresti in un gruppo WhatsApp.  
Se l’argomento è calcistico o di cultura pop, mostra di avere il polso della situazione.  
Evita frasi educate e neutre. Scrivi come chi si è appena visto il post su Instagram o ha sentito la notizia al bar.  


Hai ricevuto questo messaggio: "${inputText}"  
Rispondi come se fossi l’utente, usando il tono "${tone}", nella lingua "${language}".

Genera 3 risposte diverse, tutte:
- credibili, fluide, spontanee, scritte in linguaggio naturale  
- con una personalità forte, un tocco di sarcasmo, curiosità o malizia (in base al tono)  
- adatte a Tinder, Bumble o messaggi privati  
- che **tengano conto del contesto culturale e del momento attuale**

✍️ Le risposte devono:
- essere scritte come da una persona vera, non da un bot
- evitare frasi scolastiche, educate, piatte o generiche
- NON iniziare con “Ciao! Sto bene, grazie, tu?” o cose simili
- NON usare elenchi, numeri, simboli o emoji forzati
- se possibile, chiudere con una domanda spontanea e intelligente

Scrivi solo le 3 risposte, su 3 righe distinte. Nessun testo extra.

---

🎭 Tono scelto:

🟠 **Divertente**  
Battute intelligenti, riferimenti pop, ironia sottile.  
Cavalca i trend, sorprendi, scherza con gusto.  
Chiudi con una domanda spiritosa e originale.

🔴 **Romantico**  
Tono sincero, profondo ma diretto.  
Evita frasi da cioccolatino, punta alla connessione vera.  
Chiudi con una domanda che apre un dialogo umano.

🟢 **Sicuro di sé**  
Naturale, brillante, carismatico.  
Mai arrogante, ma con presenza.  
Chiudi con una domanda intrigante, mai banale.

🟣 **Malizioso**  
Allusivo, elegante, giocoso.  
Doppi sensi intelligenti, niente volgarità.  
Chiudi con una domanda che lasci spazio all’ambiguità.

---

🎯 Importante:
❌ Evita frasi trite tipo: “navigando tra meme e caffè”, “pizza o film?”, “sei simpatic*”  
✅ Se possibile, cita cose di attualità o cultura pop che hanno senso nella conversazione  
✅ Emoji solo se naturali, mai come riempitivo

`;

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Project": "proj_ZGHbmAMCAkX8qMMpFtYF6cKl"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.9
      })
    });

    const contentType = openaiRes.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await openaiRes.text();
      return res.status(500).json({ error: 'Non-JSON response from OpenAI', details: text });
    }

    const data = await openaiRes.json();
    const output = data.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).json({ error: 'Empty response from GPT', details: data });
    }

    res.status(200).json({ output });
  } catch (err) {
    console.error("GPT error:", err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}
