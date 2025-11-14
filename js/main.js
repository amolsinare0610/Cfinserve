// -------------------------------
// Navigation & Year Footer
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".tab-section");

  function activateTab(tabId) {
    // Highlight active nav
    navLinks.forEach(link => 
      link.classList.toggle("active", link.dataset.tab === tabId)
    );

    // Show active section
    sections.forEach(section => 
      section.classList.toggle("active", section.id === tabId)
    );

    // Update URL hash without jump
    history.replaceState(null, "", `#${tabId}`);
  }

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.dataset.tab;
      activateTab(target);
      link.blur();
    });
  });

  // Initial tab
  const initialTab = location.hash ? location.hash.substring(1) : "home";
  activateTab(initialTab);

  // Back/forward
  window.addEventListener("hashchange", () => {
    const tab = location.hash.substring(1) || "home";
    activateTab(tab);
  });
});

// -------------------------------
// Loan Enquiry Email Submit (Vercel)
// -------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const loanForm = document.getElementById('loan-form');
  const loanResult = document.getElementById('loan-result');

  if (!loanForm) return;

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
      message: document.getElementById('le-message').value.trim(),
    };

    // Basic validation
    if (!payload.name || !payload.email || !payload.phone || !payload.loan_type || !payload.amount || !payload.tenure) {
      loanResult.textContent = 'Please fill all required fields.';
      loanResult.style.color = '#c0392b';
      return;
    }

    loanResult.textContent = 'Submitting...';
    loanResult.style.color = '#6b7280';

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Send failed');

      loanForm.reset();
      loanResult.textContent = 'Thank you — your enquiry has been sent.';
      loanResult.style.color = '#16a34a';

    } catch (err) {
      console.error("Email error:", err);
      loanResult.textContent = 'Failed to send enquiry. Try again later.';
      loanResult.style.color = '#c0392b';
    }
  });
});
