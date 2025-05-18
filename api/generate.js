export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { prompt, tone, language } = req.body;

  if (!prompt || !tone || !language) {
    return res.status(400).json({ error: "Missing fields in request" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Project": process.env.OPENAI_PROJECT || "default"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Agisci come un ragazzo o ragazza esperta di app di dating. Scrivi 3 risposte brevi, naturali e simpatiche con emoji, per Tinder o Bumble. Il tono deve essere "${tone}". Scrivi in "${language}". Questo è il messaggio ricevuto: "${prompt}"`
          }
        ],
        max_tokens: 300,
        temperature: 0.9
      }),
    });

    const data = await response.json();

    const output = data?.choices?.[0]?.message?.content || "Errore nella risposta GPT.";
    res.status(200).json({ output });
  } catch (error) {
    res.status(500).json({ error: "Errore API: " + error.message });
  }
}

