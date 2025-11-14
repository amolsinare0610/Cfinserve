import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, loan_type, amount, tenure, message } = req.body;

  try {
    const sendResult = await resend.emails.send({
      from: "CFInserve <noreply@yourdomain.com>",
      to: process.env.RECEIVE_EMAIL,
      subject: "New Loan Enquiry",
      html: `
        <h2>New Loan Enquiry</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Loan Type:</strong> ${loan_type}</p>
        <p><strong>Amount:</strong> ${amount}</p>
        <p><strong>Tenure:</strong> ${tenure}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    });

    return res.status(200).json({ success: true, id: sendResult.id });

  } catch (err) {
    console.error("RESEND ERROR:", err);
    return res.status(500).json({ error: "Email sending failed" });
  }
}
