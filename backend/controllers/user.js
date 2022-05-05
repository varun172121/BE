import { firebase_firestore } from "../db.js";
import * as config from "../config.js";
import CryptoJs from "crypto-js";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Supervisor from "../models/Supervisor.js";
import { userExists } from "../helpers/users.js";
import jwt from "jsonwebtoken";
import { uid } from "../helpers/other.js";
import { sendMail } from "../helpers/email.js";
import { async } from "@firebase/util";
import * as auth from "../helpers/auth.js";
import { url } from "../config.js";

const registerStudent = async (req, res) => {
    try {
        if (req.body.userExists !== false) {
            return res.status(900).json("EmailId already used");
        }

        let student = new Student(
            req.body.firstName,
            req.body.lastName,
            req.body.phoneNumber,
            req.body.emailId,
            req.body.userName,
            req.body.password
        );
        const hashedPassword = CryptoJs.AES.encrypt(
            req.body.password,
            config.passKey
        ).toString();
        // const data = { ...req.body, password: hashedPassword, isSupervisor: false ,isStudent:true, isAdmin:false }
        student.password = hashedPassword;
        const studentJson = JSON.parse(JSON.stringify(student));
        // const newId = uid();
        // studentJson.userId = newId;
        // const result = await firebase_firestore.collection("users").add(studentJson);
        // await firebase_firestore.collection("users").doc(result.id).update({ userId: result.id });
        const accessToken = jwt.sign(
            {
                isSupervisor: student.isSupervisor,
                emailId: student.emailId,
                firstName: student.firstName,
                lastName: student.lastName,
                phoneNumber: student.phoneNumber,
                password: student.password,
                isAdmin: student.isAdmin,
                isStudent: student.isStudent,
            },
            config.jwt_passKey,
            {
                expiresIn: "5m",
            }
        );
        const mailBody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:Montserrat, sans-serif">
        <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>New message</title>
        <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if gte mso 9]>
        <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <!--[if !mso]><!-- -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
        <!--<![endif]-->
        <style type="text/css">
        #outlook a {
        padding:0;
        }
        .es-button {
        mso-style-priority:100!important;
        text-decoration:none!important;
        }
        a[x-apple-data-detectors] {
        color:inherit!important;
        text-decoration:none!important;
        font-size:inherit!important;
        font-family:inherit!important;
        font-weight:inherit!important;
        line-height:inherit!important;
        }
        .es-desk-hidden {
        display:none;
        float:left;
        overflow:hidden;
        width:0;
        max-height:0;
        line-height:0;
        mso-hide:all;
        }
        [data-ogsb] .es-button {
        border-width:0!important;
        padding:10px 30px 10px 30px!important;
        }
        @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:42px!important; text-align:center } h2 { font-size:26px!important; text-align:center } h3 { font-size:20px!important; text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:42px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:16px!important; display:block!important; border-right-width:0px!important; border-left-width:0px!important; border-bottom-width:15px!important; border-top-width:15px!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
        </style>
        </head>
        <body style="width:100%;font-family:Montserrat, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
        <div class="es-wrapper-color" style="background-color:#FFFFFF">
        <!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
        <v:fill type="tile" color="#ffffff"></v:fill>
        </v:background>
        <![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
        <tr>
        <td valign="top" style="padding:0;Margin:0">
        <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
        <tr>
        <td align="center" style="padding:0;Margin:0">
        <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:700px">
        <tr>
        <td align="left" style="Margin:0;padding-bottom:10px;padding-top:20px;padding-left:20px;padding-right:20px">
        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:660px">
        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td align="center" style="padding:0;Margin:0"><h2 style="Margin:0;line-height:43px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:36px;font-style:normal;font-weight:normal;color:#1976d2"><strong>EXAMINATOR</strong></h2></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
        <tr>
        <td align="center" style="padding:0;Margin:0">
        <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:700px">
        <tr>
        <td align="left" style="padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px">
        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td align="center" valign="top" style="padding:0;Margin:0;width:660px">
        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://ktfsba.stripocdn.email/content/guids/CABINET_004647d6c9d4323b9b8c66d9306bff51/images/undraw_approve_qwp7.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="303"></td>
        </tr>
        <tr>
        <td align="center" style="padding:0;Margin:0"><h2 style="Margin:0;line-height:43px;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;font-size:36px;font-style:normal;font-weight:normal;color:#333333">Verify your email to finish signing up</h2></td>
        </tr>
        <tr>
        <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
        <table border="0" width="40%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:40% !important;display:inline-table">
        <tr>
        <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
        </tr>
        </table></td>
        </tr>
        <tr>
        <td align="center" class="es-m-p0r" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:24px;color:#333333;font-size:16px">Thank you for signing up.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:24px;color:#333333;font-size:16px">Please confirm your account creation&nbsp;by clicking on the button below.</p></td>
        </tr>
        <tr>
        <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
        <table border="0" width="40%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:40% !important;display:inline-table">
        <tr>
        <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
        </tr>
        </table></td>
        </tr>
        <tr>
        <td align="center" class="es-m-txt-l" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><span class="es-button-border" style="border-style:solid;border-color:#999999;background:#ffffff;border-width:1px;display:inline-block;border-radius:0px;width:auto"><a class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#666666;font-size:16px;border-style:solid;border-color:#ffffff;border-width:10px 30px 10px 30px;display:inline-block;background:#ffffff;border-radius:0px;font-family:Montserrat, sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center" href="${url}/api/user/emailverifivation?id=${accessToken}">Verify my email</a></span></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table>
        </div>
        </body>
        </html>`;
        await sendMail(student.emailId, "Email Verification", mailBody);
        // return res.status(200).json(result);
        return res.status(200).json({});
    } catch (error) {
        return res.status(400).json("Failed to create the Student" + error);
    }
};

const registerSupervisor = async (req, res) => {
    try {
        if (req.body.userExists !== false) {
            return res.status(400).json("EmailId already used");
        }

        let supervisor = new Supervisor(
            req.body.firstName,
            req.body.lastName,
            req.body.phoneNumber,
            req.body.emailId,
            req.body.userName,
            req.body.password
        );
        const hashedPassword = CryptoJs.AES.encrypt(
            req.body.password,
            config.passKey
        ).toString();
        // const data = { ...req.body, password: hashedPassword, isSupervisor: false ,isStudent:true, isAdmin:false }
        supervisor.password = hashedPassword;
        const supervisorJson = JSON.parse(JSON.stringify(supervisor));

        // const newId = uid();
        // supervisorJson.userId = newId;
        delete supervisorJson.examsCreated;
        // const result = await firebase_firestore.collection('users').add(supervisorJson)
        // await firebase_firestore.collection("users").doc(result.id).update({ user_id: result.id });
        // const result = await firebase_firestore.collection("users").doc(newId).create(supervisorJson);
        const accessToken = jwt.sign(
            {
                isSupervisor: supervisor.isSupervisor,
                emailId: supervisor.emailId,
                firstName: supervisor.firstName,
                lastName: supervisor.lastName,
                phoneNumber: supervisor.phoneNumber,
                password: supervisor.password,
                isAdmin: supervisor.isAdmin,
                isStudent: supervisor.isStudent,
            },
            config.jwt_passKey,
            {
                expiresIn: "5m",
            }
        );
        const mailBody = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:Montserrat, sans-serif">
        <head>
        <meta charset="UTF-8">
        <meta content="width=device-width, initial-scale=1" name="viewport">
        <meta name="x-apple-disable-message-reformatting">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta content="telephone=no" name="format-detection">
        <title>New message</title>
        <!--[if (mso 16)]>
        <style type="text/css">
        a {text-decoration: none;}
        </style>
        <![endif]-->
        <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
        <!--[if gte mso 9]>
        <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG></o:AllowPNG>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <!--[if !mso]><!-- -->
        <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet">
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet">
        <!--<![endif]-->
        <style type="text/css">
        #outlook a {
        padding:0;
        }
        .es-button {
        mso-style-priority:100!important;
        text-decoration:none!important;
        }
        a[x-apple-data-detectors] {
        color:inherit!important;
        text-decoration:none!important;
        font-size:inherit!important;
        font-family:inherit!important;
        font-weight:inherit!important;
        line-height:inherit!important;
        }
        .es-desk-hidden {
        display:none;
        float:left;
        overflow:hidden;
        width:0;
        max-height:0;
        line-height:0;
        mso-hide:all;
        }
        [data-ogsb] .es-button {
        border-width:0!important;
        padding:10px 30px 10px 30px!important;
        }
        @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120% } h1 { font-size:42px!important; text-align:center } h2 { font-size:26px!important; text-align:center } h3 { font-size:20px!important; text-align:center } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:42px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:16px!important; display:block!important; border-right-width:0px!important; border-left-width:0px!important; border-bottom-width:15px!important; border-top-width:15px!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } }
        </style>
        </head>
        <body style="width:100%;font-family:Montserrat, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
        <div class="es-wrapper-color" style="background-color:#FFFFFF">
        <!--[if gte mso 9]>
        <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
        <v:fill type="tile" color="#ffffff"></v:fill>
        </v:background>
        <![endif]-->
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
        <tr>
        <td valign="top" style="padding:0;Margin:0">
        <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
        <tr>
        <td align="center" style="padding:0;Margin:0">
        <table bgcolor="#ffffff" class="es-header-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:700px">
        <tr>
        <td align="left" style="Margin:0;padding-bottom:10px;padding-top:20px;padding-left:20px;padding-right:20px">
        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td class="es-m-p0r" valign="top" align="center" style="padding:0;Margin:0;width:660px">
        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td align="center" style="padding:0;Margin:0"><h2 style="Margin:0;line-height:43px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:36px;font-style:normal;font-weight:normal;color:#1976d2"><strong>EXAMINATOR</strong></h2></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table>
        <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
        <tr>
        <td align="center" style="padding:0;Margin:0">
        <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:700px">
        <tr>
        <td align="left" style="padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px">
        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td align="center" valign="top" style="padding:0;Margin:0;width:660px">
        <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
        <tr>
        <td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://ktfsba.stripocdn.email/content/guids/CABINET_004647d6c9d4323b9b8c66d9306bff51/images/undraw_approve_qwp7.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" height="303"></td>
        </tr>
        <tr>
        <td align="center" style="padding:0;Margin:0"><h2 style="Margin:0;line-height:43px;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;font-size:36px;font-style:normal;font-weight:normal;color:#333333">Verify your email to finish signing up</h2></td>
        </tr>
        <tr>
        <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
        <table border="0" width="40%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:40% !important;display:inline-table">
        <tr>
        <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
        </tr>
        </table></td>
        </tr>
        <tr>
        <td align="center" class="es-m-p0r" style="padding:0;Margin:0;padding-top:5px;padding-bottom:5px;padding-right:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:24px;color:#333333;font-size:16px">Thank you for signing up.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:Montserrat, sans-serif;line-height:24px;color:#333333;font-size:16px">Please confirm your account creation&nbsp;by clicking on the button below.</p></td>
        </tr>
        <tr>
        <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0">
        <table border="0" width="40%" height="100%" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:40% !important;display:inline-table">
        <tr>
        <td style="padding:0;Margin:0;border-bottom:1px solid #cccccc;background:none;height:1px;width:100%;margin:0px"></td>
        </tr>
        </table></td>
        </tr>
        <tr>
        <td align="center" class="es-m-txt-l" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px"><span class="es-button-border" style="border-style:solid;border-color:#999999;background:#ffffff;border-width:1px;display:inline-block;border-radius:0px;width:auto"><a class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#666666;font-size:16px;border-style:solid;border-color:#ffffff;border-width:10px 30px 10px 30px;display:inline-block;background:#ffffff;border-radius:0px;font-family:Montserrat, sans-serif;font-weight:normal;font-style:normal;line-height:19px;width:auto;text-align:center" href="${url}/api/user/emailverifivation?id=${accessToken}">Verify my email</a></span></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table></td>
        </tr>
        </table>
        </div>
        </body>
        </html>`;
        await sendMail(
            supervisor.emailId,
            "Email Verification",
            mailBody
        );
        return res.status(200).json({});
    } catch (error) {
        return res.status(400).json("Failed to create the Supervisor" + error);
    }
};

