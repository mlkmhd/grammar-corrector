document.addEventListener('DOMContentLoaded', () => {
    const clipboardTextElement = document.getElementById('clipboard-text');
    const correctedTextElement = document.getElementById('corrected-text');
    const progressBar = document.getElementById('progress');
    const copyBtn = document.getElementById("copy-btn");
    const copySuccess = document.getElementById("copy-success");

    window.electronAPI.onClipboardUpdateText((text) => {
        clipboardTextElement.textContent = `${text}`;
    });

    window.electronAPI.onUpdateText((text) => {
        correctedTextElement.textContent = `${text}`;
    });

    window.electronAPI.onProgressUpdate((isLoading) => {
        progressBar.style.display = isLoading ? 'block' : 'none';
    });

    copyBtn.addEventListener("click", () => {
        const textToCopy = correctedTextElement.innerText;

        if (textToCopy.trim() !== "No corrections yet.") {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    copySuccess.classList.remove("hidden");  // Show success message
                    setTimeout(() => copySuccess.classList.add("hidden"), 2000); // Hide after 2s
                })
                .catch(err => console.error("Failed to copy:", err));
        }
    });
});