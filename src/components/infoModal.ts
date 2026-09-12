// Info / About Modal Controller

import { playTapSound } from '../audio';

export function initInfoModal(): void {
  const footerInfoBtn = document.getElementById('footer-info-btn');
  const infoModal = document.getElementById('info-modal');
  const infoBackdrop = document.getElementById('info-modal-backdrop');
  const closeBtn = document.getElementById('info-close-btn');

  const open = () => {
    playTapSound();
    if (infoModal) infoModal.classList.remove('hidden');
  };

  const close = () => {
    playTapSound();
    if (infoModal) infoModal.classList.add('hidden');
  };

  if (footerInfoBtn) footerInfoBtn.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (infoBackdrop) infoBackdrop.addEventListener('click', close);
}
