async function query(data, configIndex = 0) {
    try {
        const response = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: data.inputs, configIndex })
        });

        const result = await response.json();

        if (result.error) {
            alert("❌ Error: " + result.error + "\nDetails: " + (result.details || ""));
            return null;
        }

        if (result.image) return result.image;

        alert("⚠ Unexpected API response");
        return null;

    } catch (err) {
        console.error("Frontend error:", err);
        alert("❌ Frontend JS error: " + err.message);
        return null;
    }
}
