let qrInstance = null;
let debounceTimer = null;

const ssidInput = document.getElementById('ssid');
const passInput = document.getElementById('password');
const secSelect = document.getElementById('security');
const hiddenCheckbox = document.getElementById('hidden');
const togglePassBtn = document.getElementById('togglePass');
const qrContainer = document.getElementById('qrcode');
const qrPrompt = document.getElementById('qrPrompt');
const downloadBtn = document.getElementById('downloadBtn');
const printBtn = document.getElementById('printBtn');
const statusEl = document.getElementById('status');
const webToolLink = document.getElementById('webToolLink');

function showStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.className = 'status' + (isError ? ' error' : '');
  statusEl.classList.remove('hidden');
  setTimeout(() => {
    statusEl.classList.add('hidden');
  }, 2200);
}

// Escape special characters for WiFi standard URI format
function escapeWifi(str) {
  return (str || '').replace(/([\\;,:"])/g, '\\$1');
}

function buildWifiString() {
  const ssid = ssidInput.value.trim();
  if (!ssid) return '';

  const pass = passInput.value;
  const sec = secSelect.value;
  const isHidden = hiddenCheckbox.checked;

  let wifiStr = `WIFI:T:${sec};S:${escapeWifi(ssid)};`;
  if (sec !== 'nopass' && pass) {
    wifiStr += `P:${escapeWifi(pass)};`;
  }
  if (isHidden) {
    wifiStr += `H:true;`;
  }
  wifiStr += ';';
  return wifiStr;
}

function updateQR() {
  const wifiString = buildWifiString();
  qrContainer.innerHTML = '';

  if (!wifiString) {
    qrPrompt.classList.remove('hidden');
    downloadBtn.disabled = true;
    printBtn.disabled = true;
    return;
  }

  qrPrompt.classList.add('hidden');
  downloadBtn.disabled = false;
  printBtn.disabled = false;

  try {
    qrInstance = new QRCode(qrContainer, {
      text: wifiString,
      width: 150,
      height: 150,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (err) {
    console.error('QR creation error:', err);
    showStatus('Generation error', true);
  }
}

function getQRCanvas() {
  const canvas = qrContainer.querySelector('canvas');
  if (canvas) return canvas;

  const img = qrContainer.querySelector('img');
  if (img && img.src) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || 150;
    c.height = img.naturalHeight || 150;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return c;
  }
  return null;
}

// Toggle password visibility
togglePassBtn.addEventListener('click', () => {
  const isPass = passInput.type === 'password';
  passInput.type = isPass ? 'text' : 'password';
  togglePassBtn.style.color = isPass ? '#0891b2' : '#64748b';
});

// Input event listeners
[ssidInput, passInput, secSelect, hiddenCheckbox].forEach((elem) => {
  elem.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(updateQR, 150);
  });
});

// Download PNG
downloadBtn.addEventListener('click', () => {
  const canvas = getQRCanvas();
  if (!canvas) {
    showStatus('No QR code ready', true);
    return;
  }

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const ssid = (ssidInput.value.trim() || 'wifi').replace(/[^a-zA-Z0-9_-]/g, '_');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `wifi-${ssid}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showStatus('WiFi QR Downloaded!');
  } catch (err) {
    console.error(err);
    showStatus('Download failed', true);
  }
});

// Print WiFi Guest Card
printBtn.addEventListener('click', () => {
  const canvas = getQRCanvas();
  if (!canvas) return;

  const dataUrl = canvas.toDataURL('image/png');
  const ssid = ssidInput.value.trim();
  const pass = passInput.value;

  const printWindow = window.open('', '_blank', 'width=500,height=600');
  if (!printWindow) {
    showStatus('Pop-up blocked. Allow popups to print.', true);
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WiFi Access Card - ${ssid}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f1f5f9; }
        .card { width: 340px; background: white; border: 2px dashed #0891b2; border-radius: 16px; padding: 28px; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        h1 { margin: 0 0 6px 0; font-size: 22px; color: #164e63; }
        p.subtitle { margin: 0 0 16px 0; font-size: 13px; color: #64748b; }
        img.qr { width: 180px; height: 180px; margin: 0 auto 16px auto; display: block; }
        .info { background: #f8fafc; border-radius: 8px; padding: 12px; font-size: 13px; text-align: left; }
        .info-row { margin-bottom: 6px; }
        .info-row:last-child { margin-bottom: 0; }
        .label { font-weight: 700; color: #475569; }
        .val { color: #0f172a; font-family: monospace; }
        .footer { margin-top: 14px; font-size: 11px; color: #94a3b8; }
        @media print { body { background: white; } .card { box-shadow: none; border-color: #000; } }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Connect to Wi-Fi</h1>
        <p class="subtitle">Scan this QR code with your phone camera</p>
        <img class="qr" src="${dataUrl}" alt="WiFi QR" />
        <div class="info">
          <div class="info-row"><span class="label">Network:</span> <span class="val">${ssid}</span></div>
          ${pass ? `<div class="info-row"><span class="label">Password:</span> <span class="val">${pass}</span></div>` : ''}
        </div>
        <div class="footer">Powered by QR Scanner Tool (qr-code-scanner.cc)</div>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
});

// External link opening
if (webToolLink) {
  webToolLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (chrome && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: webToolLink.href });
    } else {
      window.open(webToolLink.href, '_blank');
    }
  });
}

// Initial state
updateQR();
