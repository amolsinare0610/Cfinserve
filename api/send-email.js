import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    name,
    email,
    phone,
    loan_type,
    amount,
    tenure,
    message
  } = req.body;

  try {
    // Transporter (SMTP)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"CFInserve Website" <${process.env.SMTP_USER}>`,
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

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({ error: "Email sending failed" });
  }
}
