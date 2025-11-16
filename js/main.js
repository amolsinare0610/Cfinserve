// TAB SWITCHING
const navLinks = document.querySelectorAll("[data-tab]");
const sections = document.querySelectorAll(".tab-section");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const target = link.getAttribute("data-tab");

    // Remove active class from all sections
    sections.forEach(sec => sec.classList.remove("active"));

    // Add active class to selected section
    document.getElementById(target).classList.add("active");

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

// YEAR in footer
document.getElementById("year").innerText = new Date().getFullYear();

// APPLY NOW BUTTON → OPEN ENQUIRY TAB
const applyBtn = document.querySelector('.primary-btn[href="#enquiry"]');

if (applyBtn) {
  applyBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // hide all sections
    sections.forEach(sec => sec.classList.remove("active"));

    // show ENQUIRY section
    document.getElementById("enquiry").classList.add("active");

    // scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


// LOAN FORM (Updated for Vercel + Resend API)
document.getElementById("loan-form").addEventListener("submit", async function (event) {
  event.preventDefault();

  const name = document.getElementById("le-name").value.trim();
  const email = document.getElementById("le-email").value.trim();
  const phone = document.getElementById("le-phone").value.trim();
  const msg = document.getElementById("le-message").value.trim();

  const result = document.getElementById("loan-result");

  // Validate
  if (!name || !email || !phone || !type || !amount || !tenure) {
    result.innerHTML = "⚠️ Please fill all required fields.";
    result.style.color = "#c0392b";
    return;
  }

  result.innerHTML = "Submitting your request...";
  result.style.color = "#6b7280";

  // Payload for API
  const payload = {
    name,
    email,
    phone,
    message: msg
  };

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Send failed");

    // SUCCESS
    result.innerHTML = `Thank you, <b>${name}</b>! Your enquiry has been submitted.`;
    result.style.color = "#16a34a";

    document.getElementById("loan-form").reset();

  } catch (err) {
    console.error("EMAIL ERROR:", err);
    result.innerHTML = "❌ Failed to send your enquiry. Please try again later.";
    result.style.color = "#c0392b";
  }
});
