/* script.js */
(function() {
  'use strict';

  // DOM Elements
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navbar = document.querySelector('.navbar');

  // ---------- Mobile Menu ----------
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.toggle('active');
      menuToggle.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }

  // ---------- Navbar Scroll Effect ----------
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ---------- Hero Slider (Fully Optimized) ----------
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let currentSlide = 0;
  let slideInterval = null;
  const AUTO_INTERVAL = 5000;

  function showSlide(index) {
    if (!slides.length) return;
    const normalizedIndex = (index + slides.length) % slides.length;
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    slides[normalizedIndex].classList.add('active');
    if (dots[normalizedIndex]) dots[normalizedIndex].classList.add('active');
    currentSlide = normalizedIndex;
  }

  function nextSlide() { showSlide(currentSlide + 1); }
  function prevSlide() { showSlide(currentSlide - 1); }

  function startAuto() {
    if (slideInterval) clearInterval(slideInterval);
    if (slides.length > 1) {
      slideInterval = setInterval(nextSlide, AUTO_INTERVAL);
    }
  }

  function stopAuto() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  if (slides.length) {
    showSlide(0);
    startAuto();

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAuto();
        prevSlide();
        startAuto();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAuto();
        nextSlide();
        startAuto();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        stopAuto();
        showSlide(idx);
        startAuto();
      });
    });

    // Pause on hover
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
      heroSlider.addEventListener('mouseenter', stopAuto);
      heroSlider.addEventListener('mouseleave', startAuto);
    }

    // Touch swipe support
    let touchStartX = 0;
    heroSlider?.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    heroSlider?.addEventListener('touchend', (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        stopAuto();
        if (diff > 0) prevSlide();
        else nextSlide();
        startAuto();
      }
    });

    // Visibility API
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopAuto();
      else startAuto();
    });
  }

  // ---------- Stats Counter (Optimized) ----------
  function initCounters() {
    const statsSection = document.querySelector('.stats-section');
    if (!statsSection) return;

    const statNumbers = statsSection.querySelectorAll('.stat-number');
    let counted = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;

          statNumbers.forEach(el => {
            const target = parseInt(el.getAttribute('data-count'), 10);
            if (isNaN(target)) return;

            let current = 0;
            const step = Math.ceil(target / 60);

            const timer = setInterval(() => {
              current += step;

              if (current >= target) {
                el.textContent = target.toLocaleString('bn-BD') + "+";
                clearInterval(timer);
              } else {
                el.textContent = current.toLocaleString('bn-BD') + "+";
              }
            }, 16);
          });

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4, rootMargin: '0px' });

    observer.observe(statsSection);
  }

  initCounters();

  // ---------- Gallery Slider (Infinite Loop & Auto Slide) ----------
  const galleryTrack = document.getElementById('galleryTrack');

  if (galleryTrack) {
    const galleryItemsData = [
      { img: 'p1.jpg', label: 'ছবি ১' },
      { img: 'p2.jpg', label: 'ছবি ২' },
      { img: 'p3.jpg', label: 'ছবি ৩' },
      { img: 'p4.jpg', label: 'ছবি ৪' },
      { img: 'p5.jpg', label: 'ছবি ৫' },
      { img: 'p6.jpg', label: 'ছবি ৬' },
      { img: 'p7.jpg', label: 'ছবি ৭' },
      { img: 'p8.jpg', label: 'ছবি ৮' },
      { img: 'p9.jpg', label: 'ছবি ৯' },
      { img: 'p10.jpg', label: 'ছবি ১০' },
      { img: 'p11.jpg', label: 'ছবি 11' },
      { img: 'p12.jpg', label: 'ছবি 12' },
      { img: 'p13.jpg', label: 'ছবি 13' },
      { img: 'p14.jpg', label: 'ছবি 14' },
      { img: 'p15.jpg', label: 'ছবি 15' },
      { img: 'p16.jpg', label: 'ছবি 16' },
      { img: 'p17.jpg', label: 'ছবি 17' },
    ];

    const galleryPrev = document.querySelector('.gal-prev');
    const galleryNext = document.querySelector('.gal-next');
    const galleryOuter = document.querySelector('.gallery-outer');

    let currentIndex = 0;
    const itemWidth = 320;
    const totalItems = galleryItemsData.length;
    let autoGalleryInterval = null;

    // Build gallery
    function buildGallery() {
      galleryTrack.innerHTML = '';

      galleryItemsData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `
          <img src="${item.img}" loading="lazy" alt="${item.label}">
          <div class="gal-overlay">
            <i class="fas fa-search-plus"></i>
            <span>${item.label}</span>
          </div>
        `;
        galleryTrack.appendChild(div);
      });
    }

    buildGallery();

    // Update position
    function updateGalleryTransform(smooth = true) {
      const translateX = -currentIndex * itemWidth;

      galleryTrack.style.transition = smooth
        ? 'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)'
        : 'none';

      galleryTrack.style.transform = `translateX(${translateX}px)`;
    }

    // NEXT (infinite)
    function nextGallery() {
      currentIndex = (currentIndex + 1) % totalItems;
      updateGalleryTransform(true);
      resetGalleryAuto();
    }

    // PREV (infinite)
    function prevGallery() {
      currentIndex = (currentIndex - 1 + totalItems) % totalItems;
      updateGalleryTransform(true);
      resetGalleryAuto();
    }

    // AUTO
    function startGalleryAuto() {
      if (autoGalleryInterval) clearInterval(autoGalleryInterval);
      autoGalleryInterval = setInterval(() => {
        nextGallery();
      }, 4000);
    }

    function stopGalleryAuto() {
      if (autoGalleryInterval) {
        clearInterval(autoGalleryInterval);
        autoGalleryInterval = null;
      }
    }

    function resetGalleryAuto() {
      stopGalleryAuto();
      startGalleryAuto();
    }

    // Events
    if (galleryPrev && galleryNext) {
      galleryPrev.addEventListener('click', () => {
        prevGallery();
      });

      galleryNext.addEventListener('click', () => {
        nextGallery();
      });

      startGalleryAuto();

      if (galleryOuter) {
        galleryOuter.addEventListener('mouseenter', stopGalleryAuto);
        galleryOuter.addEventListener('mouseleave', startGalleryAuto);
      }
    }
  }

  // ---------- Scroll Reveal (Lightweight) ----------
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.feature-card, .academic-card, .result-card, .stat-card, .notice-item, .contact-card');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
      observer.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = '.reveal-visible { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(style);
  }
  initScrollReveal();

  // ---------- Smooth Scroll & Active Nav ----------
  function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link:not(.contact-nav-btn)');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const hash = link.getAttribute('href');
        if (!hash || !hash.startsWith('#')) return;
        const targetSection = document.querySelector(hash);
        if (!targetSection) return;

        e.preventDefault();
        if (navMenu?.classList.contains('active')) {
          navMenu.classList.remove('active');
          if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }

        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        const offset = navbar?.offsetHeight || 70;
        const targetTop = targetSection.offsetTop - offset - 10;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      });
    });

    function updateActiveNav() {
      const scrollPos = window.scrollY + 120;
      let current = '';
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href')?.substring(1);
        if (href === current) link.classList.add('active');
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }
  initSmoothScroll();

  // ---------- Contact Form (WhatsApp) ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName')?.value.trim() || '';
      const phone = document.getElementById('formPhone')?.value.trim() || '';
      const subject = document.getElementById('formSubject')?.value || '';
      const message = document.getElementById('formMessage')?.value.trim() || '';

      if (!name || !phone || !subject || !message) {
        showToast('দয়া করে সকল তথ্য পূরণ করুন।', 'error');
        return;
      }

      const text = encodeURIComponent(
        `নাম: ${name}\nফোন: ${phone}\nবিষয়: ${subject}\nবার্তা: ${message}`
      );
      window.open(`https://wa.me/8801718995815?text=${text}`, '_blank');
      contactForm.reset();
      showToast('WhatsApp খোলা হচ্ছে...', 'success');
    });
  }

  // ---------- Newsletter ----------
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = newsletterForm.querySelector('input[type="email"]');
      if (emailInput && emailInput.value.trim()) {
        showToast('সাবস্ক্রাইব সম্পন্ন হয়েছে!', 'success');
        emailInput.value = '';
      } else {
        showToast('সঠিক ইমেইল দিন।', 'error');
      }
    });
  }

  // ---------- Toast Notification ----------
  function showToast(msg, type = 'success') {
    const existingToast = document.querySelector('.site-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'site-toast';
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${msg}`;
    toast.style.cssText = `
      position: fixed; top: 90px; right: 20px; background: ${type === 'success' ? '#0e9f6e' : '#ef4444'};
      color: #fff; padding: 12px 20px; border-radius: 8px; font-size: 0.95rem;
      z-index: 9999; box-shadow: 0 4px 14px rgba(0,0,0,0.15);
      display: flex; align-items: center; gap: 10px; animation: slideToast 0.3s ease;
      font-family: 'Hind Siliguri', sans-serif; max-width: 340px;
    `;
    document.body.appendChild(toast);

    if (!document.getElementById('toastStyle')) {
      const style = document.createElement('style');
      style.id = 'toastStyle';
      style.textContent = '@keyframes slideToast { from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
      document.head.appendChild(style);
    }

    setTimeout(() => toast.remove(), 4000);
  }

  // ---------- Resize & Escape Key ----------
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 991 && navMenu?.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }, 200);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
      navMenu.classList.remove('active');
      if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
})();