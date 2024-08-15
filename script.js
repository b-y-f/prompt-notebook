document.addEventListener("DOMContentLoaded", () => {
    const inputA = document.getElementById("inputA");
    const inputB = document.getElementById("inputB");
    const outputC = document.getElementById("outputC");
    const successMessage = document.querySelector(".success-message");
    const cleanButton = document.getElementById("cleanButton");
    const promptList = document.getElementById("promptList");
    const fetchDataButton = document.getElementById("fetch-data");
    const inputUrl = document.getElementById("inputUrl");
    const turndownService = new TurndownService({
        headingStyle:'atx'
    });

    // Function to fetch and render prompts from URL
    function fetchAndRenderPrompts(url) {
        if (url) {
            fetch(url)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    promptList.innerHTML = ""; // Clear the existing list
                    data.forEach((prompt) => {
                        const li = document.createElement("li");
                        li.textContent = prompt.filename;
                        li.addEventListener("click", () => {
                            inputB.value = prompt.content;
                            updateOutput();
                        });
                        promptList.appendChild(li);
                    });
                    // Update the URL parameter
                    const urlParams = new URLSearchParams(
                        window.location.search
                    );
                    urlParams.set("url", url);
                    window.history.replaceState(
                        {},
                        "",
                        `${window.location.pathname}?${urlParams}`
                    );
                })
                .catch((error) => {
                    const errorMessage = document.createElement("div");
                    errorMessage.textContent =
                        "Failed to fetch data. Please check the URL and try again.";
                    errorMessage.style.color = "red";
                    promptList.innerHTML = ""; // Clear the existing list
                    promptList.appendChild(errorMessage);
                });
        }
    }

    fetchDataButton.addEventListener("click", () => {
        const url = inputUrl.value;
        fetchAndRenderPrompts(url);
    });

    inputA.addEventListener("input", () => {
        cleanButton.style.display = inputA.value ? "block" : "none";
        updateOutput();
    });

    cleanButton.addEventListener("click", () => {
        inputA.value = "";
        cleanButton.style.display = "none";
        updateOutput();
    });

    inputB.addEventListener("input", updateOutput);

    inputA.addEventListener("paste", (event) => {
        if (!inputA.value) {
            event.preventDefault();
            const text = event.clipboardData.getData("text");
            inputA.value = turndownService.turndown(text);
            cleanButton.style.display = "block";
            updateOutput();
        }
    });

    inputB.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    inputB.addEventListener("drop", (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                inputB.value = e.target.result;
                updateOutput();
            };
            reader.readAsText(file);
        }
    });

    outputC.addEventListener("click", () => {
        navigator.clipboard.writeText(outputC.value).then(() => {
            successMessage.style.display = "block";
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 2000);
        });
    });

    function updateOutput() {
        const template = inputB.value;
        const input = inputA.value;
        outputC.value = template.replace("{}", input);
    }

    // Check for "prompt-url" and fetch prompts if available
    const urlParams = new URLSearchParams(window.location.search);
    const promptUrl = urlParams.get("url");

    if (promptUrl) {
        fetchAndRenderPrompts(promptUrl);
    }
});
