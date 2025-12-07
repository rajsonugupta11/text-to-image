export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const { prompt, configIndex } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

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

    const config = configurations[configIndex || 0];

    try {
        const response = await fetch(config.endpoint, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${config.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ inputs: prompt })
        });

        // Try reading as JSON
        let result;
        try {
            result = await response.json();
        } catch (e) {
            // If not JSON, maybe binary image
            const arrayBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(arrayBuffer).toString("base64");
            return res.status(200).json({
                image: "data:image/png;base64," + base64
            });
        }

        // Model returning JSON with base64
        if (result.generated_image) {
            return res.status(200).json({
                image: "data:image/png;base64," + result.generated_image
            });
        }

        return res.status(500).json({ error: "No image returned", result });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}
