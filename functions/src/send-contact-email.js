const { onRequest } = require('firebase-functions/v2/https');
const nodemailer = require('nodemailer');
const cors = require('cors');

const corsHandler = cors({ origin: true });

const domainKeyMap = {
  'helpinghandafh.com': 'helpinghand',
  'aefamilyhome.com': 'aefamilyhome',
  'sbmediahub.com': 'sbmediahub',
  'countrycrestafh.com': 'countrycrest',
  'prestigecareafh.com': 'prestigecare',
};

const getTransporterForDomain = (domain) => {
  const key = domainKeyMap[domain] || 'default';
  const user = process.env[`EMAIL_${key.toUpperCase()}_USER`];
  const pass = process.env[`EMAIL_${key.toUpperCase()}_PASS`];

  if (!user || !pass) {
    throw new Error(`Email credentials not found for domain: ${domain}`);
  }

  return nodemailer.createTransport({
    service: 'Gmail',
    auth: { user, pass },
  });
};

const sendContactEmail = onRequest((req, res) => {
  corsHandler(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    const { name, email, message, website } = req.body;

    if (!name || !email || !message || !website) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, message, or website.',
      });
    }

    try {
      const domain = website;
      const transporter = getTransporterForDomain(domain);
      const key = domainKeyMap[domain] || 'default';
      const user = process.env[`EMAIL_${key.toUpperCase()}_USER`];

      const mailOptions = {
        from: user,
        to: user,
        bcc: 'monkifoto@gmail.com',
        subject: `New Contact Form Submission - ${domain}`,
        html: `
          <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
            <h2 style="color: #4CAF50;">📬 New Contact Form Message</h2>
            <p><strong>Website:</strong> ${domain}</p>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: #f9f9f9; padding: 10px; border-left: 4px solid #4CAF50;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            <hr>
            <p style="font-size: 12px; color: #999;">This message was sent via the contact form on your website.</p>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      console.log(`✅ Email sent from ${domain} (${email})`);
      return res.status(200).json({ success: true, message: 'Email sent successfully' });

    } catch (error) {
      console.error('❌ Error sending email:', error);
      return res.status(500).json({
        success: false,
        message: 'Error sending email',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
});

module.exports = { sendContactEmail };
