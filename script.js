const form = document.getElementById("text-to-image-form");
const promptInput = document.getElementById("prompt");
const loading = document.getElementById("loading");
const resultImage = document.getElementById("generated-image");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const prompt = promptInput.value.trim();
    if (!prompt) return alert("Please enter a prompt!");

    // Show loading
    loading.style.display = "flex";
    resultImage.style.display = "none";

    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();
        loading.style.display = "none";

        if (data.error) {
            return alert("❌ Error: " + data.error);
        }

        if (data.image) {
            resultImage.src = data.image;
            resultImage.style.display = "block";
        } else {
            alert("⚠ No image returned");
        }

    } catch (err) {
        loading.style.display = "none";
        alert("❌ Frontend error: " + err.message);
    }
});
