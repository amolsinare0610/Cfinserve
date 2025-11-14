import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { name, email, phone, loan_type, amount, tenure, message } = req.body;

    const html = `
      <h2>New Loan Enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Loan Type:</strong> ${loan_type}</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Tenure:</strong> ${tenure}</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    const response = await resend.emails.send({
      from: process.env.FROM_EMAIL, // MUST be @cfinserve.com
      to: process.env.RECEIVE_EMAIL,
      subject: "New Loan Enquiry",
      html,
    });

    console.log("RESEND_RESPONSE:", response);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("EMAIL ERROR:", error);
    return res.status(
