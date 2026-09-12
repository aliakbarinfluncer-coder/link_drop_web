// Clipboard Detection & URL Validation

import { playErrorSound } from './audio';

let toastTimeout: number | undefined;

export function showToast(message: string = 'NO URL FOUND IN CLIPBOARD'): void {
  const toastBanner = document.getElementById('toast-banner');
  const toastMessage = document.getElementById('toast-message');

  if (!toastBanner || !toastMessage) return;

  toastMessage.textContent = message;
  toastBanner.classList.remove('hidden');

  playErrorSound();

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = window.setTimeout(() => {
    toastBanner.classList.add('hidden');
  }, 3200);
}

/** Check if a string contains a valid video or social link */
export function extractValidUrl(text: string): string | null {
  if (!text || typeof text !== 'string') return null;

  const trimmed = text.trim();

  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const match = trimmed.match(urlRegex);

  if (!match || match.length === 0) {
    return null;
  }

  const url = match[0];

  // Validate supported social domains
  const supportedPatterns = [
    /instagram\.com/i,
    /tiktok\.com/i,
    /youtube\.com|youtu\.be/i,
    /twitter\.com|x\.com/i,
    /facebook\.com|fb\.watch/i,
    /threads\.net/i,
    /pinterest\.com|pin\.it/i,
    /reddit\.com/i
  ];

  const isSupported = supportedPatterns.some((pattern) => pattern.test(url));
  return isSupported ? url : url; // If any valid URL, still permit it
}

/** Attempt to read clipboard text */
export async function readClipboardUrl(): Promise<string | null> {
  try {
    if (!navigator.clipboard || !navigator.clipboard.readText) {
      showToast('CLIPBOARD ACCESS NOT SUPPORTED ON THIS BROWSER');
      return null;
    }

    const text = await navigator.clipboard.readText();
    const validUrl = extractValidUrl(text);

    if (!validUrl) {
      showToast('NO URL FOUND IN CLIPBOARD');
      return null;
    }

    return validUrl;
  } catch {
    // If user denies permission or browser restricts clipboard
    showToast('NO URL FOUND IN CLIPBOARD');
    return null;
  }
}
