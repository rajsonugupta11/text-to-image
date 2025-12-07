// api/generate.js
export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/kothariyashhh/GenAi-Texttoimage",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.HF_API_TOKEN_1}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: prompt })
            }
        );

        const json = await response.json();
        const base64Image = json[0]?.generated_image || json[0]?.image_base64;

        if (!base64Image) {
            return res.status(500).json({ error: "No image returned", response: json });
        }

        return res.status(200).json({ image: "data:image/png;base64," + base64Image });
    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}
