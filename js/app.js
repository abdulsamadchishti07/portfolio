/**
 * Application Entry Point
 * Orchestrates modules for Abdul Samad Chishti's Portfolio
 */

import { initTheme } from './modules/theme.js';
import { initNavigation } from './modules/navigation.js';
import { initProjects } from './modules/projects.js';
import { initContact } from './modules/contact.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Core Modules
  initTheme();
  initNavigation();
  initProjects();
  initContact();

  // Set Current Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Graceful handling of image errors in icon slots (excluding dynamic theme toggle)
  document.querySelectorAll('.icon-slot:not(#theme-toggle-btn *) img').forEach((img) => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      const slot = this.closest('.icon-slot');
      if (slot && !slot.textContent.trim()) {
        const altText = this.getAttribute('alt') || '';
        slot.textContent = altText.slice(0, 2).toUpperCase() || '•';
      }
    });
  });
});
