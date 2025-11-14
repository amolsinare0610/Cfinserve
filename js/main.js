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


// LOAN FORM (works as in previous version)
document.getElementById("loan-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("le-name").value;
  const email = document.getElementById("le-email").value;
  const phone = document.getElementById("le-phone").value;
  const type = document.getElementById("le-type").value;
  const amount = document.getElementById("le-amount").value;
  const tenure = document.getElementById("le-tenure").value;
  const msg = document.getElementById("le-message").value;

  const result = document.getElementById("loan-result");
  result.innerHTML = "Submitting your request...";

  setTimeout(() => {
    result.innerHTML = `Thank you, <b>${name}</b>! Your enquiry for a <b>${type}</b> has been submitted.`;
  }, 800);
});
