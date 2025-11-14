const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    // Build the email body
    const text = `
Loan Enquiry Received:

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Loan Type: ${data.loan_type}
Amount: ${data.amount}
Tenure: ${data.tenure}

Message:
${data.message || "(no message)"}
`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO, // set this in Netlify env vars
      subject: "New Loan Enquiry",
      text,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent!" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
