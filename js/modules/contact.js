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

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalHtml = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      // FormSubmit.co AJAX endpoint (free, zero API key, forwards to abdulsamadchishti07@gmail.com)
      const FORM_ENDPOINT = 'https://formsubmit.co/ajax/abdulsamadchishti07@gmail.com';

      const formData = new FormData(contactForm);
      const payload = {
        name: formData.get('name') || '',
        email: formData.get('email') || '',
        subject: formData.get('subject') || 'New Portfolio Message',
        message: formData.get('message') || '',
        _honey: formData.get('_honey') || '',
        _subject: `Portfolio Contact: ${formData.get('subject') || 'General Inquiry'} (${formData.get('name') || 'Visitor'})`
      };

      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          contactForm.reset();
          showToast('Thank you! Your message has been sent successfully.');
        } else {
          throw new Error(`Submission failed with status: ${res.status}`);
        }
      } catch (err) {
        showToast('Message could not be sent. Please email directly at abdulsamadchishti07@gmail.com');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHtml;
      }
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

  // Local Time Clock according to visitor's system timezone
  function updateTime() {
    if (!timeClock) return;
    try {
      const now = new Date();
      timeClock.textContent = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (e) {
      timeClock.textContent = '';
    }
  }

  updateTime();
  setInterval(updateTime, 30000);
}
