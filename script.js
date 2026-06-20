/* ==========================================================================
   PIYUSH ARYAN — PORTFOLIO INTERACTIONS
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------------- Theme toggle (in-memory; no storage APIs) ---------- */
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var isDark = root.getAttribute('data-theme') === 'dark';
      root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });
  }

  /* ---------------- Mobile nav ------------------------------------------ */
  var burger = document.getElementById('navBurger');
  var mobileNav = document.getElementById('navMobile');
  if (burger && mobileNav) {
    burger.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.classList.toggle('is-open', open);
    });
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileNav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Sticky nav shadow + scroll progress ----------------- */
  var navBar = document.getElementById('navBar');
  var progressBar = document.getElementById('scrollProgress');

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';
    if (navBar) navBar.classList.toggle('is-scrolled', scrollTop > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------- Role switcher ---------------------------------------- */
  var roles = ['Web Developer', 'Freelancer', 'Problem Solver', 'Open Source Enthusiast'];
  var roleEl = document.getElementById('roleSwitcher');
  var roleIndex = 0;

  function cycleRole() {
    if (!roleEl) return;
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(6px)';
    setTimeout(function () {
      roleIndex = (roleIndex + 1) % roles.length;
      roleEl.textContent = roles[roleIndex];
      roleEl.style.transition = 'opacity .4s ease, transform .4s ease';
      roleEl.style.opacity = '1';
      roleEl.style.transform = 'translateY(0)';
    }, 260);
  }
  if (roleEl) {
    roleEl.style.display = 'inline-block';
    setInterval(cycleRole, 2400);
  }

  /* ---------------- Reveal on scroll -------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------------- Skill bar fill on view -------------------------------- */
  var skillBars = document.querySelectorAll('.skill-bar');
  if ('IntersectionObserver' in window) {
    var skillObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var level = entry.target.getAttribute('data-level') || '0';
            var fill = entry.target.querySelector('.skill-bar__fill');
            if (fill) fill.style.width = level + '%';
            skillObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillBars.forEach(function (el) { skillObserver.observe(el); });
  }

  /* ---------------- Animated counters ------------------------------------- */
  var counters = document.querySelectorAll('.achv-card__num');
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 900;
    var start = null;

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var value = Math.floor(progress * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* ---------------- Custom cursor ----------------------------------------- */
  var cursorDot = document.getElementById('cursorDot');
  if (cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('mousemove', function (e) {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
    });
    var interactive = document.querySelectorAll('a, button, input, textarea, .skill-group, .exp-item__card, .achv-card');
    interactive.forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursorDot.classList.add('is-active'); });
      el.addEventListener('mouseleave', function () { cursorDot.classList.remove('is-active'); });
    });
  }

  /* ---------------- Hero converter swap ----------------------------------- */
  var swapBtn = document.getElementById('converterSwap');
  var fromInput = document.getElementById('converterFrom');
  var toInput = document.getElementById('converterTo');
  if (swapBtn && fromInput && toInput) {
    swapBtn.addEventListener('click', function () {
      var tmp = fromInput.value;
      fromInput.value = toInput.value;
      toInput.value = tmp;
    });
  }

  /* ---------------- Command palette --------------------------------------- */
  var palette = document.getElementById('palette');
  var paletteBtn = document.getElementById('paletteBtn');
  var paletteBackdrop = document.getElementById('paletteBackdrop');
  var paletteInput = document.getElementById('paletteInput');
  var paletteList = document.getElementById('paletteList');
  var paletteItems = paletteList ? Array.prototype.slice.call(paletteList.querySelectorAll('li')) : [];

  function openPalette() {
    if (!palette) return;
    palette.classList.add('is-open');
    palette.setAttribute('aria-hidden', 'false');
    if (paletteInput) {
      paletteInput.value = '';
      paletteItems.forEach(function (li) { li.hidden = false; });
      setTimeout(function () { paletteInput.focus(); }, 30);
    }
  }
  function closePalette() {
    if (!palette) return;
    palette.classList.remove('is-open');
    palette.setAttribute('aria-hidden', 'true');
  }

  if (paletteBtn) paletteBtn.addEventListener('click', openPalette);
  if (paletteBackdrop) paletteBackdrop.addEventListener('click', closePalette);

  document.addEventListener('keydown', function (e) {
    var isK = e.key === 'k' || e.key === 'K';
    if ((e.metaKey || e.ctrlKey) && isK) {
      e.preventDefault();
      if (palette && palette.classList.contains('is-open')) {
        closePalette();
      } else {
        openPalette();
      }
    }
    if (e.key === 'Escape' && palette && palette.classList.contains('is-open')) {
      closePalette();
    }
  });

  if (paletteInput) {
    paletteInput.addEventListener('input', function () {
      var q = paletteInput.value.trim().toLowerCase();
      paletteItems.forEach(function (li) {
        var match = li.textContent.toLowerCase().indexOf(q) !== -1;
        li.hidden = !match;
      });
    });
  }

  paletteItems.forEach(function (li) {
    li.addEventListener('click', function () {
      var target = li.getAttribute('data-target');
      closePalette();
      if (target) {
        var el = document.querySelector(target);
        if (el) {
          setTimeout(function () {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 60);
        }
      }
    });
  });

  /* ---------------- Contact form (mailto, no backend) ---------------------- */
  var contactForm = document.getElementById('contactForm');
  var formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('cfName').value.trim();
      var email = document.getElementById('cfEmail').value.trim();
      var message = document.getElementById('cfMessage').value.trim();

      var subject = encodeURIComponent('Project inquiry from ' + name);
      var body = encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')');
      var mailLink = 'mailto:piyusharyangecp@gmail.com?subject=' + subject + '&body=' + body;

      window.location.href = mailLink;
      if (formStatus) {
        formStatus.textContent = 'Opening your email client…';
      }
    });
  }
})();