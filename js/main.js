// TAB SWITCHING & NAV HIGHLIGHT
const navLinks = document.querySelectorAll("[data-tab]");
const sections = document.querySelectorAll(".tab-section");

function setActiveSection(targetId) {
    // hide all
    sections.forEach(sec => sec.classList.remove('active'));
    // deactivate nav links
    navLinks.forEach(n => n.classList.remove('active'));

    const target = document.getElementById(targetId);
    if (target) target.classList.add('active');

    const link = document.querySelector(`[data-tab="${targetId}"]`);
    if (link) link.classList.add('active');

    // update URL hash without scrolling jump
    history.replaceState(null, '', `#${targetId}`);
    // ensure the activated section is scrolled into view below the sticky navbar
    if (target) {
        const header = document.querySelector('.navbar');
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8; // small offset
        window.scrollTo({ top, behavior: 'smooth' });
    }
}

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('data-tab');
        setActiveSection(target);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// activate section from URL hash on load
document.addEventListener('DOMContentLoaded', () => {
    const hash = location.hash ? location.hash.replace('#', '') : null;
    if (hash && document.getElementById(hash)) {
        setActiveSection(hash);
    } else {
        // ensure default home active
        setActiveSection('home');
    }
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
document.getElementById("loan-form").addEventListener("submit", async function(event) {
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
        showToast(`Enquiry submitted — we'll contact you shortly.`, 'success');
        document.getElementById("loan-form").reset();

    } catch (err) {
        console.error("EMAIL ERROR:", err);
        result.innerHTML = "❌ Failed to send your enquiry. Please try again later.";
        result.style.color = "#c0392b";
        showToast('Failed to submit enquiry. Try again later.', 'error');
    }
});


// INSURANCE FORM
const insuranceForm = document.getElementById('insurance-form');
if (insuranceForm) {
    insuranceForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const name = document.getElementById('ins-name').value.trim();
        const email = (document.getElementById('ins-email') ? document.getElementById('ins-email').value.trim() : '');
        const mobile = document.getElementById('ins-mobile').value.trim();
        const age = document.getElementById('ins-age').value.trim();
        const cityEl = document.getElementById('ins-city');
        const pincodeEl = document.getElementById('ins-pincode');
        const city = cityEl ? cityEl.value.trim() : '';
        const pincode = pincodeEl ? pincodeEl.value.trim() : '';
        const insurance_type = document.getElementById('ins-type').value;
        const message = document.getElementById('ins-message').value.trim();
        const result = document.getElementById('ins-result');

        // Basic validation
        // Honeypot check
        const websiteField = document.getElementById('website');
        if (websiteField && websiteField.value) {
            // likely bot; silently abort
            return;
        }

        // require mobile and insurance type
        const mobileOk = /^[0-9]{10}$/.test(mobile);
        if (!mobile || !mobileOk) {
            result.innerHTML = '⚠️ Please provide a valid 10-digit mobile number.';
            result.style.color = '#c0392b';
            return;
        }

        if (!insurance_type) {
            result.innerHTML = '⚠️ Please select an insurance type.';
            result.style.color = '#c0392b';
            return;
        }

        // consent removed from form — no checkbox enforcement

        result.innerHTML = 'Submitting...';
        result.style.color = '#6b7280';

        // Prepare payload similar to loan enquiry (include email and phone keys)
        const payload = { type: 'insurance', name, email, phone: mobile, mobile, age, city, pincode, insurance_type, message };

        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Send failed');

            result.innerHTML = `Thank you${name ? (', <b>'+name+'</b>') : ''}! We will contact you shortly.`;
            result.style.color = '#16a34a';
            showToast('Consultation request received — our team will reach out.', 'success');
            insuranceForm.reset();
        } catch (err) {
            console.error('INSURANCE FORM ERROR:', err);
            result.innerHTML = '❌ Failed to submit. Please try again later.';
            result.style.color = '#c0392b';
            showToast('Failed to submit consultation request.', 'error');
        }
    });
}

// Focus handler for CTA buttons (data-focus)
document.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-focus]');
    if (!btn) return;
    const fieldId = btn.getAttribute('data-focus');
    // activate insurance section and set focus
    setActiveSection('insurance');
    setTimeout(() => {
        const field = document.getElementById(fieldId);
        if (field) field.focus();
    }, 300);
});

// BUY NOW buttons: set insurance type and scroll to form
document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const type = btn.getAttribute('data-buy');
        // open insurance tab (if not active) and set type
        setActiveSection('insurance');
        const insType = document.getElementById('ins-type');
        if (insType) {
            insType.value = type;
        }
        // scroll to form section (third stacked view)
        const formSection = document.querySelector('.insurance-form-section');
        if (formSection) {
            const header = document.querySelector('.navbar');
            const headerHeight = header ? header.offsetHeight : 0;
            const top = formSection.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;
            window.scrollTo({ top, behavior: 'smooth' });
            setTimeout(() => {
                const mobile = document.getElementById('ins-mobile');
                if (mobile) mobile.focus();
            }, 700);
        }
    });
});

// IntersectionObserver to reveal insurance cards on scroll
const insCards = document.querySelectorAll('.insurance-card');
if ('IntersectionObserver' in window && insCards.length) {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.18 });
    insCards.forEach(c => obs.observe(c));
} else {
    // fallback: mark visible
    insCards.forEach(c => c.classList.add('in-view'));
}

// Toast helper
function showToast(message, type = 'info', timeout = 4500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div class="toast-body">${message}</div>`;
    container.appendChild(toast);

    // force reflow to enable animation
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => container.removeChild(toast), 300);
    }, timeout);
}


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