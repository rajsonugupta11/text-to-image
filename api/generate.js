export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const response = await fetch(
      "https://router.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_TOKEN_1}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: prompt })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: "HF API Error",
        details: errText
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return res.status(200).json({
      image: `data:image/png;base64,${base64}`
    });

  } catch (err) {
    return res.status(500).json({
      error: "Server Error",
      details: err.message
    });
  }
}
