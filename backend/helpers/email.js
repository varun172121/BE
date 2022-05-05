import { createTransport } from "nodemailer";
import * as config from "../config.js";

export const sendMail = async (emailaddress, subject_details,mailbody) => {
    const mailBody = mailbody;

    let transporter = createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: false,

        service: "gmail",
        auth: {
            type: config.nodemailer_transport_type,
            user: config.nodemailer_transport_user,
            pass: config.nodemailer_transport_pass,
            clientId: config.nodemailer_transport_clientid,
            clientSecret: config.nodemailer_transport_client_secret,
            refreshToken: config.nodemailer_transport_refresh_token,
        },
    });
    let mailOptions = {
        from: config.nodemailer_transport_user,
        to: emailaddress,
        subject: subject_details,
        // text: body_content
        html: mailBody,
    };
    await sending();
    async function sending() {
        transporter.sendMail(mailOptions, function (err, data) {
            if (err) {
                console.log("Error " + err);
            } else {
                console.log("Email sent successfully");
            }
        });
    }
};
