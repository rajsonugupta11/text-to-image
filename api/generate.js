export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const { prompt, configIndex } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    // Multiple configurations
    const configurations = [
        {
            token: process.env.HF_API_TOKEN_1,
            endpoint: "https://api-inference.huggingface.co/models/kothariyashhh/GenAi-Texttoimage"
        },
        {
            token: process.env.HF_API_TOKEN_2,
            endpoint: "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image"
        }
    ];

    const config = configurations[configIndex || 0]; // default first

    try {
        const response = await fetch(config.endpoint, {
            method: "POST",
            headers: {
                Authorization: config.token,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });

        const raw = await response.text();
        let result;
        try { result = JSON.parse(raw); } catch { result = raw; }

        if (response.status === 401 || response.status === 403) {
            return res.status(401).json({ error: "Token expired or invalid", details: raw });
        }

        if (!response.ok) {
            return res.status(response.status).json({ error: raw });
        }

        // HuggingFace base64 format
        if (result[0]?.generated_image) {
            return res.status(200).json({ image: "data:image/png;base64," + result[0].generated_image });
        }

        if (result[0]?.image_base64) {
            return res.status(200).json({ image: "data:image/png;base64," + result[0].image_base64 });
        }

        return res.status(200).json({ image: null, raw });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}
