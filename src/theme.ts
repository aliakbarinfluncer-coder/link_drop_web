// Theme Manager: Dark & Light Mode

export type Theme = 'dark' | 'light';

const THEME_KEY = 'reeldrop_theme_preference';

export function initTheme(): void {
  const saved = localStorage.getItem(THEME_KEY) as Theme | null;
  const preferredTheme: Theme = saved || 'dark'; // Dark mode is default per screenshots
  applyTheme(preferredTheme);

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

export function applyTheme(theme: Theme): void {
  const html = document.documentElement;
  if (theme === 'light') {
    html.classList.remove('dark');
    html.classList.add('light');
  } else {
    html.classList.remove('light');
    html.classList.add('dark');
  }

  // Update meta theme-color for mobile address bars
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', theme === 'dark' ? '#000000' : '#f7f9f3');
  }

  localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme(): Theme {
  const isLight = document.documentElement.classList.contains('light');
  const nextTheme: Theme = isLight ? 'dark' : 'light';
  applyTheme(nextTheme);
  return nextTheme;
}
