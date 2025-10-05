// Accessible dropdown handler for the top menu.
// Save as /js/dropdowns.js and include with <script src="/js/dropdowns.js" defer></script>
(function () {
  // initialize after DOM is ready (also handles deferred script)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    const nav = document.querySelector('.top-menu');
    if (!nav) return;

    // Utility: close all open menus
    function closeAll() {
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.nav-trigger[aria-expanded="true"]').forEach(b => b.setAttribute('aria-expanded', 'false'));
    }

    // Toggle a given trigger/menu pair
    function toggleTrigger(trigger) {
      const id = trigger.getAttribute('aria-controls');
      const menu = id ? document.getElementById(id) : null;
      if (!menu) return;

      const wasOpen = menu.classList.contains('open');
      closeAll();
      if (!wasOpen) {
        menu.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        // focus first actionable item in menu for keyboard users
        const first = menu.querySelector('[role="menuitem"], a, button');
        if (first) first.focus();
      } else {
        menu.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    }

    // click delegation for nav triggers
    nav.addEventListener('click', (e) => {
      const trigger = e.target.closest('.nav-trigger');
      if (!trigger || !nav.contains(trigger)) return;
      e.stopPropagation();
      // ensure it's a button so it doesn't submit forms
      if (trigger.tagName.toLowerCase() === 'button') trigger.type = 'button';
      toggleTrigger(trigger);
    });

    // keyboard handling within nav
    nav.addEventListener('keydown', (e) => {
      const trigger = e.target.closest('.nav-trigger');
      const inMenu = e.target.closest('.dropdown');

      if (trigger) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTrigger(trigger);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          const id = trigger.getAttribute('aria-controls');
          const menu = id ? document.getElementById(id) : null;
          if (menu) {
            const first = menu.querySelector('[role="menuitem"], a, button');
            if (first) first.focus();
          }
        } else if (e.key === 'Escape') {
          closeAll();
          trigger.focus();
        }
      } else if (inMenu) {
        // Arrow navigation inside open menu
        const items = Array.from(inMenu.querySelectorAll('[role="menuitem"], a, button'));
        const idx = items.indexOf(document.activeElement);
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const next = items[(idx + 1) % items.length] || items[0];
          next && next.focus();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          const prev = items[(idx - 1 + items.length) % items.length] || items[items.length - 1];
          prev && prev.focus();
        } else if (e.key === 'Home') {
          e.preventDefault();
          items[0] && items[0].focus();
        } else if (e.key === 'End') {
          e.preventDefault();
          items[items.length - 1] && items[items.length - 1].focus();
        } else if (e.key === 'Escape') {
          e.preventDefault();
          // close parent menu and focus its trigger
          const parentMenu = inMenu;
          const trigger = Array.from(document.querySelectorAll('.nav-trigger')).find(b => b.getAttribute('aria-controls') === parentMenu.id);
          closeAll();
          if (trigger) trigger.focus();
        }
      }
    });

    // Close when clicking outside the nav; nav click handlers stopPropagation, so outside clicks close reliably
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) closeAll();
    });

    // Close on global Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll();
    });

    // Prevent clicks inside dropdown from bubbling up and closing the menu
    document.querySelectorAll('.dropdown').forEach(menu => {
      menu.addEventListener('click', (e) => e.stopPropagation());
    });
  }
})();
