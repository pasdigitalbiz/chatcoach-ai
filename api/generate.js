// /api/generate.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST allowed' });
  }

  const { inputText, tone, language } = req.body;

  if (!inputText || !tone || !language) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  const prompt = `
Agisci come una persona intelligente, disinvolta e con molta esperienza nelle app di dating.  
Hai un forte senso dell’umorismo, una scrittura brillante e sai sempre cosa dire per risultare naturale, interessante e umano.

Hai ricevuto questo messaggio: "${inputText}"  
Rispondi come se fossi tu a dover scrivere — davvero — su Tinder o Bumble, usando il tono "${tone}", nella lingua "${language}".

Genera **3 risposte diverse**, tutte:
- credibili, spontanee, fluide, come scritte di getto  
- scritte in un linguaggio attuale, umano, realistico  
- con una personalità chiara e coerente con il tono scelto  
- possibilmente con una domanda alla fine, naturale, mai forzata

✍️ Le risposte devono:
- sembrare scritte da una persona vera, non da un assistente  
- NON contenere elenchi, numeri, emoji inutili, spiegazioni  
- evitare frasi vuote, scolastiche, robotiche o da meme riciclati  
- essere brevi ma piene di carattere (massimo 20 parole)

Scrivi **solo le 3 risposte**, una per riga, senza alcun testo aggiuntivo.

---

🎭 Istruzioni specifiche per il tono:

🟠 **Divertente**  
Ironia brillante, battute leggere, osservazioni creative.  
Non fare lo scemo, ma sorprendi con intelligenza.  
Chiudi con una domanda spiritosa e originale.

🔴 **Romantico**  
Tono diretto, sincero, con una dolcezza controllata.  
Niente frasi fatte o cuoricini: mostra interesse vero.  
Chiudi con una domanda che inviti all’apertura personale.

🟢 **Sicuro di sé**  
Tono affascinante, rilassato e deciso.  
Parla da pari a pari, senza bisogno di impressionare.  
Chiudi con una domanda intrigante e non scontata.

🟣 **Malizioso**  
Tono giocoso e intelligente, con seduzione implicita.  
Allusioni leggere, doppi sensi eleganti, zero volgarità.  
Chiudi con una domanda che lasci aperta l’ambiguità.

---

🎯 Importante:
- ❌ Evita ambiguità di genere o plurali strani  
- ✅ Mantieni coerenza grammaticale e stilistica  
- ✅ Emoji solo se migliorano davvero la resa emotiva


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
