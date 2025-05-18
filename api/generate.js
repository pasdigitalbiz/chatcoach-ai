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
Agisci come un esperto di comunicazione online e dating moderno.
L'utente ha ricevuto questo messaggio: "${inputText}".

Rispondi al messaggio come se fossi l'utente, in tono ${tone}, nella lingua ${language}.

Genera 3 risposte brevi, brillanti, propositive e realistiche, con un approccio intelligente e sicuro, come farebbe una persona brillante con esperienza nelle app di dating.

Evita cliché, risposte scontate o troppo generiche. Dai personalità e concretezza. Usa emoji solo se migliorano il tono, mai a caso.

Ogni risposta va su una riga separata, senza numeri, senza introduzione.`;

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
