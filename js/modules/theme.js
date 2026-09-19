/**
 * Theme Module
 * Smooth toggling between Warm Porcelain and Soft Obsidian
 */

export function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const storedTheme = localStorage.getItem('samad_portfolio_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }

  // Listen for system theme changes if user hasn't explicitly set one
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('samad_portfolio_theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('samad_portfolio_theme', theme);

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  if (themeToggleBtn) {
    const isDark = theme === 'dark';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to Warm Light mode' : 'Switch to Soft Dark mode');
    themeToggleBtn.setAttribute('title', isDark ? 'Switch to Warm Light mode' : 'Switch to Soft Dark mode');
    
    // Ensure inner icon-slot and SVG img always exist
    const iconSrc = isDark ? 'assets/icons/sun.svg' : 'assets/icons/moon.svg';
    const iconAlt = isDark ? 'Sun icon' : 'Moon icon';

    let iconSlot = themeToggleBtn.querySelector('.icon-slot');
    if (!iconSlot) {
      themeToggleBtn.innerHTML = `
        <div class="icon-slot icon-sm">
          <img src="${iconSrc}" alt="${iconAlt}">
        </div>
      `;
    } else {
      let iconImg = iconSlot.querySelector('img');
      if (!iconImg) {
        iconSlot.innerHTML = `<img src="${iconSrc}" alt="${iconAlt}">`;
      } else {
        iconImg.src = iconSrc;
        iconImg.alt = iconAlt;
      }
    }
  }
}
