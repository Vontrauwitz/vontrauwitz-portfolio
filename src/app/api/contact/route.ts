import { NextResponse } from 'next/server';
import { mailOptions, transporter } from '@/config/nodemailer';

// Moved from src/pages/api/contact.js for Checkpoint 2.7, per PLAN.md's
// explicit instruction — this is a genuine external HTTP endpoint (the
// contact form), exactly the kind of thing rule 12 calls out as a Route
// Handler, not a Server Action. Logic/behavior unchanged: same field
// validation, same email content, same Nodemailer transporter (imported
// from src/config/nodemailer.ts, typed in Checkpoint 2.9).
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

// User-submitted values are interpolated directly into the email HTML below,
// so every one of them has to be escaped first — otherwise a message
// containing e.g. "<img src=x onerror=...>" would execute in the recipient's
// mail client.
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return char;
    }
  });

const EMAIL_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const renderField = (label: string, value: string, { multiline = false } = {}) => `
  <tr>
    <td style="padding: 0 0 18px 0;">
      <span style="display:block; font-family: ${EMAIL_FONT_STACK}; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #B63E96;">${label}</span>
      <span style="display:block; font-family: ${EMAIL_FONT_STACK}; font-size: 15px; line-height: 22px; color: #1b1b1b; padding-top: 4px;${multiline ? ' white-space: pre-wrap;' : ''}">${value}</span>
    </td>
  </tr>`;

const generateEmailContent = (data: ContactFormData) => {
  const stringData = Object.entries(data).reduce(
    (str, [key, val]) =>
      (str += `${CONTACT_MESSAGE_FIELD[key as keyof ContactFormData]}: \n${val} \n \n`),
    ''
  )

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);
  const subject = escapeHtml(data.subject);
  const message = escapeHtml(data.message);

  const fieldsHtml = [
    renderField('Name', name),
    renderField('Email', email),
    renderField('Subject', subject),
    renderField('Message', message, { multiline: true }),
  ].join('');

  return {
    text: stringData,
    html: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>New Portfolio Message</title>
    <style type="text/css">
      body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
      table { border-collapse: collapse !important; }
      body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f5f5f5; }
      @media screen and (max-width: 525px) {
        .wrapper { width: 100% !important; max-width: 100% !important; }
        .section-padding { padding: 20px 16px !important; }
        .content-padding { padding: 22px 20px !important; }
      }
    </style>
  </head>
  <body style="margin: 0 !important; padding: 0 !important; background-color: #f5f5f5;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 28px 12px;" class="section-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px;" class="wrapper">
            <tr>
              <td style="background-color: #1b1b1b; border-top: 4px solid #B63E96; border-radius: 12px 12px 0 0; padding: 26px 32px;" class="content-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="font-family: ${EMAIL_FONT_STACK}; font-size: 19px; font-weight: 700; color: #f5f5f5;">
                      New Portfolio Message
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: ${EMAIL_FONT_STACK}; font-size: 13px; color: #B63E96; padding-top: 4px;">
                      Someone reached out through your portfolio contact form
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff; padding: 28px 32px 10px 32px; border-radius: 0 0 12px 12px;" class="content-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  ${fieldsHtml}
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 18px 12px 0 12px;">
                <span style="font-family: ${EMAIL_FONT_STACK}; font-size: 12px; color: #8a8a8a;">
                  Sent from the contact form on your portfolio.
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
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
      // Sender identity stays the EMAIL env var (mailOptions.from); replyTo
      // is the only thing that points back at the visitor, so hitting
      // "Reply" in Gmail addresses them directly instead of yourself.
      replyTo: data.email,
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
