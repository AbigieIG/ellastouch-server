import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  port: 462,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to: string | undefined, subject: string, html: string) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER!,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };


