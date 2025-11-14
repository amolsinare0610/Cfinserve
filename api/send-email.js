const { Resend } = require("resend");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { name, email, phone, loan_type, amount, tenure, message } = req.body;

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const receiver = process.env.RECEIVER_EMAIL; // ← From Vercel env variable

    if (!receiver) {
      return res.status(500).json({ error: "RECEIVER_EMAIL not set" });
    }

    const data = await resend.emails.send({
      from: "Cfinserve <noreply@cfinserve.com>",
      to: receiver, // ← dynamic
      subject: "New Loan Enquiry",
      html: `
        <h2>Loan Enquiry</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Loan Type:</b> ${loan_type}</p>
        <p><b>Amount:</b> ${amount}</p>
        <p><b>Tenure:</b> ${tenure}</p>
        <p><b>Message:</b> ${message}</p>
      `
    });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return res.status(500).json({ error: error.message });
  }
};
