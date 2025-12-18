import nodemailer from 'nodemailer';

// Create transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Email templates
export const emailTemplates = {
  registration: (data: {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
  }) => ({
    subject: "Birthday Registration Received - Decas' Day",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .highlight { color: #667eea; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Registration Received!</h1>
              <p>Thank you for registering for Decas' Day</p>
            </div>
            <div class="content">
              <h2>Hello ${data.firstName} ${data.lastName},</h2>
              <p>We've received your registration for <strong>Decas' Day</strong>! Your payment is currently being reviewed.</p>
              
              <div class="info-box">
                <h3>Registration Details:</h3>
                <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Phone:</strong> ${data.telephone}</p>
              </div>

              <h3>📧 Next Steps</h3>
              <p>Your ticket will be sent to you shortly via email. Please keep an eye on your inbox for your entry QR code.</p>
              <p><strong>Important:</strong> Make sure to save the QR code when you receive it. You'll need to show it at the event entrance.</p>
              
              <div class="footer">
                <p>This is an automated message from Decas' Day Registration System</p>
                <p>&copy; 2025 Decas' Day. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Registration Received - Decas' Day
      
      Hello ${data.firstName} ${data.lastName},
      
      We've received your registration for Decas' Day!
      
      Registration Details:
      - Name: ${data.firstName} ${data.lastName}
      - Email: ${data.email}
      - Phone: ${data.telephone}
      - Amount Paid: 10,500 FRW
      
      Your ticket will be sent to you shortly via email. Please save the QR code when you receive it and present it at the event entrance.
      
      If you have any questions, feel free to reach out to us.
    `,
  }),

  adminNotification: (data: {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    timestamp: string;
  }) => ({
    subject: "New Birthday Registration - Payment Pending",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2c3e50; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .info-box { background: white; padding: 15px; margin: 15px 0; border: 1px solid #ddd; }
            .label { font-weight: bold; color: #2c3e50; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🎫 New Registration Received</h2>
            </div>
            <div class="content">
              <h3>A new guest has registered for Decas' Day</h3>
              
              <div class="info-box">
                <p><span class="label">Name:</span> ${data.firstName} ${data.lastName}</p>
                <p><span class="label">Email:</span> ${data.email}</p>
                <p><span class="label">Phone:</span> ${data.telephone}</p>
                <p><span class="label">Submitted:</span> ${data.timestamp}</p>
              </div>

              <p><strong>Action Required:</strong></p>
              <ul>
                <li>Verify the payment screenshot</li>
                <li>Approve or reject the registration</li>
                <li>Manually generate and send QR code upon approval</li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      New Registration Received
      
      A new guest has registered for Decas' Day:
      
      Name: ${data.firstName} ${data.lastName}
      Email: ${data.email}
      Phone: ${data.telephone}
      Submitted: ${data.timestamp}
      
      Action Required:
      - Verify the payment screenshot
      - Approve or reject the registration
      - Manually generate and send QR code upon approval
    `,
  }),
};

// Send email function
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string,
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>
) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
      text,
      attachments,
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
