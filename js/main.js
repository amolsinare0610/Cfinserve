document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.tab-section');
  const yearEl = document.getElementById('year');
  yearEl.textContent = new Date().getFullYear();

  function activate(tabId) {
    // highlight nav
    links.forEach(a => a.classList.toggle('active', a.dataset.tab === tabId));
    // show section
    sections.forEach(s => s.id === tabId ? s.classList.add('active') : s.classList.remove('active'));
    // update hash without jumping
    history.replaceState(null, '', `#${tabId}`);
  }

  // click nav
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const target = a.dataset.tab;
      activate(target);
      e.preventDefault();
      // small focus tweak
      a.blur();
    });
  });

  // initialize by hash or default home
  const initial = location.hash ? location.hash.replace('#','') : 'home';
  activate(initial);

  // support back/forward
  window.addEventListener('hashchange', () => {
    const h = location.hash.replace('#','') || 'home';
    activate(h);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Handle tab navigation
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.tab-section');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Remove active class from all sections
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      // Add active class to target section
      const targetId = link.getAttribute('data-tab');
      document.getElementById(targetId).classList.add('active');
      
      // Update active nav link
      navLinks.forEach(navLink => {
        navLink.classList.remove('active');
      });
      link.classList.add('active');
    });
  });
});
