# Tab to QR Code Generator (Browser Extension)

1-Click QR Code generator for your active browser tab, current webpage, or custom text.

## Features
- **Instant Tab URL Detection**: Automatically grabs the active webpage URL when opened.
- **Offline Generation**: Bundles local `qrcode.min.js` so it works 100% offline with zero external API calls.
- **Live Text Editing**: Easily modify URL or replace with custom text, WiFi strings, contact details, or notes.
- **1-Click Download**: Saves high-resolution PNG image directly to your computer.
- **Copy Image**: Copies raw PNG image to your system clipboard to paste directly into Figma, Slack, Discord, WhatsApp, or Word documents.
- **Direct Link**: Seamlessly redirects to [QR Code Generator](https://qr-code-scanner.cc/qr-code-generator) for advanced color styles, frames, and logos.

## How to Test Locally (Chrome / Edge / Brave / Opera)
1. Open your browser and go to `chrome://extensions` (or `edge://extensions`).
2. Turn on **Developer mode** in the top right.
3. Click **Load unpacked**.
4. Select the `extensions/2-tab-qr-generator` folder.
5. Click the extension icon on any website to generate its QR code instantly!

## Chrome Web Store Listing
- Package directory contents into a `.zip` file.
- Manifest V3 compliant.
- Required Permissions: Only `activeTab` (allows reading current tab URL on click).
