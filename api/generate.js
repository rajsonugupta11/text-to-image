export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Only POST requests allowed" });
    }

    const { prompt, configIndex } = req.body;

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

        const contentType = response.headers.get("content-type");

        // If image (binary)
        if (contentType && contentType.includes("image")) {
            const buffer = Buffer.from(await response.arrayBuffer());
            return res.status(200).json({
                image: "data:image/png;base64," + buffer.toString("base64")
            });
        }

        // Try JSON
        const json = await response.json();

        if (json.generated_image) {
            return res.status(200).json({
                image: "data:image/png;base64," + json.generated_image
            });
        }

        return res.status(500).json({ error: "No image returned", response: json });

    } catch (err) {
        return res.status(500).json({ error: "Server error", details: err.message });
    }
}
