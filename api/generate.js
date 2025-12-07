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

        const text = await response.text();

        if (!response.ok) {
            // HuggingFace API error
            console.error("HF API Error:", text);
            return res.status(response.status).json({ error: "HF API Error", details: text });
        }

        let json;
        try {
            json = JSON.parse(text);
        } catch {
            console.error("JSON parse error:", text);
            return res.status(500).json({ error: "Invalid JSON from HF", details: text });
        }

        const base64Image = json[0]?.generated_image || json[0]?.image_base64;
        if (!base64Image) {
            console.error("No image in HF response:", json);
            return res.status(500).json({ error: "No image returned", response: json });
        }

        return res.status(200).json({ image: "data:image/png;base64," + base64Image });

    } catch (err) {
        console.error("Server error:", err);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}
