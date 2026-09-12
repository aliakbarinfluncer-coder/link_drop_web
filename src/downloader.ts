// Downloader Engine & "DRIPPING..." Animation State Controller (LinkDrop Edition)

import confetti from 'canvas-confetti';
import { playDropSound, playSuccessSound } from './audio';

export interface VideoMetadata {
  platform: string;
  title: string;
  author: string;
  duration: string;
  thumbnail: string;
  hdSize: string;
  sdSize: string;
  audioSize: string;
}

export type OrbState = 'idle' | 'dripping' | 'done';

let currentState: OrbState = 'idle';
let currentProgress = 0;
let progressInterval: number | undefined;

export function getOrbState(): OrbState {
  return currentState;
}

export function detectPlatform(url: string): { name: string; thumbnail: string; title: string; author: string } {
  const lower = url.toLowerCase();

  if (lower.includes('instagram.com')) {
    return {
      name: 'Instagram Reel',
      thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80',
      title: 'Viral Aesthetic Travel Reel 🎬✨',
      author: '@traveler • Instagram'
    };
  } else if (lower.includes('tiktok.com')) {
    return {
      name: 'TikTok Video',
      thumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80',
      title: 'Trending Dance Challenge 🎵🔥 #fyp',
      author: '@dancer • TikTok'
    };
  } else if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return {
      name: 'YouTube Shorts',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      title: 'Mindblowing 4K Nature Cinematics 🍃',
      author: 'PlanetEarth • YouTube'
    };
  } else if (lower.includes('twitter.com') || lower.includes('x.com')) {
    return {
      name: 'X (Twitter) Clip',
      thumbnail: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=600&auto=format&fit=crop&q=80',
      title: 'Breaking Tech Showcase Clip ⚡',
      author: '@techinsider • X'
    };
  } else if (lower.includes('pinterest.com') || lower.includes('pin.it')) {
    return {
      name: 'Pinterest Video Pin',
      thumbnail: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=600&auto=format&fit=crop&q=80',
      title: 'Aesthetic DIY Home Decor Guide 📌✨',
      author: '@creator • Pinterest'
    };
  } else if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
    return {
      name: 'Facebook Watch Video',
      thumbnail: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=600&auto=format&fit=crop&q=80',
      title: 'Trending Viral Moments Clip 👥🔥',
      author: 'ViralStream • Facebook'
    };
  } else {
    return {
      name: 'Social Media Video',
      thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
      title: 'Downloaded Media Stream 🌟',
      author: 'LinkDrop Fast Stream'
    };
  }
}

export function startDripping(url: string, onComplete?: () => void): void {
  if (currentState === 'dripping') return;

  currentState = 'dripping';
  currentProgress = 0;

  const orbStage = document.getElementById('orb-stage');
  const idleContent = document.getElementById('orb-idle-content');
  const drippingContent = document.getElementById('orb-dripping-content');
  const doneContent = document.getElementById('orb-done-content');
  const progressNum = document.getElementById('progress-number');
  const liquidFill = document.getElementById('drop-liquid-fill');
  const liquidWaveContainer = document.getElementById('liquid-wave-container');
  const orbHint = document.getElementById('orb-hint');
  const resultCard = document.getElementById('result-card');

  if (resultCard) resultCard.classList.add('hidden');
  if (idleContent) idleContent.classList.add('hidden');
  if (doneContent) doneContent.classList.add('hidden');
  if (drippingContent) drippingContent.classList.remove('hidden');
  if (orbStage) orbStage.classList.add('dripping');

  if (orbHint) {
    orbHint.innerHTML = '<span class="hint-dot"></span> Dripping media from social hub...';
  }

  // Animate progress 0 -> 100%
  if (progressInterval) clearInterval(progressInterval);

  let stepCount = 0;
  playDropSound();

  progressInterval = window.setInterval(() => {
    stepCount++;
    const increment = Math.floor(Math.random() * 8) + 4;
    currentProgress = Math.min(100, currentProgress + increment);

    if (progressNum) {
      progressNum.textContent = currentProgress.toString();
    }
    if (liquidFill) {
      liquidFill.style.width = `${currentProgress}%`;
    }
    if (liquidWaveContainer) {
      liquidWaveContainer.style.height = `${currentProgress}%`;
    }

    // Play periodic water drop sounds
    if (stepCount % 3 === 0 && currentProgress < 95) {
      playDropSound();
    }

    if (currentProgress >= 100) {
      clearInterval(progressInterval);
      completeDrip(url, onComplete);
    }
  }, 110);
}

