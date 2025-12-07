document.getElementById("text-to-image-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) return alert("Please enter a prompt!");

  const loading = document.getElementById("loading");
  const img = document.getElementById("generated-image");

  loading.style.display = "block";
  img.style.display = "none";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (data.error) {
      alert("❌ Error: " + (data.details || data.error));
    } else if (data.image) {
      img.src = data.image;
      img.style.display = "block";
    } else {
      alert("⚠ No image returned.");
    }

  } catch (err) {
    alert("❌ Frontend error: " + err.message);
  } finally {
    loading.style.display = "none";
  }
});

// ✅ DOWNLOAD
document.getElementById("download").addEventListener("click", () => {
  const img = document.getElementById("generated-image");
  if (!img.src) return alert("No image to download!");

  const a = document.createElement("a");
  a.href = img.src;
  a.download = "generated-image.png";
  a.click();
});

// ✅ REGENERATE
document.getElementById("regenerate").addEventListener("click", () => {
  document.getElementById("text-to-image-form").dispatchEvent(new Event("submit"));
});
