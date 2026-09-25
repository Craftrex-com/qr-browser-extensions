let qrInstance = null;
let debounceTimer = null;

const qrContainer = document.getElementById('qrcode');
const qrInput = document.getElementById('qrInput');
const charCount = document.getElementById('charCount');
const downloadBtn = document.getElementById('downloadBtn');
const copyBtn = document.getElementById('copyBtn');
const statusEl = document.getElementById('status');
const loadingEl = document.getElementById('loading');
const webToolLink = document.getElementById('webToolLink');

function showStatus(text, isError = false) {
  statusEl.textContent = text;
  statusEl.className = 'status' + (isError ? ' error' : '');
  statusEl.classList.remove('hidden');
  setTimeout(() => {
    statusEl.classList.add('hidden');
  }, 2200);
}

function renderQR(text) {
  const clean = (text || '').trim();
  charCount.textContent = clean.length;
  qrContainer.innerHTML = '';

  if (!clean) {
    qrContainer.innerHTML = '<div style="font-size:12px;color:#94a3b8;text-align:center;padding:20px;">Enter text or URL to generate QR</div>';
    return;
  }

  try {
    qrInstance = new QRCode(qrContainer, {
      text: clean,
      width: 170,
      height: 170,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (err) {
    console.error('QR generation error:', err);
    showStatus('Text too long for QR matrix', true);
  }
}

function getQRCanvas() {
  const canvas = qrContainer.querySelector('canvas');
  if (canvas) return canvas;

  const img = qrContainer.querySelector('img');
  if (img && img.src) {
    const c = document.createElement('canvas');
    c.width = img.naturalWidth || 170;
    c.height = img.naturalHeight || 170;
    const ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    return c;
  }
  return null;
}

// 1-Click Download PNG
downloadBtn.addEventListener('click', () => {
  const canvas = getQRCanvas();
  if (!canvas) {
    showStatus('No QR code to download', true);
    return;
  }

  try {
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode-' + Date.now() + '.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showStatus('Downloaded PNG!');
  } catch (err) {
    console.error(err);
    showStatus('Failed to download', true);
  }
});

// Copy Image to Clipboard
copyBtn.addEventListener('click', async () => {
  const canvas = getQRCanvas();
  if (!canvas) {
    showStatus('No QR code to copy', true);
    return;
  }

  try {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        showStatus('Failed to generate image blob', true);
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
        showStatus('QR image copied to clipboard!');
      } catch (clipErr) {
        console.error(clipErr);
        showStatus('Clipboard permission denied', true);
      }
    }, 'image/png');
  } catch (err) {
    console.error(err);
    showStatus('Could not copy image', true);
  }
});

// Live Textarea editing with 200ms debounce
qrInput.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    renderQR(qrInput.value);
  }, 200);
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

// Initialize on open: grab active tab
document.addEventListener('DOMContentLoaded', () => {
  let defaultUrl = 'https://qr-code-scanner.cc/';

  if (chrome && chrome.tabs && chrome.tabs.query) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0 && tabs[0].url) {
        const url = tabs[0].url;
        // Don't auto-fill chrome:// or edge:// internal URLs if they look awkward
        if (!url.startsWith('chrome://') && !url.startsWith('edge://') && !url.startsWith('about:')) {
          defaultUrl = url;
        }
      }
      qrInput.value = defaultUrl;
      renderQR(defaultUrl);
    });
  } else {
    qrInput.value = defaultUrl;
    renderQR(defaultUrl);
  }
});
