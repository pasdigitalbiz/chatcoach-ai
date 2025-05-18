export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { inputText, tone, language } = req.body;

  const prompt = `Agisci come un assistente esperto di app di dating. L'utente ha ricevuto questo messaggio o ha matchato con questa persona:\n\n"${inputText}"\n\nGenera 3 risposte pronte, una per riga, che siano ${tone}, adatte per usare su Tinder o Bumble. Scrivi in ${language}. Mantieni i messaggi brevi, simpatici e realistici.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Project": "default" // se il tuo progetto si chiama "default", altrimenti cambia
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 200,
        temperature: 0.9
      })
    });

    const data = await response.json();
    console.log("📡 Risposta OpenAI:", JSON.stringify(data, null, 2));

    res.status(200).json(data); // <-- mandiamo tutto in risposta per debug
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
