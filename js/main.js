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
   * Initialize all modules on DOM ready
   */
  domReady(function () {
    MobileNav.init();
    ActiveNav.init();
    SmoothScroll.init();
    FormEnhancement.init();
  });
})();
