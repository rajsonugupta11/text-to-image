document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("text-to-image-form");
    const promptInput = document.getElementById("prompt");
    const loading = document.getElementById("loading");
    const img = document.getElementById("generated-image");
    const downloadBtn = document.getElementById("download");
    const regenerateBtn = document.getElementById("regenerate");

    let lastPrompt = "";

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        lastPrompt = prompt;
        loading.style.display = "flex";
        img.style.display = "none";

        const image = await query({ inputs: prompt });

        loading.style.display = "none";

        if (image) {
            img.style.display = "block";
        }
    });

    downloadBtn.addEventListener("click", () => {
        if (!img.src) return alert("No image to download!");
        const a = document.createElement("a");
        a.href = img.src;
        a.download = "generated_image.png";
        a.click();
    });

    regenerateBtn.addEventListener("click", async () => {
        if (!lastPrompt) return alert("No previous prompt!");
        loading.style.display = "flex";
        img.style.display = "none";

        const image = await query({ inputs: lastPrompt });

        loading.style.display = "none";

        if (image) img.style.display = "block";
    });
});

async function query(data, configIndex = 0) {
    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: data.inputs, configIndex })
        });

        const result = await response.json();

        if (result.error) {
            alert("❌ Error: " + result.error + "\n" + (result.details || ""));
            return null;
        }

        if (result.image) {
            const img = document.getElementById("generated-image");
            img.src = result.image;
            img.style.display = "block";  // show the image
            return result.image;
        }

        alert("⚠ No image returned");
        return null;

    } catch (err) {
        alert("❌ Frontend error: " + err.message);
        return null;
    }
}
