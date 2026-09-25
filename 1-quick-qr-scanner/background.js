// Background service worker for Quick QR Code Scanner

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "scan-qr-image",
    title: "Scan QR code with QR Scanner Tool",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "scan-qr-image" && info.srcUrl) {
    try {
      // Fetch image data
      const response = await fetch(info.srcUrl);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      let decodedText = null;

      if ("BarcodeDetector" in self) {
        const detector = new BarcodeDetector({ formats: ["qr_code", "data_matrix", "aztec"] });
        const barcodes = await detector.detect(bitmap);
        if (barcodes.length > 0) {
          decodedText = barcodes[0].rawValue;
        }
      }

      if (decodedText) {
        await chrome.storage.local.set({
          lastScan: {
            text: decodedText,
            timestamp: Date.now(),
            source: "context-menu",
            imageUrl: info.srcUrl
          }
        });

        // Set green badge to notify user
        chrome.action.setBadgeText({ text: "1" });
        chrome.action.setBadgeBackgroundColor({ color: "#16a34a" });
      } else {
        await chrome.storage.local.set({
          lastScan: {
            error: "No QR code detected in this image.",
            timestamp: Date.now(),
            source: "context-menu",
            imageUrl: info.srcUrl
          }
        });
        chrome.action.setBadgeText({ text: "!" });
        chrome.action.setBadgeBackgroundColor({ color: "#dc2626" });
      }
    } catch (err) {
      console.error("Scan error:", err);
      await chrome.storage.local.set({
        lastScan: {
          error: "Could not read this image. Try uploading directly.",
          timestamp: Date.now(),
          source: "context-menu"
        }
      });
      chrome.action.setBadgeText({ text: "!" });
      chrome.action.setBadgeBackgroundColor({ color: "#dc2626" });
    }
  }
});