function completeDrip(url: string, onComplete?: () => void): void {
  currentState = 'done';

  const orbStage = document.getElementById('orb-stage');
  const drippingContent = document.getElementById('orb-dripping-content');
  const doneContent = document.getElementById('orb-done-content');
  const orbHint = document.getElementById('orb-hint');

  if (orbStage) orbStage.classList.remove('dripping');
  if (drippingContent) drippingContent.classList.add('hidden');
  if (doneContent) doneContent.classList.remove('hidden');

  if (orbHint) {
    orbHint.innerHTML = '<span class="hint-dot"></span> Drop complete! Choose video quality below.';
  }

  // Audio & Confetti Celebration
  playSuccessSound();
  triggerCelebration();

  // Populate Result Card
  displayResultCard(url);

  if (onComplete) {
    onComplete();
  }
}

function triggerCelebration(): void {
  try {
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#cbfb1c', '#25d366', '#ffffff', '#38bdf8', '#f59e0b']
    });
  } catch {
    // Canvas-confetti fallback
  }
}

function displayResultCard(url: string): void {
  const meta = detectPlatform(url);
  const resultCard = document.getElementById('result-card');
  const platformTag = document.getElementById('res-platform-tag');
  const thumbnail = document.getElementById('res-thumbnail') as HTMLImageElement | null;
  const title = document.getElementById('res-title');
  const author = document.getElementById('res-author');

  if (platformTag) platformTag.textContent = meta.name;
  if (thumbnail) thumbnail.src = meta.thumbnail;
  if (title) title.textContent = meta.title;
  if (author) author.textContent = meta.author;

  if (resultCard) {
    resultCard.classList.remove('hidden');
    resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  setupDownloadTriggers(meta.title);
}

function setupDownloadTriggers(videoTitle: string): void {
  const hdBtn = document.getElementById('dl-video-hd-btn');
  const sdBtn = document.getElementById('dl-video-sd-btn');
  const audioBtn = document.getElementById('dl-audio-btn');

  const triggerDownload = (fileName: string, type: string) => {
    const blob = new Blob([`LinkDrop downloaded content: ${fileName}`], { type });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  const sanitizeName = (name: string) => name.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);

  if (hdBtn) {
    hdBtn.onclick = () => triggerDownload(`${sanitizeName(videoTitle)}_1080p.mp4`, 'video/mp4');
  }
  if (sdBtn) {
    sdBtn.onclick = () => triggerDownload(`${sanitizeName(videoTitle)}_720p.mp4`, 'video/mp4');
  }
  if (audioBtn) {
    audioBtn.onclick = () => triggerDownload(`${sanitizeName(videoTitle)}_audio.mp3`, 'audio/mp3');
  }
}

export function resetOrb(): void {
  currentState = 'idle';
  currentProgress = 0;

  const orbStage = document.getElementById('orb-stage');
  const idleContent = document.getElementById('orb-idle-content');
  const drippingContent = document.getElementById('orb-dripping-content');
  const doneContent = document.getElementById('orb-done-content');
  const liquidWaveContainer = document.getElementById('liquid-wave-container');
  const resultCard = document.getElementById('result-card');
  const orbHint = document.getElementById('orb-hint');

  if (orbStage) orbStage.classList.remove('dripping');
  if (drippingContent) drippingContent.classList.add('hidden');
  if (doneContent) doneContent.classList.add('hidden');
  if (idleContent) idleContent.classList.remove('hidden');
  if (resultCard) resultCard.classList.add('hidden');

  if (liquidWaveContainer) {
    liquidWaveContainer.style.height = '0%';
  }

  if (orbHint) {
    orbHint.innerHTML = '<span class="hint-dot"></span> Copy link to clipboard, then push the button above';
  }
}
