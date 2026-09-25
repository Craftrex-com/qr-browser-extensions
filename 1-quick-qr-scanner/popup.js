// Quick QR Scanner Popup Controller

document.addEventListener("DOMContentLoaded", async () => {
  const dropZone = document.getElementById("dropZone");
  const browseBtn = document.getElementById("browseBtn");
  const fileInput = document.getElementById("fileInput");
  const resultCard = document.getElementById("resultCard");
  const resultText = document.getElementById("resultText");
  const copyBtn = document.getElementById("copyBtn");
  const openBtn = document.getElementById("openBtn");
  const clearBtn = document.getElementById("clearBtn");
  const statusMessage = document.getElementById("statusMessage");

  // Clear badge when popup opens
  chrome.action.setBadgeText({ text: "" });

  // Check for previous scan from context menu
  const stored = await chrome.storage.local.get("lastScan");
  if (stored && stored.lastScan) {
    if (stored.lastScan.text) {
      showResult(stored.lastScan.text);
    } else if (stored.lastScan.error) {
      showError(stored.lastScan.error);
    }
    // Clear storage once read
    chrome.storage.local.remove("lastScan");
  }

  // Trigger file browser
  browseBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    fileInput.click();
  });

  dropZone.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  });

  // Drag and Drop
  ["dragenter", "dragover"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove("dragover");
    });
  });

  dropZone.addEventListener("drop", (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  });

  // Paste screenshot from clipboard
  window.addEventListener("paste", (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    for (let index in items) {
      const item = items[index];
      if (item.kind === "file" && item.type.startsWith("image/")) {
        const blob = item.getAsFile();
        handleFile(blob);
        break;
      }
    }
  });

  async function handleFile(file) {
    hideStatus();
    try {
      const bitmap = await createImageBitmap(file);
      await decodeBitmap(bitmap);
    } catch (err) {
      showError("Could not load image file.");
    }
  }

  async function decodeBitmap(bitmap) {
    if (!("BarcodeDetector" in window)) {
      showError("BarcodeDetector API is not supported in this browser version.");
      return;
    }

    try {
      const detector = new BarcodeDetector({ formats: ["qr_code", "data_matrix", "aztec", "code_128", "ean_13"] });
      const barcodes = await detector.detect(bitmap);

      if (barcodes && barcodes.length > 0) {
        showResult(barcodes[0].rawValue);
      } else {
        showError("No QR code found in this image. Make sure the QR code is clear and not blurry.");
      }
    } catch (err) {
      showError("Failed to decode QR code from this image.");
    }
  }

  function showResult(text) {
    hideStatus();
    resultText.value = text;
    resultCard.style.display = "block";

    // Show Open button if text is valid URL
    const isUrl = /^https?:\/\//i.test(text.trim());
    openBtn.style.display = isUrl ? "block" : "none";
    if (isUrl) {
      openBtn.onclick = () => {
        chrome.tabs.create({ url: text.trim() });
      };
    }
  }

  function showError(msg) {
    statusMessage.textContent = msg;
    statusMessage.style.display = "block";
  }

  function hideStatus() {
    statusMessage.style.display = "none";
  }

  clearBtn.addEventListener("click", () => {
    resultText.value = "";
    resultCard.style.display = "none";
    hideStatus();
    fileInput.value = "";
  });

  copyBtn.addEventListener("click", async () => {
    if (!resultText.value) return;
    try {
      await navigator.clipboard.writeText(resultText.value);
      const origText = copyBtn.textContent;
      copyBtn.textContent = "✓ Copied!";
      setTimeout(() => {
        copyBtn.textContent = origText;
      }, 1500);
    } catch (err) {
      resultText.select();
      document.execCommand("copy");
    }
  });
});
