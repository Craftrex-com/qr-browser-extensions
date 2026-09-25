# Quick QR Code Scanner (Browser Extension)

Scan QR codes directly in your browser with zero friction.

## Features
- **Right-Click Web Image Scan**: Right-click any image on any webpage and select "Scan QR code with QR Scanner Tool".
- **Clipboard Screenshot Paste**: Press `Ctrl + V` inside the extension popup to scan snippets or screenshots.
- **Drag & Drop / File Select**: Drop any PNG, JPEG, WEBP, or SVG image into the popup.
- **Instant Decoded Results**: One-click copy, or one-click open URL.
- **Privacy-First**: All decoding happens locally inside your browser using the Native BarcodeDetector API. No images are sent to any external server.
- **Powered by**: [QR Scanner Tool](https://qr-code-scanner.cc/)

## How to Test Locally (Chrome / Edge / Brave / Opera)
1. Open your browser and navigate to `chrome://extensions` (or `edge://extensions`).
2. Toggle on **Developer mode** (top-right corner).
3. Click **Load unpacked**.
4. Select the `extensions/1-quick-qr-scanner` directory.
5. Click the extension icon in your toolbar to use!

## How to Publish to Chrome Web Store
1. Compress the contents of this folder into a `.zip` file (do not wrap in an extra parent directory).
2. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
3. Click **Add new item** and upload the `.zip`.
4. Fill in the store listing, screenshots, and privacy policy (matches https://qr-code-scanner.cc/privacy-policy).
