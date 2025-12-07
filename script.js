async function query(data, configIndex = 0) {
    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: data.inputs, configIndex })
        });

        const result = await response.json();

        if (result.error) {
            alert("❌ Error: " + result.error);
            return null;
        }

        if (result.image) {
            const img = document.getElementById("generated-image");
            img.src = result.image;
            img.style.display = "block";
            return result.image;
        }

        alert("⚠ No image returned");
        return null;

    } catch (err) {
        alert("❌ Frontend error: " + err.message);
        return null;
    }
}
