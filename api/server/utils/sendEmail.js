const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const { isEnabled } = require('~/server/utils/handleText');
const logger = require('~/config/winston');

/**
 * Sends an email using the specified template, subject, and payload.
 * Tracking is disabled for ElasticEmail.
 *
 * @async
 * @function sendEmail
 * @param {Object} params - The parameters for sending the email.
 * @param {string} params.email - The recipient's email address.
 * @param {string} params.subject - The subject of the email.
 * @param {Record<string, string>} params.payload - The data to be used in the email template.
 * @param {string} params.template - The filename of the email template.
 * @param {boolean} [throwError=true] - Whether to throw an error if the email sending process fails.
 * @returns {Promise<Object>} - A promise that resolves to the info object of the sent email or the error if sending the email fails.
 */
const sendEmail = async ({ email, subject, payload, template, throwError = true }) => {
  try {
    const transporterOptions = {
      secure: process.env.EMAIL_ENCRYPTION === 'tls',
      requireTls: process.env.EMAIL_ENCRYPTION === 'starttls',
      tls: {
        rejectUnauthorized: !isEnabled(process.env.EMAIL_ALLOW_SELFSIGNED),
      },
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Add custom headers to disable tracking
      headers: {
        'x-elastic-track-opens': 'false',
        'x-elastic-track-clicks': 'false',
      },
    };

    if (process.env.EMAIL_ENCRYPTION_HOSTNAME) {
      transporterOptions.tls.servername = process.env.EMAIL_ENCRYPTION_HOSTNAME;
    }

    if (process.env.EMAIL_SERVICE) {
      transporterOptions.service = process.env.EMAIL_SERVICE;
    } else {
      transporterOptions.host = process.env.EMAIL_HOST;
      transporterOptions.port = process.env.EMAIL_PORT ?? 25;
    }

    const transporter = nodemailer.createTransport(transporterOptions);

    const source = fs.readFileSync(path.join(__dirname, 'emails', template), 'utf8');
    const compiledTemplate = handlebars.compile(source);
    const options = () => {
      return {
        from:
          `"${
            process.env.VITE_APP_AUTHOR || process.env.APP_TITLE || process.env.EMAIL_FROM_NAME
          }"` + `<${process.env.EMAIL_FROM}>`,
        to: `"${payload.name}" <${email}>`,
        envelope: {
          from: process.env.EMAIL_FROM,
          to: email,
        },
        subject: subject,
        html: compiledTemplate(payload),
        // Add headers to the email options as well
        headers: {
          trackopens: 'false',
          trackclicks: 'false',
        },
      };
    };

    return await transporter.sendMail(options());
  } catch (error) {
    if (throwError) {
      throw error;
    }
    logger.error('[sendEmail]', error);
    return error;
  }
};

module.exports = sendEmail;
