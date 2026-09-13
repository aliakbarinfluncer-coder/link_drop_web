// LinkDrop - Pure 1-Tap Video Downloader Main Script

import { initTheme } from './theme';
import { playTapSound } from './audio';
import { readClipboardUrl, extractValidUrl } from './clipboard';
import { startDripping, resetOrb, getOrbState } from './downloader';
import { initInfoModal } from './components/infoModal';
import { initAppModal } from './components/appModal';

function init(): void {
  // 1. Initialize Theme & Modals
  initTheme();
  initInfoModal();
  initAppModal();

  // 2. DOM Elements
  const pushOrbBtn = document.getElementById('push-orb-btn');
  const resetDropBtn = document.getElementById('reset-drop-btn');

  // 3. Central Tactile Push Orb Click Handler (Pure 1-Tap Clipboard Drip)
  if (pushOrbBtn) {
    pushOrbBtn.addEventListener('click', async () => {
      playTapSound();

      if (getOrbState() === 'dripping') {
        return;
      }

      // Read directly from user clipboard
      const clipboardUrl = await readClipboardUrl();
      if (clipboardUrl) {
        startDripping(clipboardUrl);
      }
    });
  }

  // 4. Sample Quick-Test Chips & Floating Orbit Badges (Instant Test Links)
  const testTriggers = document.querySelectorAll('.sample-chip, .orbit-badge');
  testTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      playTapSound();
      const target = e.currentTarget as HTMLElement;
      const sampleUrl = target.getAttribute('data-sample');
      if (sampleUrl) {
        startDripping(sampleUrl);
      }
    });
  });

  // 5. Reset Button ("Drop Another Video")
  if (resetDropBtn) {
    resetDropBtn.addEventListener('click', () => {
      playTapSound();
      resetOrb();
    });
  }

  // 6. Global Paste Shortcut (Ctrl+V anywhere on page)
  window.addEventListener('paste', (e) => {
    const pastedText = e.clipboardData?.getData('text');
    if (pastedText) {
      const valid = extractValidUrl(pastedText);
      if (valid) {
        playTapSound();
        startDripping(valid);
      }
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

