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
