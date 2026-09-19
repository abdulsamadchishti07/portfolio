/**
 * Navigation Module
 * IntersectionObserver section spy, smooth navigation, and mobile menu drawer
 */

export function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileCloseBtn = document.getElementById('mobile-close-btn');

  // IntersectionObserver for Section Spying
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        updateActiveNav(id);
      }
    });
  }, observerOptions);

  sections.forEach((sec) => sectionObserver.observe(sec));

  function updateActiveNav(activeId) {
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href === `#${activeId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Mobile Drawer Toggle
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      openMobileDrawer();
    });

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener('click', () => {
        closeMobileDrawer();
      });
    }

    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeMobileDrawer();
      }
    });

    // Close on link click
    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileDrawer();
      });
    });

    // Close drawer when resume download link is clicked
    const resumeBtn = document.getElementById('btn-download-resume');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        setTimeout(closeMobileDrawer, 300);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileDrawer();
      }
    });
  }

  function openMobileDrawer() {
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Scroll Behavior: Hide when scrolling down, reveal when scrolling up
  const navContainer = document.querySelector('.nav-dock-container');
  let lastScrollY = window.scrollY;
  const SCROLL_THRESHOLD = 8;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 80) {
      // Always visible at the top of the page
      navContainer?.classList.remove('nav-hidden');
    } else if (currentScrollY > lastScrollY + SCROLL_THRESHOLD) {
      // Scrolling DOWN -> hide it
      navContainer?.classList.add('nav-hidden');
    } else if (currentScrollY < lastScrollY - SCROLL_THRESHOLD) {
      // Scrolling UP -> reveal it
      navContainer?.classList.remove('nav-hidden');
    }

    lastScrollY = currentScrollY;
  }, { passive: true });
}
