const nodemailer = require("nodemailer");

exports.handler = async (event) => {
  try {
    // Debug: log which environment variables exist (not actual values)
    const envStatus = {
      HOST: !!process.env.SMTP_HOST,
      PORT: !!process.env.SMTP_PORT,
      USER: !!process.env.SMTP_USER,
      PASS: !!process.env.SMTP_PASS,
      FROM: !!process.env.SMTP_FROM,
      TO: !!process.env.SMTP_TO
    };

    console.log("SMTP ENV STATUS:", envStatus);

    const data = JSON.parse(event.body || '{}');

    console.log("Received Payload:", data); // Debug incoming data

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

    console.log("Email text generated");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log("Transporter created");

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      subject: "New Loan Enquiry",
      text,
    });

    console.log("Email successfully sent");

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent!" })
    };

  } catch (error) {
    console.error("ERROR in send-email function:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
