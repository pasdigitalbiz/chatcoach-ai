export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { inputText, tone, language } = req.body;

  const prompt = `Agisci come un assistente esperto di app di dating. L'utente ha scritto questo: "${inputText}".
Scrivi 3 risposte brevi, una per riga, con tono ${tone} e lingua ${language}, da usare su Tinder o Bumble. Devono essere simpatiche, naturali, realistiche e con emoji.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Project": "proj_ZGHbmAMCAkX8qMMpFtYF6cKl"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0125",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.85
      }),
    });

    const data = await response.json();

    if (data.choices && data.choices[0]?.message?.content) {
      res.status(200).json({ result: data.choices[0].message.content.trim() });
    } else {
      console.error("Errore nella risposta:", data);
      res.status(500).json({ error: "Errore nella risposta da OpenAI." });
    }
  } catch (error) {
    console.error("Errore API:", error);
    res.status(500).json({ error: "Errore nella generazione." });
  }
}
