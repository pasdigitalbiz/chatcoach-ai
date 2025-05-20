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
Agisci come una persona che utilizza app di dating.

L'utente ha ricevuto questo messaggio: "${inputText}".

Rispondi al messaggio come se fossi l'utente, in tono ${tone}, nella lingua ${language}.

---

🟠 Se il tono è **Divertente**, rispondi con battute leggere, giochi di parole, osservazioni simpatiche e sorprendenti. Usa uno stile giocoso ma non esagerato, inserendo emoji solo dove rafforzano il tono. Includi sempre una domanda spiritosa per proseguire.

🔴 Se il tono è **Romantico**, rispondi con un tono dolce, diretto e coinvolgente. Usa frasi che mostrano curiosità emotiva e interesse sincero. Aggiungi una domanda che stimoli una connessione più profonda. Evita il miele eccessivo.

🟢 Se il tono è **Sicuro di sé**, rispondi con una comunicazione decisa, affascinante e assertiva, senza mai risultare arrogante. Dai l'impressione che la conversazione stia avvenendo tra due persone sullo stesso livello. Concludi sempre con una domanda diretta e intrigante.

🟣 Se il tono è **Malizioso**, usa doppi sensi leggeri, ironia velata e un tono audace ma elegante. Mantieni un equilibrio tra curiosità e rispetto, evitando volgarità. Inserisci una domanda che accenda la curiosità e lasci spazio al gioco.

---

Genera 3 risposte intelligenti, pronte e propositive, che mostrino subito personalità. Ogni risposta deve includere una domanda naturale per stimolare la conversazione e incoraggiare una risposta.

Le risposte devono essere immediatamente utilizzabili. Evita ambiguità di genere, non usare espressioni come "napoletano/a". Scegli un genere preciso o riformula la frase per renderla neutra e scorrevole.

Evita linguaggio tipico dell'AI. Le risposte devono sembrare naturali, e se vuoi ogni tanto puoi usare anche uno slang o abbreviazioni tipico delle chat dei giovani.

Evita risposte banali, formali o introdotte da simboli tipo trattini, numeri o punti elenco. Scrivi solo il testo puro della risposta, su una riga. Inserisci emoji solo se migliorano davvero il tono.

Scrivi solo le 3 risposte, una per riga, senza numerarle.`;

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
