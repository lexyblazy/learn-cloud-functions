import * as sgMail from "@sendgrid/mail";

export const sendEmail = async (mailData: sgMail.MailDataRequired) => {
  try {
    sgMail.setApiKey('<YOUR_SENDGRID_API_KEY>'); //put your send grid api key here

    await sgMail.send(mailData);
  } catch (error) {
    console.log("Failed to send email", error);
  }
};
