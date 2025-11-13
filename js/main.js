// navigation + form submit to Netlify function
document.addEventListener('DOMContentLoaded', () => {
  // year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // tabs
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.tab-section');
  function activate(tabId) {
    links.forEach(a => a.classList.toggle('active', a.dataset.tab === tabId));
    sections.forEach(s => s.id === tabId ? s.classList.add('active') : s.classList.remove('active'));
    history.replaceState(null, '', `#${tabId}`);
  }
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      activate(a.dataset.tab);
      a.blur();
    });
  });
  const initial = location.hash ? location.hash.replace('#', '') : 'home';
  if (document.getElementById(initial)) activate(initial);

  // loan form submit -> Netlify Function
  const loanForm = document.getElementById('loan-form');
  const loanResult = document.getElementById('loan-result');
  if (loanForm) {
    loanForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      loanResult.textContent = '';

      const payload = {
        name: document.getElementById('le-name').value.trim(),
        email: document.getElementById('le-email').value.trim(),
        phone: document.getElementById('le-phone').value.trim(),
        loan_type: document.getElementById('le-type').value,
        amount: document.getElementById('le-amount').value,
        tenure: document.getElementById('le-tenure').value,
        message: document.getElementById('le-message').value.trim()
      };

      if (!payload.name || !payload.email || !payload.phone || !payload.loan_type || !payload.amount || !payload.tenure) {
        loanResult.textContent = 'Please fill all required fields.';
        loanResult.style.color = '#c0392b';
        return;
      }

      loanResult.textContent = 'Submitting...';
      loanResult.style.color = '#6b7280';

      try {
        const res = await fetch('/.netlify/functions/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'send failed');
        }
        loanForm.reset();
        loanResult.textContent = 'Thank you — your enquiry has been sent.';
        loanResult.style.color = '#16a34a';
      } catch (err) {
        console.error(err);
        loanResult.textContent = 'Failed to send enquiry. Try again later.';
        loanResult.style.color = '#c0392b';
      }
    });
  }
});