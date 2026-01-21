/**
 * Monarch Mafia - Main JavaScript
 *
 * Minimal vanilla JavaScript for:
 * 1. Mobile navigation toggle
 * 2. Smooth scroll handling for anchor links
 * 3. Active navigation state based on current page
 * 4. Form validation enhancement (progressive enhancement)
 *
 * Design decisions:
 * - No external dependencies
 * - Progressive enhancement - site works without JS
 * - Event delegation where appropriate
 * - Accessible keyboard support
 */

(function () {
  'use strict';

  /**
   * DOM Ready handler
   * @param {Function} fn - Function to execute when DOM is ready
   */
  function domReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  /**
   * Mobile Navigation Module
   * Handles hamburger menu toggle for mobile viewports
   */
  const MobileNav = {
    toggle: null,
    navList: null,
    isOpen: false,

    init: function () {
      this.toggle = document.querySelector('.nav__toggle');
      this.navList = document.querySelector('.nav__list');

      if (!this.toggle || !this.navList) return;

      this.bindEvents();
    },

    bindEvents: function () {
      // Toggle button click
      this.toggle.addEventListener('click', this.handleToggle.bind(this));

      // Close on escape key
      document.addEventListener('keydown', this.handleKeydown.bind(this));

      // Close when clicking outside
      document.addEventListener('click', this.handleOutsideClick.bind(this));

      // Close on nav link click (for mobile)
      this.navList.addEventListener('click', this.handleNavClick.bind(this));
    },

    handleToggle: function (e) {
      e.stopPropagation();
      this.isOpen = !this.isOpen;
      this.updateState();
    },

    handleKeydown: function (e) {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    },

    handleOutsideClick: function (e) {
      if (this.isOpen && !this.navList.contains(e.target) && !this.toggle.contains(e.target)) {
        this.close();
      }
    },

    handleNavClick: function (e) {
      if (e.target.classList.contains('nav__link')) {
        this.close();
      }
    },

    updateState: function () {
      this.toggle.classList.toggle('nav__toggle--active', this.isOpen);
      this.navList.classList.toggle('nav__list--open', this.isOpen);
      this.toggle.setAttribute('aria-expanded', this.isOpen);

      // Prevent body scroll when menu is open
      document.body.style.overflow = this.isOpen ? 'hidden' : '';
    },

    close: function () {
      this.isOpen = false;
      this.updateState();
    }
  };

  /**
   * Active Navigation Module
   * Highlights current page in navigation
   */
  const ActiveNav = {
    init: function () {
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.nav__link');

      navLinks.forEach(function (link) {
        const href = link.getAttribute('href');

        // Handle both relative and absolute paths
        const linkPath = href.startsWith('/') ? href : '/' + href;
        const normalizedCurrent = currentPath.endsWith('/') ? currentPath + 'index.html' : currentPath;

        // Check for exact match or index page
        const isActive =
          normalizedCurrent === linkPath ||
          normalizedCurrent.endsWith(linkPath) ||
          (linkPath === '/index.html' && (currentPath === '/' || currentPath.endsWith('/index.html'))) ||
          (currentPath.includes('/goals/') && linkPath.includes('goals.html'));

        if (isActive) {
          link.classList.add('nav__link--active');
          link.setAttribute('aria-current', 'page');
        }
      });
    }
  };

  /**
   * Smooth Scroll Module
   * Enhances anchor link behavior
   */
  const SmoothScroll = {
    init: function () {
      document.addEventListener('click', this.handleClick.bind(this));
    },

    handleClick: function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);

      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    }
  };

  /**
   * Form Enhancement Module
   * Adds client-side validation feedback to Netlify forms
   */
  const FormEnhancement = {
    form: null,

    init: function () {
      this.form = document.querySelector('form[data-netlify="true"]');
      if (!this.form) return;

      this.bindEvents();
    },

    bindEvents: function () {
      this.form.addEventListener('submit', this.handleSubmit.bind(this));

      // Real-time validation on blur
      const inputs = this.form.querySelectorAll('input, textarea');
      inputs.forEach(function (input) {
        input.addEventListener('blur', this.validateField.bind(this));
      }, this);
    },

    handleSubmit: function (e) {
      const isValid = this.validateForm();

      if (!isValid) {
        e.preventDefault();
        // Focus first invalid field
        const firstInvalid = this.form.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.focus();
        }
      }
    },

    validateForm: function () {
      let isValid = true;
      const requiredFields = this.form.querySelectorAll('[required]');

      requiredFields.forEach(function (field) {
        if (!this.validateField({ target: field })) {
          isValid = false;
        }
      }, this);

      return isValid;
    },

    validateField: function (e) {
      const field = e.target;
      const isValid = field.checkValidity();

      // Add/remove visual feedback
      field.classList.toggle('form__input--invalid', !isValid);
      field.classList.toggle('form__input--valid', isValid && field.value);

      // Update aria-invalid for accessibility
      field.setAttribute('aria-invalid', !isValid);

      return isValid;
    }
  };

  /**
   * Carousel Module
   * Horizontal auto-scrolling carousel with arrow navigation
   */
  const Carousel = {
    container: null,
    track: null,
    items: null,
    prevBtn: null,
    nextBtn: null,
    indicators: null,
    currentIndex: 0,
    autoScrollInterval: null,
    autoScrollDelay: 4000,
    isPaused: false,

    init: function () {
      this.container = document.getElementById('goals-carousel');
      if (!this.container) return;

      this.track = document.getElementById('carousel-track');
      this.items = this.track.querySelectorAll('.carousel__item');
      this.prevBtn = document.getElementById('carousel-prev');
      this.nextBtn = document.getElementById('carousel-next');
      this.indicators = document.querySelectorAll('.carousel__indicator');

      if (!this.track || this.items.length === 0) return;

      this.bindEvents();
      this.startAutoScroll();
    },

    bindEvents: function () {
      // Arrow buttons
      this.prevBtn.addEventListener('click', this.prev.bind(this));
      this.nextBtn.addEventListener('click', this.next.bind(this));

      // Indicator dots
      this.indicators.forEach(function (indicator) {
        indicator.addEventListener('click', this.handleIndicatorClick.bind(this));
      }, this);

      // Pause on hover
      this.container.addEventListener('mouseenter', this.pause.bind(this));
      this.container.addEventListener('mouseleave', this.resume.bind(this));

      // Pause on focus within
      this.container.addEventListener('focusin', this.pause.bind(this));
      this.container.addEventListener('focusout', this.resume.bind(this));

      // Handle touch/swipe
      this.track.addEventListener('scroll', this.handleScroll.bind(this));

      // Handle keyboard navigation
      this.container.addEventListener('keydown', this.handleKeydown.bind(this));
    },

    handleIndicatorClick: function (e) {
      var index = parseInt(e.target.getAttribute('data-index'), 10);
      this.goTo(index);
    },

    handleScroll: function () {
      // Update indicator based on scroll position
      var scrollLeft = this.track.scrollLeft;
      var itemWidth = this.items[0].offsetWidth + 24; // Including gap
      var newIndex = Math.round(scrollLeft / itemWidth);

      if (newIndex !== this.currentIndex && newIndex >= 0 && newIndex < this.items.length) {
        this.currentIndex = newIndex;
        this.updateIndicators();
      }
    },

    handleKeydown: function (e) {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      }
    },

    prev: function () {
      var newIndex = this.currentIndex - 1;
      if (newIndex < 0) {
        newIndex = this.items.length - 1;
      }
      this.goTo(newIndex);
    },

    next: function () {
      var newIndex = this.currentIndex + 1;
      if (newIndex >= this.items.length) {
        newIndex = 0;
      }
      this.goTo(newIndex);
    },

    goTo: function (index) {
      this.currentIndex = index;
      var itemWidth = this.items[0].offsetWidth + 24; // Including gap
      var scrollPosition = index * itemWidth;

      this.track.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });

      this.updateIndicators();
    },

    updateIndicators: function () {
      this.indicators.forEach(function (indicator, i) {
        indicator.classList.toggle('carousel__indicator--active', i === this.currentIndex);
      }, this);
    },

    startAutoScroll: function () {
      var self = this;
      this.autoScrollInterval = setInterval(function () {
        if (!self.isPaused) {
          self.next();
        }
      }, this.autoScrollDelay);
    },

    stopAutoScroll: function () {
      if (this.autoScrollInterval) {
        clearInterval(this.autoScrollInterval);
        this.autoScrollInterval = null;
      }
    },

    pause: function () {
      this.isPaused = true;
    },

    resume: function () {
      this.isPaused = false;
    }
  };

  /**
   * Initialize all modules on DOM ready
   */
  domReady(function () {
    MobileNav.init();
    ActiveNav.init();
    SmoothScroll.init();
    FormEnhancement.init();
    Carousel.init();
  });
})();