const login = async (req, res) => {
    try {
        // console.log(req.body)

        if (req.body.userExists === false) {
            return res.status(400).json("User does not exists");
        }

        // if (req.body.userExists.sessionId != "") {
        //   return res.status(400).json("Account is logged in already")

        // }

        // const sessionExists = await (await firebase_firestore.collection("users").doc(req.body.userExists.userId).get()).data()["sessionId"];
        // console.log(sessionExists)
        // if(sessionExists === true){
        //   return res.status(400).json("Account is logged in already")

        // }

        const user = req.body.userExists;
        const hashedPassword = CryptoJs.AES.decrypt(
            user.password,
            config.passKey
        );
        const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        if (OriginalPassword !== req.body.password) {
            return res.status(401).json("Wrong Password");
        }
        const accessToken = jwt.sign(
            {
                userId: user.userId,
                isStudent: user.isStudent ?? false,
                isSupervisor: user.isSupervisor ?? false,
                isAdmin: user.isAdmin ?? false,
                emailId: user.emailId,
                firstName: user.firstName,
                lastName: user.lastName,
            },
            config.jwt_passKey,
            {
                expiresIn: "1d",
            }
        );

        // req.session.userId = user.userId;
        // const sessionid = req.session.id;
        // req.session.sessid = sessionid;
        // session_id = sessionid;
        // sess(req.session.userId, sessionid)
        // req.session.save()

        // await firebase_firestore.collection("users").doc(user.userId).update({ sessionId: true });

        // await firebase_firestore.collection("users").doc(user.userId).update({ sessionId: sessionid });
        // await firebase_firestore.collection("users").doc(user.userId).update({sessionId:sessionId});

        // encrypt the token here
        // const accessTokenEncrypt = CryptoJs.AES.encrypt(
        //   accessToken,
        //   config.token_encrypt_key
        // ).toString();

        // const accessToken = jwt.sign({
        //     user
        // }, config.jwt_passKey, { expiresIn: "3d" })

        const { password, isSupervisor, isStudent, isAdmin, ...others } = user;
        var userType;
        if (user.isSupervisor) {
            userType = "supervisor";
        } else if (user.isStudent) {
            userType = "student";
        } else if (user.isAdmin) {
            userType = "admin";
        }
        others.role = userType;
        // res.locals = req.session.userId;
        req.user = req.body.userExists;
        return res.status(200).json({
            ...others,
            //   accessTokenEncrypt,
            accessToken,
        });
    } catch (err) {
        res.status(500).json(err);
    }
};

