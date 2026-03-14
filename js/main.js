// ===== PaieNeo — Scripts =====

document.addEventListener('DOMContentLoaded', () => {

  // --- Header scroll effect ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  });

  // --- Mobile menu toggle ---
  const toggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelector('.nav__links');

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    toggle.classList.toggle('open');
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      toggle.classList.remove('open');
    });
  });

  // --- Carousel ---
  const track = document.querySelector('.carousel__track');
  const slides = document.querySelectorAll('.carousel__slide');
  const prevBtn = document.querySelector('.carousel__btn--prev');
  const nextBtn = document.querySelector('.carousel__btn--next');
  const dotsContainer = document.querySelector('.carousel__dots');
  let currentSlide = 0;
  let autoplayTimer;

  if (track && slides.length > 0) {
    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel__dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
      currentSlide = index;
      track.style.transform = `translateX(-${index * 100}%)`;
      document.querySelectorAll('.carousel__dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }

    prevBtn.addEventListener('click', () => {
      goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
      resetAutoplay();
    });

    nextBtn.addEventListener('click', () => {
      goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
      resetAutoplay();
    });

    // Autoplay
    function startAutoplay() {
      autoplayTimer = setInterval(() => {
        goToSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
      }, 5000);
    }

    function resetAutoplay() {
      clearInterval(autoplayTimer);
      startAutoplay();
    }

    startAutoplay();

    // Swipe support (mobile)
    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) nextBtn.click();
        else prevBtn.click();
      }
    }, { passive: true });
  }

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav__link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);

  // --- Scroll animations ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // --- Contact form ---
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const data = new FormData(form);
      const name = data.get('name');

      // Build mailto link as fallback (can be replaced with a real backend later)
      const subject = encodeURIComponent(`Demande de contact — ${data.get('service')}`);
      const body = encodeURIComponent(
        `Nom : ${data.get('name')}\n` +
        `Email : ${data.get('email')}\n` +
        `Entreprise : ${data.get('company')}\n` +
        `Service : ${data.get('service')}\n\n` +
        `Message :\n${data.get('message')}`
      );

      window.location.href = `mailto:contact@paieneo.com?subject=${subject}&body=${body}`;

      // Show confirmation
      const btn = form.querySelector('.form__submit');
      const originalText = btn.textContent;
      btn.textContent = 'Message envoy\u00e9 !';
      btn.style.background = '#22c55e';

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  // --- Transition contact form ---
  const transitionForm = document.getElementById('transitionForm');
  if (transitionForm) {
    transitionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(transitionForm);
      const subject = encodeURIComponent(`Renfort imm\u00e9diat — ${data.get('context')}`);
      const body = encodeURIComponent(
        `Nom : ${data.get('name')}\n` +
        `Email : ${data.get('email')}\n` +
        `Entreprise : ${data.get('company')}\n` +
        `Effectif : ${data.get('effectif')}\n` +
        `Contexte : ${data.get('context')}\n\n` +
        `Situation :\n${data.get('message')}`
      );
      window.location.href = `mailto:contact@paieneo.com?subject=${subject}&body=${body}`;

      const btn = transitionForm.querySelector('.form__submit--urgent');
      const originalText = btn.textContent;
      btn.textContent = 'Demande envoy\u00e9e !';
      btn.style.background = '#22c55e';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
        transitionForm.reset();
      }, 3000);
    });
  }

  // --- Animated counters ---
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
});
