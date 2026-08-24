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

  // Same user-controlled value, different context: the mailto href needs
  // URI-percent-encoding (not HTML-escaping) since it's a URL query
  // component, not HTML text/attribute content.
  const replySubject = encodeURIComponent(`Re: ${data.subject}`);

  const sentAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

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
      body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f5f5f5; }
      a { text-decoration: none; }
      @media screen and (max-width: 620px) {
        .wrapper { width: 100% !important; }
        .content-padding { padding: 24px 20px !important; }
        .title-text { font-size: 24px !important; line-height: 30px !important; }
        .col-right { border-left: none !important; padding-left: 0 !important; padding-top: 20px !important; }
      }
    </style>
  </head>
  <body style="margin: 0 !important; padding: 0 !important; background-color: #f5f5f5;">
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 32px 12px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;" class="wrapper">
            <tr>
              <td style="background-color: #B63E96; height: 5px; line-height: 5px; font-size: 1px; border-radius: 0;">&nbsp;</td>
            </tr>
            <tr>
              <td style="background-color: #0f0f0f; padding: 32px 32px 28px 32px;" class="content-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td class="title-text" style="font-family: ${EMAIL_FONT_STACK}; font-size: 28px; line-height: 34px; font-weight: 700; color: #ffffff;">
                      New Portfolio Message
                    </td>
                  </tr>
                  <tr>
                    <td style="font-family: ${EMAIL_FONT_STACK}; font-size: 14px; font-weight: 700; color: #B63E96; padding: 10px 0 0 0;">
                      Someone reached out through your portfolio contact form.
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background-color: #ffffff; border-radius: 14px; padding: 30px 28px;" class="content-padding">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td>
                      <div class="col-left" style="display: inline-block; width: 100%; max-width: 258px; vertical-align: top; box-sizing: border-box; padding-right: 20px; font-size: 14px; line-height: normal;">
                        <span style="display: block; font-family: ${EMAIL_FONT_STACK}; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #B63E96;">From</span>
                        <span style="display: block; font-family: ${EMAIL_FONT_STACK}; font-size: 15px; font-weight: 600; color: #0f0f0f; padding-top: 6px;">${name}</span>
                        <a href="mailto:${email}" style="display: inline-block; font-family: ${EMAIL_FONT_STACK}; font-size: 14px; font-weight: 700; color: #B63E96; text-decoration: none; padding-top: 2px;">${email}</a>
                        <span style="display: block; font-family: ${EMAIL_FONT_STACK}; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #B63E96; padding-top: 18px;">Subject</span>
                        <span style="display: block; font-family: ${EMAIL_FONT_STACK}; font-size: 15px; color: #0f0f0f; padding-top: 6px; word-break: break-word;">${subject}</span>
                      </div><div class="col-right" style="display: inline-block; width: 100%; max-width: 258px; vertical-align: top; box-sizing: border-box; padding-left: 20px; border-left: 1px solid #ececec; font-size: 14px; line-height: normal;">
                        <span style="display: block; font-family: ${EMAIL_FONT_STACK}; font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: #B63E96;">Message</span>
                        <span style="display: block; font-family: ${EMAIL_FONT_STACK}; font-size: 15px; line-height: 22px; color: #333333; white-space: pre-wrap; padding-top: 6px;">${message}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 28px 0 0 0;">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color: #B63E96; border-radius: 6px;">
                            <a href="mailto:${email}?subject=${replySubject}" style="display: inline-block; font-family: ${EMAIL_FONT_STACK}; font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; padding: 11px 22px;">Reply to ${name} &rarr;</a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 26px 20px 0 20px;">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="border-top: 1px solid #e2e2e2; font-size: 1px; line-height: 1px;">&nbsp;</td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 18px 0 0 0;">
                      <span style="font-family: ${EMAIL_FONT_STACK}; font-size: 15px; font-weight: 700; color: #B63E96; vertical-align: middle;">&#8853;</span>
                      <span style="font-family: ${EMAIL_FONT_STACK}; font-size: 12px; color: #9a9a9a; vertical-align: middle; padding-left: 6px;">Sent from the contact form on your portfolio.</span>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="font-family: ${EMAIL_FONT_STACK}; font-size: 11px; color: #b5b5b5; padding: 4px 0 0 0;">${sentAt}</td>
                  </tr>
                </table>
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
