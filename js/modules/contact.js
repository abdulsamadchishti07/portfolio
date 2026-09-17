/**
 * Contact & Utilities Module
 * Copy email action, live PKT time ticker, toast feedback, and accessible form validation
 */

export function initContact() {
  const copyBtn = document.getElementById('btn-copy-email');
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const timeClock = document.getElementById('local-time-display');

  // Copy Email to Clipboard
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = 'abdulsamadchishti07@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        showToast('Email address copied to clipboard!');
        const btnText = copyBtn.querySelector('.btn-copy-text');
        if (btnText) {
          const original = btnText.textContent;
          btnText.textContent = 'Copied!';
          setTimeout(() => {
            btnText.textContent = original;
          }, 2000);
        }
      } catch (err) {
        // Fallback prompt if clipboard API is restricted
        prompt('Copy email address:', email);
      }
    });
  }

  // Modern Accessible Form Validation (:user-invalid sync with aria-invalid)
  if (contactForm) {
    const inputs = contactForm.querySelectorAll('input, textarea');

    const syncAria = (el) => {
      if (el.matches(':user-invalid')) {
        el.setAttribute('aria-invalid', 'true');
      } else if (el.matches(':user-valid')) {
        el.removeAttribute('aria-invalid');
      }
    };

    inputs.forEach((input) => {
      input.addEventListener('blur', () => syncAria(input));
      input.addEventListener('input', () => {
        if (input.hasAttribute('aria-invalid')) {
          syncAria(input);
        }
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        contactForm.reset();
        showToast('Thank you! Your message has been sent successfully.');
      }, 800);
    });
  }

  // Floating Toast System
  function showToast(message) {
    if (!toast) return;
    const toastMessage = toast.querySelector('.toast-message') || toast;
    toastMessage.textContent = message;
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 3500);
  }

  // Local Time Clock (PKT / UTC+5)
  function updateTime() {
    if (!timeClock) return;
    try {
      const now = new Date();
      const options = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      const formatter = new Intl.DateTimeFormat([], options);
      timeClock.textContent = `${formatter.format(now)} PKT (UTC+5)`;
    } catch (e) {
      timeClock.textContent = 'UTC+5 (PKT)';
    }
  }

  updateTime();
  setInterval(updateTime, 30000);
}