const emailverify = async (req, res) => {
    const id = req.query.id;
    auth.emailToken(id, req, res);
    delete req.user["iat"];
    delete req.user["exp"];
    if (req.email) {
        const result = await firebase_firestore
            .collection("users")
            .add(req.user);
        await firebase_firestore
            .collection("users")
            .doc(result.id)
            .update({ userId: result.id, emailVerified: true })
            .then((result) => {
                res.write("Email have been verified Successfully");
                res.end();
            });
    }
};

const logout = async (req, res) => {
    console.log(req);
    // console.log(req.sessid)
    console.log(req.headers.token);

    // const session_data= await firebase_firestore.collection("session").doc(session_id).get()
    // console.log("session data",JSON.parse(session_data.data().data).sessid)
    // if (JSON.parse(session_data.data().data).sessid)
    // {
    //   await firebase_firestore.collection("users").doc(JSON.parse(session_data.data().data).userId).update({ sessionId: "" });
    //   await firebase_firestore.collection("session").doc(JSON.parse(session_data.data().data).sessid).delete()
    //   return res.status(200).json("Logged out successfully");
    // }
    if (req.headers.token) {
        // console.log("userId while logging out ",req.user)
        // await firebase_firestore.collection("users").doc(req.user.userId).update({ sessionId: false });
        // await firebase_firestore.collection("session").doc(JSON.parse(session_data.data().data).sessid).delete()

        return res.status(200).json("Logged out successfully");
    } else {
        return res.status(401).json("No user was logged in");
    }
};

