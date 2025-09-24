// All scripts wrapped in DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {

  /* ---------------- Smooth scroll for internal nav links ---------------- */
  document.querySelectorAll('.nav-links a, .btn, .card-btn').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------------- Navbar scrolled class toggle ---------------- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  /* ---------------- Reveal animation using IntersectionObserver ---------------- */
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach(el => io.observe(el));
  } else {
    // fallback
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* ---------------- Toast helper ---------------- */
  const toastEl = document.getElementById('toast');
  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add('show');
    setTimeout(() => {
      toastEl.classList.remove('show');
    }, 3000);
  }

  /* ---------------- Copy email ---------------- */
  const copyEmailBtn = document.getElementById('copy-email');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = (copyEmailBtn.textContent || '').trim() || 'rockbelt93@gmail.com';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(email);
          showToast('📧 Email copied to clipboard');
        } else {
          const ta = document.createElement('textarea');
          ta.value = email;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('📧 Email copied to clipboard');
        }
      } catch (err) {
        showToast('⚠️ Copy failed — opening email client');
        window.location.href = `mailto:${email}`;
      }
    });
  }

  /* ---------------- Copy phone ---------------- */
  const copyPhoneBtn = document.getElementById('copy-phone');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', async () => {
      const phoneRaw = (copyPhoneBtn.textContent || '').trim() || '6296106797';
      // normalize to digits for clipboard & tel
      const phoneDigits = phoneRaw.replace(/[^\d+]/g, '');
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(phoneDigits);
          showToast('📱 Phone number copied');
        } else {
          const ta = document.createElement('textarea');
          ta.value = phoneDigits;
          ta.style.position = 'fixed';
          ta.style.opacity = '0';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          showToast('📱 Phone number copied');
        }
      } catch (err) {
        showToast('⚠️ Copy failed — opening dialer');
        window.location.href = `tel:${phoneDigits}`;
      }
    });
  }

  /* ---------------- Contact form (Formspree) handling ---------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const submitBtn = contactForm.querySelector('.form-btn');

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const action = (contactForm.getAttribute('action') || '').trim();

      // loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // If action isn't formspree or is missing, fallback to mailto (shouldn't happen since you provided action)
      if (!action.includes('formspree.io')) {
        const name = formData.get('name') || '';
        const email = formData.get('email') || '';
        const message = formData.get('message') || '';
        const mailto = `mailto:${encodeURIComponent('rockbelt93@gmail.com')}?subject=${encodeURIComponent('Website contact from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
        showToast('Opening email client…');
        window.location.href = mailto;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
        return;
      }

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (res.ok) {
          showToast('✅ Message sent — thank you!');
          contactForm.reset();
        } else {
          let errText = 'Send failed';
          try {
            const data = await res.json();
            if (data && data.error) errText = data.error;
          } catch (_) {}
          showToast('⚠️ ' + errText);
        }
      } catch (err) {
        showToast('⚠️ Network error — please try again');
        console.error('Form submit error:', err);
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });
  }

}); // DOMContentLoaded
