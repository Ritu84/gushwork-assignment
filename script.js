document.addEventListener('DOMContentLoaded', () => {
  const stickyHeader      = document.getElementById('stickyHeader');
  const heroSection       = document.getElementById('heroSection');
  const hamburgerBtn      = document.getElementById('hamburgerBtn');
  const mobileNavOverlay  = document.getElementById('mobileNavOverlay');
  const carouselMainImg   = document.getElementById('carouselMainImg');
  const carouselMain      = document.getElementById('carouselMain');
  const carouselThumbs    = document.getElementById('carouselThumbs');
  const carouselPrev      = document.getElementById('carouselPrev');
  const carouselNext      = document.getElementById('carouselNext');
  const zoomLens          = document.getElementById('zoomLens');
  const zoomPreview       = document.getElementById('zoomPreview');
  const faqList           = document.getElementById('faqList');
  const ctaForm           = document.getElementById('ctaForm');
  let lastScrollY = window.scrollY;
  let isHeroPast  = false;
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        isHeroPast = !entry.isIntersecting;
        if (!isHeroPast) {
          stickyHeader.classList.remove('visible');
          stickyHeader.setAttribute('aria-hidden', 'true');
        }
      });
    },
    { threshold: 0, rootMargin: '-72px 0px 0px 0px' }
  );
  if (heroSection) heroObserver.observe(heroSection);
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (isHeroPast) {
      if (currentScrollY > lastScrollY && currentScrollY > 200) {
        stickyHeader.classList.add('visible');
        stickyHeader.setAttribute('aria-hidden', 'false');
      }
      if (currentScrollY < lastScrollY) {
        stickyHeader.classList.remove('visible');
        stickyHeader.setAttribute('aria-hidden', 'true');
      }
    }
    lastScrollY = currentScrollY;
  }, { passive: true });
  const CAROUSEL_IMAGES = [
    { src: 'images/hdpe_pipe_main.png',         alt: 'HDPE pipes on construction site' },
    { src: 'images/hdpe_pipe_coils.png',        alt: 'HDPE pipe coils in warehouse' },
    { src: 'images/hdpe_pipe_joint.png',        alt: 'HDPE pipe fusion welding joint' },
    { src: 'images/hdpe_pipe_installation.png', alt: 'HDPE pipe trench installation' },
    { src: 'images/hdpe_pipe_sizes.png',        alt: 'Various HDPE pipe sizes' },
  ];
  let currentSlide = 0;
  function updateCarousel(index) {
    if (index < 0) index = CAROUSEL_IMAGES.length - 1;
    if (index >= CAROUSEL_IMAGES.length) index = 0;
    currentSlide = index;
    carouselMainImg.style.opacity = '0';
    setTimeout(() => {
      carouselMainImg.src = CAROUSEL_IMAGES[currentSlide].src;
      carouselMainImg.alt = CAROUSEL_IMAGES[currentSlide].alt;
      carouselMainImg.style.opacity = '1';
    }, 150);
    carouselThumbs.querySelectorAll('.carousel-thumb').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentSlide);
    });
  }
  if (carouselPrev) carouselPrev.addEventListener('click', () => updateCarousel(currentSlide - 1));
  if (carouselNext) carouselNext.addEventListener('click', () => updateCarousel(currentSlide + 1));
  if (carouselThumbs) {
    carouselThumbs.addEventListener('click', (e) => {
      const thumb = e.target.closest('.carousel-thumb');
      if (thumb) updateCarousel(parseInt(thumb.dataset.index, 10));
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  updateCarousel(currentSlide - 1);
    if (e.key === 'ArrowRight') updateCarousel(currentSlide + 1);
  });
  const ZOOM_FACTOR = 2.5;
  if (carouselMain && zoomLens && zoomPreview) {
    carouselMain.addEventListener('mouseenter', () => {
      zoomPreview.classList.add('active');
      zoomPreview.style.backgroundImage = `url(${CAROUSEL_IMAGES[currentSlide].src})`;
    });
    carouselMain.addEventListener('mouseleave', () => {
      zoomPreview.classList.remove('active');
      zoomLens.style.opacity = '0';
    });
    carouselMain.addEventListener('mousemove', (e) => {
      const rect = carouselMain.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const lensW = zoomLens.offsetWidth;
      const lensH = zoomLens.offsetHeight;
      const lensX = Math.max(0, Math.min(x - lensW / 2, rect.width  - lensW));
      const lensY = Math.max(0, Math.min(y - lensH / 2, rect.height - lensH));
      zoomLens.style.left    = `${lensX}px`;
      zoomLens.style.top     = `${lensY}px`;
      zoomLens.style.opacity = '1';
      const bgWidth  = rect.width  * ZOOM_FACTOR;
      const bgHeight = rect.height * ZOOM_FACTOR;
      zoomPreview.style.backgroundSize     = `${bgWidth}px ${bgHeight}px`;
      zoomPreview.style.backgroundPosition = `${-(lensX * ZOOM_FACTOR)}px ${-(lensY * ZOOM_FACTOR)}px`;
    });
  }
  if (faqList) {
    faqList.addEventListener('click', (e) => {
      const questionBtn = e.target.closest('.faq-question');
      if (!questionBtn) return;
      const faqItem  = questionBtn.closest('.faq-item');
      const isActive = faqItem.classList.contains('active');
      faqList.querySelectorAll('.faq-item').forEach((item) => {
        item.classList.remove('active');
        item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      if (!isActive) {
        faqItem.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  }
  function closeMobileNav() {
    if (!hamburgerBtn || !mobileNavOverlay) return;
    hamburgerBtn.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (hamburgerBtn && mobileNavOverlay) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = hamburgerBtn.classList.contains('active');
      hamburgerBtn.classList.toggle('active');
      mobileNavOverlay.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    mobileNavOverlay.addEventListener('click', (e) => {
      if (e.target === mobileNavOverlay) closeMobileNav();
    });
    mobileNavOverlay.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileNav);
    });
  }
  const productsDropdown = document.getElementById('productsDropdown');
  if (productsDropdown) {
    const trigger = productsDropdown.querySelector('.nav-dropdown-trigger');
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      productsDropdown.classList.toggle('active');
      trigger.setAttribute('aria-expanded', String(productsDropdown.classList.contains('active')));
    });
    document.addEventListener('click', (e) => {
      if (!productsDropdown.contains(e.target)) {
        productsDropdown.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }
  const appTrack = document.getElementById('applicationsTrack');
  const appPrev  = document.getElementById('appPrev');
  const appNext  = document.getElementById('appNext');
  let appOffset  = 0;
  function updateAppCarousel(direction) {
    if (!appTrack) return;
    const cards        = appTrack.querySelectorAll('.app-card');
    const gap          = 4;
    const cardWidth    = cards[0].offsetWidth + gap;
    const carouselW    = appTrack.parentElement.offsetWidth;
    const visibleCount = Math.round(carouselW / cardWidth);
    const maxOffset    = Math.max((cards.length - visibleCount) * cardWidth, 0);
    appOffset = direction === 'next'
      ? Math.min(appOffset + cardWidth, maxOffset)
      : Math.max(appOffset - cardWidth, 0);
    appTrack.style.transform = `translateX(-${appOffset}px)`;
  }
  if (appPrev) appPrev.addEventListener('click', () => updateAppCarousel('prev'));
  if (appNext) appNext.addEventListener('click', () => updateAppCarousel('next'));
  const processTabs    = document.getElementById('processTabs');
  const processContent = document.getElementById('processContent');
  const processPrevBtn  = document.getElementById('processPrevBtn');
  const processNextArrow = document.getElementById('processNextArrow');
  if (processTabs && processContent) {
    const tabs   = processTabs.querySelectorAll('.process-tab');
    const panels = processContent.querySelectorAll('.process-panel');
    function activateTab(tabId) {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));
      const activeTab   = processTabs.querySelector(`[data-tab="${tabId}"]`);
      const activePanel = document.getElementById(`panel-${tabId}`);
      if (activeTab)   activeTab.classList.add('active');
      if (activePanel) activePanel.classList.add('active');
      if (activeTab)   activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    processTabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.process-tab');
      if (tab) activateTab(tab.dataset.tab);
    });
    function navigateStep(dir) {
      const tabsArr    = Array.from(tabs);
      const currentIdx = tabsArr.indexOf(processTabs.querySelector('.process-tab.active'));
      const nextIdx    = (currentIdx + dir + tabsArr.length) % tabsArr.length;
      activateTab(tabsArr[nextIdx].dataset.tab);
    }
    if (processPrevBtn)   processPrevBtn.addEventListener('click',   () => navigateStep(-1));
    if (processNextArrow) processNextArrow.addEventListener('click', () => navigateStep(1));
  }
  const catalogueModal      = document.getElementById('catalogueModal');
  const callbackModal       = document.getElementById('callbackModal');
  const catalogueModalClose = document.getElementById('catalogueModalClose');
  const callbackModalClose  = document.getElementById('callbackModalClose');
  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (catalogueModalClose) catalogueModalClose.addEventListener('click', () => closeModal(catalogueModal));
  if (callbackModalClose)  callbackModalClose.addEventListener('click', () => closeModal(callbackModal));
  [catalogueModal, callbackModal].forEach((modal) => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(catalogueModal);
      closeModal(callbackModal);
    }
  });
  const datasheetBtn    = document.querySelector('.specs-cta .btn');
  const getQuoteBtn     = document.querySelector('.hero-cta-group .btn-primary');
  const contactBtns     = document.querySelectorAll('.nav-cta');
  const talkToExpertBtn = document.getElementById('talkToExpertBtn');
  if (datasheetBtn) datasheetBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(catalogueModal); });
  if (getQuoteBtn)  getQuoteBtn.addEventListener('click',  (e) => { e.preventDefault(); openModal(callbackModal); });
  contactBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openModal(callbackModal); });
  });
  if (talkToExpertBtn) {
    talkToExpertBtn.addEventListener('click', (e) => { e.preventDefault(); openModal(callbackModal); });
  }
  const featuresQuoteBtn = document.getElementById('featuresQuoteBtn');
  if (featuresQuoteBtn) {
    featuresQuoteBtn.addEventListener('click', () => openModal(callbackModal));
  }
  const catalogueEmail      = document.getElementById('catalogueEmail');
  const catalogueRequestBtn = document.getElementById('catalogueRequestBtn');
  const catalogueSuccess    = document.getElementById('catalogueSuccess');
  if (catalogueRequestBtn && catalogueEmail && catalogueSuccess) {
    catalogueRequestBtn.addEventListener('click', () => {
      const email = catalogueEmail.value.trim();
      if (!email) {
        catalogueEmail.focus();
        return;
      }
      catalogueRequestBtn.disabled = true;
      catalogueRequestBtn.textContent = 'Sending...';
      setTimeout(() => {
        catalogueSuccess.textContent = `Catalogue sent successfully to ${email}`;
        catalogueEmail.value = '';
        catalogueRequestBtn.textContent = 'Request Catalogue';
        catalogueRequestBtn.disabled = false;
        setTimeout(() => { catalogueSuccess.textContent = ''; }, 4000);
      }, 1000);
    });
  }
  function flashSuccess(btn, successText, resetText, delay, callback) {
    btn.textContent = successText;
    btn.style.backgroundColor = '#059669';
    btn.style.borderColor     = '#059669';
    setTimeout(() => {
      btn.textContent = resetText;
      btn.style.backgroundColor = '';
      btn.style.borderColor     = '';
      if (callback) callback();
    }, delay);
  }
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('ctaEmail').value;
      if (email) {
        flashSuccess(ctaForm.querySelector('.btn'), '✓ Request Sent!', 'Request Catalogue', 2000, () => ctaForm.reset());
      }
    });
  }
  const catalogueForm = document.getElementById('catalogueForm');
  const callbackForm  = document.getElementById('callbackForm');
  if (catalogueForm) {
    catalogueForm.addEventListener('submit', (e) => {
      e.preventDefault();
      flashSuccess(
        catalogueForm.querySelector('.modal-submit'),
        '✓ Sent!', 'Download Brochure', 1500,
        () => { closeModal(catalogueModal); catalogueForm.reset(); }
      );
    });
  }
  if (callbackForm) {
    callbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      flashSuccess(
        callbackForm.querySelector('.modal-submit'),
        '✓ Request Sent!', 'Submit Form', 1500,
        () => { closeModal(callbackModal); callbackForm.reset(); }
      );
    });
  }
});
