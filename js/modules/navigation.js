/**
 * Navigation Module
 * IntersectionObserver section spy, smooth navigation, and mobile menu drawer
 */

export function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileDropdown = document.getElementById('mobile-nav-dropdown');
  const mobileBackdrop = document.getElementById('mobile-nav-backdrop');

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

  // Mobile Dropdown Toggle
  if (mobileMenuBtn && mobileDropdown) {
    const iconSpan = mobileMenuBtn.querySelector('span');

    const openDropdown = () => {
      mobileDropdown.style.display = 'flex';
      if (mobileBackdrop) mobileBackdrop.style.display = 'block';
      requestAnimationFrame(() => {
        mobileDropdown.classList.add('open');
        mobileDropdown.setAttribute('aria-hidden', 'false');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        if (iconSpan) iconSpan.textContent = '✕';
        if (mobileBackdrop) {
          mobileBackdrop.classList.add('open');
          mobileBackdrop.setAttribute('aria-hidden', 'false');
        }
      });
    };

    const closeDropdown = () => {
      mobileDropdown.classList.remove('open');
      mobileDropdown.setAttribute('aria-hidden', 'true');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      if (iconSpan) iconSpan.textContent = '☰';
      if (mobileBackdrop) {
        mobileBackdrop.classList.remove('open');
        mobileBackdrop.setAttribute('aria-hidden', 'true');
      }
      setTimeout(() => {
        if (!mobileDropdown.classList.contains('open')) {
          mobileDropdown.style.display = 'none';
          if (mobileBackdrop) mobileBackdrop.style.display = 'none';
        }
      }, 240);
    };

    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (mobileDropdown.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener('click', closeDropdown);
    }

    // Close on link click
    mobileDropdown.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', closeDropdown);
    });

    // Close on resume download click
    const resumeBtn = document.getElementById('btn-download-resume');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        setTimeout(closeDropdown, 300);
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDropdown.classList.contains('open')) {
        closeDropdown();
      }
    });

    // Close if user clicks outside
    document.addEventListener('click', (e) => {
      if (mobileDropdown.classList.contains('open') && !mobileDropdown.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  // Scroll Behavior: Hide when scrolling down, reveal when scrolling up
  const navContainer = document.querySelector('.nav-dock-container');
  let lastScrollY = window.scrollY;
  const SCROLL_THRESHOLD = 8;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;

    // If dropdown is open, keep dock pinned
    if (mobileDropdown && mobileDropdown.classList.contains('open')) {
      return;
    }

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