const refreshToken = async (req, res) => {
    res.redirect("");
};
const forgotpassword = async (req, res) => {
    const forgotpasswordemail = req.body.emailId;
    if (req.body.userExists === false) {
        return res.status(400).json("User With this email does not exists");
    }
    const user = req.body.userExists;
    const token = jwt.sign({
        userId: user.userId,
        emailId: user.emailId,
        firstName: user.firstName,
        lastName: user.lastName,
        isStudent: user.isStudent,
        isSupervisor: user.isSupervisor,
        isAdmin: user.isAdmin,
    }, config.jwt_passKey, { expiresIn: "5m" })
    const url = `${config.url}/api/user/resetpassword?token=${token}`;
    const body = `<h1>Reset Password</h1><p>This is a unique link to reset password it is only active for 5 minutes</p><br>Click on the below link to reset your password</br><br><a href=${url}>Reset Password</a></br>`;

    await sendMail(forgotpasswordemail, "Reset Password", body);
    return res.status(200).json("Email has been sent to your email id");

};

const resetpassword = async (req, res) => {
    const token = req.query.token;
    auth.emailToken(token, req, res);
    console.log(req.user);
    res.write(JSON.stringify(req.user));
    res.end();
}

const changePassword = async (req, res) => {
   
      
        const oldPassword= req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const encryptedPassword = CryptoJs.AES.encrypt(
            oldPassword,
            config.passKey
        ).toString();
        const retrievedPassword = await (await firebase_firestore.collection("users").doc(req.user.userId).get()).data().password;
        const decryptedPassword = CryptoJs.AES.decrypt(
            retrievedPassword,
            config.passKey
        ).toString(CryptoJs.enc.Utf8);
        console.log("-------------------");
        console.log(encryptedPassword);
        console.log("-------------------");
        console.log(retrievedPassword);
            
        if(encryptedPassword === retrievedPassword){
            return res.status(200).json("Password changed");
            // const newHashedPassword = CryptoJs.AES.encrypt(
            //     newPassword,
            //     config.passKey
            // ).toString();
            // await firebase_firestore.collection("users").doc(req.user.userId).update({ password: newHashedPassword });
            // return res.status(200).json("Password has been changed successfully");
        }
        else{
            return res.status(400).json("Old Password is incorrect");
        }
    
    }

