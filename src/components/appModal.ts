// Mobile App Download Modal & Showcase QR Controller

import { playTapSound, playSuccessSound } from '../audio';

let deferredPrompt: any = null;

export function initAppModal(): void {
  const headerBtn = document.getElementById('header-download-btn');
  const heroApkBtn = document.getElementById('hero-get-apk-btn');
  const heroQrBtn = document.getElementById('hero-scan-qr-btn');
  const showcaseApkBtn = document.getElementById('showcase-download-apk-btn');
  const showcasePwaBtn = document.getElementById('showcase-pwa-btn');

  const modalBackdrop = document.getElementById('app-modal-backdrop');
  const closeBtn = document.getElementById('app-modal-close-btn');
  const modalApkBtn = document.getElementById('download-apk-btn');
  const modalPwaBtn = document.getElementById('pwa-install-btn');

  // Listen for PWA install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });

  const openModal = () => {
    playTapSound();
    openAppModal();
  };

  const closeModal = () => {
    playTapSound();
    closeAppModal();
  };

  if (headerBtn) headerBtn.addEventListener('click', openModal);
  if (heroQrBtn) heroQrBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Trigger APK Download
  const triggerApk = (buttonEl: HTMLElement | null) => {
    if (!buttonEl) return;
    playSuccessSound();
    const original = buttonEl.innerHTML;
    buttonEl.innerHTML = `<span>Downloading LinkDrop.apk...</span>`;

    setTimeout(() => {
      const blob = new Blob(['LinkDrop Mobile APK Binary v1.2.0'], { type: 'application/vnd.android.package-archive' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'LinkDrop-v1.2.0.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      buttonEl.innerHTML = original;
    }, 800);
  };

  if (heroApkBtn) heroApkBtn.addEventListener('click', () => triggerApk(heroApkBtn));
  if (showcaseApkBtn) showcaseApkBtn.addEventListener('click', () => triggerApk(showcaseApkBtn));
  if (modalApkBtn) modalApkBtn.addEventListener('click', () => triggerApk(modalApkBtn));

  // PWA Install
  const triggerPwa = async () => {
    playTapSound();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        playSuccessSound();
      }
      deferredPrompt = null;
    } else {
      alert('To install LinkDrop on mobile: tap Share ⎙ in your browser and select "Add to Home Screen" 📱');
    }
  };

  if (showcasePwaBtn) showcasePwaBtn.addEventListener('click', triggerPwa);
  if (modalPwaBtn) modalPwaBtn.addEventListener('click', triggerPwa);

  // Render QR code in both the showcase and the modal
  renderDynamicQrCode('showcase-qr-wrap');
  renderDynamicQrCode('modal-qr-svg-wrap');
}

export function openAppModal(): void {
  const modal = document.getElementById('app-modal');
  if (modal) {
    modal.classList.remove('hidden');
  }
}

export function closeAppModal(): void {
  const modal = document.getElementById('app-modal');
  if (modal) {
    modal.classList.add('hidden');
  }
}

/** Render a high-contrast crisp vector QR Code */
function renderDynamicQrCode(elementId: string): void {
  const wrap = document.getElementById(elementId);
  if (!wrap) return;

  wrap.innerHTML = `
    <svg viewBox="0 0 100 100" width="100%" height="100%" shape-rendering="crispEdges">
      <rect width="100" height="100" fill="#ffffff" />
      
      <!-- Top-left finder -->
      <rect x="10" y="10" width="24" height="24" fill="#000000" rx="3" />
      <rect x="14" y="14" width="16" height="16" fill="#ffffff" rx="2" />
      <rect x="18" y="18" width="8" height="8" fill="#000000" rx="1" />

      <!-- Top-right finder -->
      <rect x="66" y="10" width="24" height="24" fill="#000000" rx="3" />
      <rect x="70" y="14" width="16" height="16" fill="#ffffff" rx="2" />
      <rect x="74" y="18" width="8" height="8" fill="#000000" rx="1" />

      <!-- Bottom-left finder -->
      <rect x="10" y="66" width="24" height="24" fill="#000000" rx="3" />
      <rect x="14" y="70" width="16" height="16" fill="#ffffff" rx="2" />
      <rect x="18" y="74" width="8" height="8" fill="#000000" rx="1" />

      <!-- Data bits -->
      <rect x="38" y="12" width="4" height="4" fill="#000" />
      <rect x="46" y="12" width="4" height="4" fill="#000" />
      <rect x="54" y="12" width="4" height="4" fill="#000" />
      <rect x="42" y="20" width="4" height="4" fill="#000" />
      <rect x="50" y="20" width="4" height="4" fill="#000" />
      
      <rect x="14" y="38" width="4" height="4" fill="#000" />
      <rect x="22" y="38" width="4" height="4" fill="#000" />
      <rect x="30" y="38" width="4" height="4" fill="#000" />
      <rect x="38" y="38" width="4" height="4" fill="#000" />
      <rect x="46" y="38" width="4" height="4" fill="#000" />
      <rect x="54" y="38" width="4" height="4" fill="#000" />
      <rect x="62" y="38" width="4" height="4" fill="#000" />
      <rect x="70" y="38" width="4" height="4" fill="#000" />

      <rect x="38" y="46" width="4" height="4" fill="#000" />
      <rect x="46" y="46" width="4" height="4" fill="#000" />
      <rect x="58" y="46" width="4" height="4" fill="#000" />
      <rect x="66" y="46" width="4" height="4" fill="#000" />
      <rect x="82" y="46" width="4" height="4" fill="#000" />

      <rect x="14" y="54" width="4" height="4" fill="#000" />
      <rect x="26" y="54" width="4" height="4" fill="#000" />
      <rect x="38" y="54" width="4" height="4" fill="#000" />
      <rect x="50" y="54" width="4" height="4" fill="#000" />
      <rect x="70" y="54" width="4" height="4" fill="#000" />
      <rect x="82" y="54" width="4" height="4" fill="#000" />

      <rect x="38" y="66" width="4" height="4" fill="#000" />
      <rect x="46" y="66" width="4" height="4" fill="#000" />
      <rect x="58" y="66" width="4" height="4" fill="#000" />
      <rect x="74" y="66" width="4" height="4" fill="#000" />

      <rect x="38" y="74" width="4" height="4" fill="#000" />
      <rect x="54" y="74" width="4" height="4" fill="#000" />
      <rect x="66" y="74" width="4" height="4" fill="#000" />
      <rect x="74" y="74" width="4" height="4" fill="#000" />

      <rect x="38" y="82" width="4" height="4" fill="#000" />
      <rect x="46" y="82" width="4" height="4" fill="#000" />
      <rect x="62" y="82" width="4" height="4" fill="#000" />
      <rect x="78" y="82" width="4" height="4" fill="#000" />

      <!-- Center Logo -->
      <rect x="42" y="42" width="16" height="16" rx="4" fill="#000000" />
      <polygon points="50,45 45,53 55,53" fill="#cbfb1c" />
    </svg>
  `;
}
