const { Resend } = require("resend");

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const payload = req.body || {};

    const resend = new Resend(process.env.RESEND_API_KEY);
    try {
        const receiver = process.env.RECEIVER_EMAIL; // ← From Vercel env variable

        if (!receiver) {
            return res.status(500).json({ error: "RECEIVER_EMAIL not set" });
        }

        let data;

        // Insurance enquiry
        if (payload.type === 'insurance') {
            const name = payload.name || '';
            const email = payload.email || '';
            const phone = payload.phone || payload.mobile || '';
            const insurance_type = payload.insurance_type || '';
            const age = payload.age || '';
            const city = payload.city || '';
            const pincode = payload.pincode || '';
            const message = payload.message || '';

            data = await resend.emails.send({
                from: "Cfinserve <noreply@cfinserve.com>",
                to: receiver,
                subject: "New Insurance Consultation Request",
                html: `
          <h2>Insurance Consultation Request</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Insurance Type:</b> ${insurance_type}</p>
          <p><b>Age:</b> ${age}</p>
          <p><b>City:</b> ${city}</p>
          <p><b>Pincode:</b> ${pincode}</p>
          <p><b>Message:</b> ${message}</p>
        `
            });

        } else {
            // Default: loan enquiry (keep backward compatibility)
            const name = payload.name || '';
            const email = payload.email || '';
            const phone = payload.phone || payload.mobile || '';
            const loan_type = payload.loan_type || '';
            const amount = payload.amount || '';
            const salriesorselfemployed = payload.salriesorselfemployed || payload.salariedOrSelfEmployed || '';
            const takehome = payload.takehome || payload.take_home || '';

            data = await resend.emails.send({
                from: "Cfinserve <noreply@cfinserve.com>",
                to: receiver,
                subject: "New Loan Enquiry",
                html: `
          <h2>Loan Enquiry</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Phone:</b> ${phone}</p>
          <p><b>Loan Type:</b> ${loan_type}</p>
          <p><b>Amount:</b> ${amount}</p>
          <p><b>Salaried or Self Employed:</b> ${salriesorselfemployed}</p>
          <p><b>Take Home Income:</b> ${takehome}</p>
        `
            });
        }

        return res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("EMAIL ERROR:", error);
        return res.status(500).json({ error: error.message });
    }
};