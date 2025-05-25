export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Only POST allowed' });
  }

  const { inputText, tone, language } = req.body;

  if (!inputText || !tone || !language) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  const prompt = `
Agisci come una persona intelligente, brillante, ironica e con molta esperienza nelle app di dating.

Hai ricevuto questo messaggio: "${inputText}"  
Rispondi come se fossi l’utente, usando il tono "${tone}", nella lingua "${language}".

Genera 3 risposte diverse, tutte:
- credibili, naturali, spontanee, fluide
- con personalità, carattere, e stile umano
- adatte a Tinder, Bumble, o DM reali
- se possibile, termina con una domanda coerente e originale

✍️ Le risposte devono:
- sembrare scritte da una persona vera, NON da un assistente
- evitare frasi scolastiche, robotiche, educate o generiche
- NON iniziare con “Ciao! Sto bene, grazie, tu?” o roba simile
- NON usare emoji inutili, elenchi, numeri o simboli
- essere scritte su 3 righe distinte, testo puro

---

🎭 Tono specifico scelto:

🟠 **Divertente**  
Ironia intelligente, osservazioni inaspettate, battute originali.  
Mai infantile o cringe.  
Sorprendi con leggerezza. Chiudi con una domanda spiritosa e nuova.

🔴 **Romantico**  
Tono sincero, diretto, personale.  
Mostra vero interesse, senza cliché o frasi da cioccolatino.  
Chiudi con una domanda che invita all’apertura.

🟢 **Sicuro di sé**  
Tono affascinante, rilassato, diretto.  
Parla da pari a pari, con naturalezza.  
Chiudi con una domanda intrigante, non banale.

🟣 **Malizioso**  
Giocoso e ammiccante, con eleganza.  
Allusioni intelligenti, doppi sensi sottili, zero volgarità.  
Chiudi con una domanda che lascia spazio all’immaginazione.

---

🎯 Importante:
❌ Frasi tipo: “navigando tra meme e caffè”, “pizza o film?”, “pronto a sfidarti” → da evitare, sono noiose  
✅ Usa battute nuove, intelligenti, leggere o spiazzanti  
✅ Emoji solo se aggiungono carattere, mai messi a caso  

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