const changeprofilepassword = async (req, res) => {
    
        try {

            const hashedPassword = CryptoJs.AES.decrypt(
                req.body.userExists.password,
                config.passKey
            );
            const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
            if (OriginalPassword!==req.body.oldPassword) {
                return res.status(401).json("Old password doesnot match");
            }
            const hashedPasswordNew = CryptoJs.AES.encrypt(
                req.body.newPassword,
                config.passKey
            ).toString();

            await firebase_firestore.collection("users").doc(req.user.userId).update({ password: hashedPasswordNew });
            return res.status(200).json("Password changed successfully");
        }
        catch (err) {
            res.status(500).json(err);
        }
    }


const changepassword = async (req, res) => {
    try {
        auth.emailToken(req.body.token, req, res);
        const user = req.user;
        console.log(req.body.newpassword);
        console.log(req.body.confirmnewpassword);
        // const hashedPassword = CryptoJs.AES.decrypt(
        //     user.password,
        //     config.passKey
        // );
        // const OriginalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
        // if (OriginalPassword !== req.body.oldPassword) {
        //     return res.status(401).json("Wrong Password");
        // }
        const hashedPasswordNew = CryptoJs.AES.encrypt(
            req.body.newpassword,
            config.passKey
        );
        console.log(hashedPasswordNew.toString());
        await firebase_firestore
            .collection("users")
            .doc(user.userId)
            .update({ password: hashedPasswordNew.toString() });
        const body="<h1>Password Changed</h1><p>Your password has been changed successfully</p>"
        await sendMail(user.emailId, "Password Changed",body);
        return res.status(200).json("Password changed successfully");
    } catch (err) {
        console.log("ignore this err");
        // res.status(500).json(err);
    }
};


export {
    registerStudent,
    registerSupervisor,
    login,
    logout,
    refreshToken,
    emailverify,
    forgotpassword,
    resetpassword,
    changeprofilepassword,
};
