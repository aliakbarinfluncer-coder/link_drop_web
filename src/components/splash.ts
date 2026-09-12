// Cinematic Splash / Entrance Motion Controller

import { playSuccessSound } from '../audio';

export function initSplashScreen(onComplete?: () => void): void {
  const splash = document.getElementById('splash-screen');
  const appContainer = document.getElementById('main-app-container');

  if (!splash) {
    if (onComplete) onComplete();
    return;
  }

  // Allow clicking anywhere to skip splash
  let completed = false;

  const finishSplash = () => {
    if (completed) return;
    completed = true;

    splash.classList.add('splash-exit');
    if (appContainer) {
      appContainer.classList.add('app-enter');
    }

    playSuccessSound();

    setTimeout(() => {
      splash.remove();
      if (onComplete) onComplete();
    }, 600);
  };

  splash.addEventListener('click', finishSplash);

  // Auto-transition after sequence (approx 1.8s)
  setTimeout(() => {
    finishSplash();
  }, 2000);
}
