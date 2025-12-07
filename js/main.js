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
  const loan_type = document.getElementById("le-loan-type").value;
  const amount = document.getElementById("le-amount").value.trim();
  const salriesorselfemployed = document.getElementById("salaried-or-selfemployed").value.trim();
  const takehome = document.getElementById("le-income").value.trim();
  const result = document.getElementById("loan-result");

  // Validate
  if (!name || !email || !phone || !loan_type || !amount || !salriesorselfemployed || !takehome) {
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
    loan_type,
    amount,
    salriesorselfemployed,
    takehome  
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


document.getElementById('loan-calculator-form').addEventListener('submit', function(e) {
  e.preventDefault();
  calculateLoan();
});

document.getElementById('calc-reset').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('loan-calculator-form').reset();
  document.getElementById('calc-result').classList.remove('show');
  document.getElementById('calc-result').style.display = 'none';
});

function calculateLoan() {
  const amount = parseFloat(document.getElementById('calc-amount').value);
  const rate = parseFloat(document.getElementById('calc-rate').value);
  const tenure = parseFloat(document.getElementById('calc-tenure').value);
  const unit = document.getElementById('calc-tenure-unit').value;

  if (!amount || !rate || !tenure) {
    alert('Please fill all fields');
    return;
  }

  // Convert tenure to months
  const months = unit === 'years' ? tenure * 12 : tenure;

  // Calculate EMI using formula: EMI = P * R * (1+R)^N / ((1+R)^N - 1)
  const monthlyRate = rate / (12 * 100);
  const numerator = amount * monthlyRate * Math.pow(1 + monthlyRate, months);
  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  const emi = numerator / denominator;

  const totalAmount = emi * months;
  const totalInterest = totalAmount - amount;

  // Display results
  document.getElementById('result-emi').textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
  document.getElementById('result-total').textContent = '₹' + Math.round(totalAmount).toLocaleString('en-IN');
  document.getElementById('result-interest').textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');

  document.getElementById('calc-result').classList.add('show');
  document.getElementById('calc-result').style.display = 'block';
}