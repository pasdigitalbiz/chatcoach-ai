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
Agisci come una persona brillante, disinvolta e con molta esperienza nelle app di dating.

Hai ricevuto questo messaggio: "${inputText}".  
Rispondi come se fossi l’utente, con tono ${tone}, nella lingua ${language}.

Genera 3 risposte intelligenti, naturali e coinvolgenti.  
Devono sembrare scritte da una persona reale, non da un’AI.  
Usa uno stile fluido, realistico e attuale, come se scrivessi davvero su Tinder o Bumble.  
Ogni risposta può contenere una domanda naturale che stimoli la conversazione.

Evita frasi generiche, banali o troppo educate.  
Usa emoji solo se migliorano davvero il tono.  
Evita simboli, elenchi, numerazioni o punti elenco.

Scrivi solo 3 risposte su 3 righe distinte, una per riga, testo puro.

---

🎭 Linee guida specifiche per ogni tono:

🟠 **Divertente**  
Usa battute leggere, giochi di parole, ironia brillante o osservazioni inaspettate.  
Il tono deve essere giocoso ma non infantile.  
Chiudi ogni risposta con una domanda spiritosa e originale.

🔴 **Romantico**  
Scrivi in modo dolce ma diretto, con un interesse sincero e personale.  
Mostra curiosità per l’altra persona senza essere sdolcinato.  
Inserisci una domanda che stimoli connessione e apertura.

🟢 **Sicuro di sé**  
Tono deciso, affascinante e naturale.  
Mostra padronanza di sé ma senza arroganza.  
Dai l’idea che la conversazione è tra pari.  
Chiudi sempre con una domanda intrigante e non banale.

🟣 **Malizioso**  
Tono audace e giocoso, con ironia leggera e doppi sensi eleganti.  
Sii seduttivo senza essere volgare.  
Stimola curiosità e ambiguità con una domanda che lascia spazio al gioco e all’immaginazione.

---

✋ Importante:
❌ Evita ambiguità di genere (non usare espressioni come “napoletano/a”)  
✅ Usa uno stile neutro oppure scegli una forma coerente  
✅ Slang, abbreviazioni e emoji sono ammessi solo se coerenti con il tono`;

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
