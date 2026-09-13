// Theme Manager: Dark & Light Mode

export type Theme = 'dark' | 'light';

const THEME_KEYS = ['reeldrop_theme_preference', 'linkdrop_theme'];

export function getSavedTheme(): Theme {
  try {
    for (const key of THEME_KEYS) {
      const val = localStorage.getItem(key);
      if (val === 'light' || val === 'dark') {
        return val as Theme;
      }
    }
  } catch {
    // Ignore storage restriction errors in private / in-app webviews
  }
  return 'dark'; // Dark mode is default
}

export function applyTheme(theme: Theme): void {
  const html = document.documentElement;
  if (theme === 'light') {
    html.classList.remove('dark');
    html.classList.add('light');
    html.setAttribute('data-theme', 'light');
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
  }

  // Update meta theme-color for mobile address bars
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#000000' : '#f7f9f3');
  }

  try {
    for (const key of THEME_KEYS) {
      localStorage.setItem(key, theme);
    }
  } catch {
    // Ignore storage restriction errors
  }
}

export function toggleTheme(): Theme {
  const isLight = document.documentElement.classList.contains('light');
  const nextTheme: Theme = isLight ? 'dark' : 'light';
  applyTheme(nextTheme);
  return nextTheme;
}

export function initTheme(): void {
  const preferredTheme = getSavedTheme();
  applyTheme(preferredTheme);

  // Direct element listener
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.removeEventListener('click', toggleTheme);
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Also attach via document event delegation so it NEVER misses clicks
  document.addEventListener('click', (e) => {
    const target = (e.target as HTMLElement | null)?.closest('#theme-toggle-btn');
    if (target) {
      toggleTheme();
    }
  });

  // Expose to window for inline onclick fallback
  (window as unknown as { toggleLinkDropTheme: () => Theme }).toggleLinkDropTheme = toggleTheme;
}

