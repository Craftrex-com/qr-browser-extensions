# WiFi QR Code Creator (Browser Extension)

Easily generate WiFi QR codes to share your home, office, cafe, or Airbnb network without typing long passwords.

## Features
- **100% Offline & Private**: Runs entirely in the popup. No passwords or network credentials ever touch the internet.
- **Zero Special Permissions**: Doesn't require any invasive browser permissions (`"permissions": []`).
- **Standard WiFi URI Support**: Fully compatible with iOS Camera, Android Camera, Samsung, Xiaomi, and Google Pixel (`WIFI:T:...;S:...;P:...;;`).
- **Password Toggle**: Easily reveal or hide password while typing.
- **Hidden Network Support**: Toggle hidden SSID broadcast.
- **1-Click Download**: High-quality PNG QR code image download.
- **Instant Printable Guest Card**: Pre-styled printable card with QR code and network details for fridge, desk, or guest rooms.
- **Direct Link**: Seamlessly connects to [Online WiFi QR Scanner & Generator](https://qr-code-scanner.cc/wifi-qr-code-scanner).

## How to Test Locally (Chrome / Edge / Brave / Opera)
1. Open `chrome://extensions` or `edge://extensions`.
2. Enable **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the `extensions/3-wifi-qr-creator` folder.
5. Click the extension icon in your toolbar, type an SSID & password, and test!

## How to Publish to Chrome Web Store
1. Compress this folder's contents into a `.zip` file.
2. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
3. Upload the `.zip` file.
4. Because this extension requests **0 permissions**, reviews are usually approved very quickly!
