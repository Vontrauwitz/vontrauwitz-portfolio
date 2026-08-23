import { NextResponse } from 'next/server';
import { mailOptions, transporter } from '@/config/nodemailer';

// Moved from src/pages/api/contact.js for Checkpoint 2.7, per PLAN.md's
// explicit instruction — this is a genuine external HTTP endpoint (the
// contact form), exactly the kind of thing rule 12 calls out as a Route
// Handler, not a Server Action. Logic/behavior unchanged: same field
// validation, same email content, same Nodemailer transporter (still
// imported from the untouched src/config/nodemailer.js).
//
// Route Handlers require one named export per HTTP method rather than a
// single `handler(req, res)` branching on `req.method` — the original
// returned `400 { message: 'Bad Request' }` for every non-POST method
// (not Next's default 405), so that's reproduced explicitly below for
// every method a client could realistically send, instead of relying on
// the framework's default behavior for unhandled methods.

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const CONTACT_MESSAGE_FIELD: Record<keyof ContactFormData, string> = {
  name: "Name",
  email: "Email",
  subject: "Subject",
  message: "Message",
};

const generateEmailContent = (data: ContactFormData) => {
  const stringData = Object.entries(data).reduce(
    (str, [key, val]) =>
      (str += `${CONTACT_MESSAGE_FIELD[key as keyof ContactFormData]}: \n${val} \n \n`),
    ''
  )

  const htmlData = Object.entries(data).reduce(
    (str, [key, val]) =>
      (str += `<h1 class='form-heading' align='left' >${CONTACT_MESSAGE_FIELD[key as keyof ContactFormData]}</h1><p class='form-answer' align='left' >${val}</p>`),
    ''
  )


  return {
    text: stringData,
    html: `<!DOCTYPE html> <html> <head> <title></title> <meta charset="utf-8" /> <meta name="viewport" content="width=device-width, initial-scale=1" /> <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <style type="text/css"> body, table, td, a{-webkit - text - size - adjust: 100%; -ms-text-size-adjust: 100%;}table{border - collapse: collapse !important;}body{height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important;}@media screen and (max-width: 525px){.wrapper{width: 100% !important; max-width: 100% !important;}.responsive-table{width: 100% !important;}.padding{padding: 10px 5% 15px 5% !important;}.section-padding{padding: 0 15px 50px 15px !important;}}.form-container{margin - bottom: 24px; padding: 20px; border: 1px dashed #ccc;}.form-heading{color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 400; text-align: left; line-height: 20px; font-size: 18px; margin: 0 0 8px; padding: 0;}.form-answer{color: #2a2a2a; font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif; font-weight: 300; text-align: left; line-height: 20px; font-size: 16px; margin: 0 0 24px; padding: 0;}div[style*="margin: 16px 0;"]{margin: 0 !important;}</style> </head> <body style="margin: 0 !important; padding: 0 !important; background: #fff"> <div style=" display: none; font-size: 1px; color: #fefefe; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; " ></div><table border="0" cellpadding="0" cellspacing="0" width="100%"> <tr> <td bgcolor="#ffffff" align="center" style="padding: 10px 15px 30px 15px" class="section-padding" > <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px" class="responsive-table" > <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0"> <tr> <td> <table width="100%" border="0" cellspacing="0" cellpadding="0" > <tr> <td style=" padding: 0 0 0 0; font-size: 16px; line-height: 25px; color: #232323; " class="padding message-content" > <h2>New Contact Message From Your Portfolio Hans</h2> <div class="form-container">${htmlData}</div></td></tr></table> </td></tr></table> </td></tr></table> </td></tr></table> </body></html>,`
  }
}

export async function POST(request: Request) {
  const data = (await request.json()) as Partial<ContactFormData>;
  if (!data.name || !data.email || !data.subject || !data.message) {
    return NextResponse.json({ message: 'Bad request' }, { status: 400 });
  }
  try {
    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(data as ContactFormData),
      subject: data.subject,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Unable to send message' }, { status: 500 });
  }
}

const badRequest = () => NextResponse.json({ message: 'Bad Request' }, { status: 400 });

export const GET = badRequest;
export const PUT = badRequest;
export const DELETE = badRequest;
export const PATCH = badRequest;
