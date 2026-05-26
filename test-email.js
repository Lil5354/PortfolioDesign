import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "buiduclong.work@gmail.com",
    pass: "fkep epks eizh rfle",
  },
});

async function main() {
  await transporter.sendMail({
    from: "UEF Design Gallery <buiduclong.work@gmail.com>",
    to: "buiduclong.work@gmail.com",
    subject: "Test Email",
    text: "This is a test email",
  });
  console.log("✅ Email sent!");
}

main().catch(console.error);
