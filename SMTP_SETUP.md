# SMTP Email Setup Guide

This application now includes SMTP email functionality for sending registration confirmations.

## Setup Instructions

### 1. Configure Environment Variables

Open the `.env.local` file and update the following values:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com          # Your SMTP host (Gmail example)
SMTP_PORT=587                      # SMTP port (587 for TLS, 465 for SSL)
SMTP_USER=your-email@gmail.com     # Your email address
SMTP_PASSWORD=your-app-password    # Your email app password (NOT regular password)
SMTP_FROM=your-email@gmail.com     # Email address to send from
ADMIN_EMAIL=admin@example.com      # Admin email to receive notifications
```

### 2. Gmail Setup (if using Gmail)

If you're using Gmail, you need to create an **App Password**:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Select **Mail** and **Other (Custom name)**
5. Name it "Birthday Registration App"
6. Copy the generated 16-character password
7. Use this password in `SMTP_PASSWORD` (remove spaces)

### 3. Other Email Providers

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
```

#### Custom SMTP Server
```env
SMTP_HOST=mail.yourdomain.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASSWORD=your-password
```

### 4. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Fill out the registration form
3. Submit the form
4. Check both:
   - User's email (for confirmation)
   - Admin email (for notification)

## Email Templates

The system sends two types of emails:

### User Confirmation Email
- **Subject:** "Birthday Registration Received - Decas' Day"
- **Content:** Registration details and next steps
- **Sent to:** User's provided email address

### Admin Notification Email
- **Subject:** "New Birthday Registration - Payment Pending"
- **Content:** New registration details for review
- **Sent to:** Admin email specified in `.env.local`

## Troubleshooting

### "Authentication failed"
- Double-check your SMTP credentials
- For Gmail, ensure you're using an App Password, not your regular password
- Verify 2-Step Verification is enabled (required for Gmail App Passwords)

### "Connection timeout"
- Check your SMTP_HOST and SMTP_PORT
- Ensure your firewall isn't blocking the SMTP port
- Try using port 465 with `secure: true` in the transporter config

### "Email not received"
- Check spam/junk folders
- Verify the email address is correct
- Check server logs for error messages

## Security Notes

- **NEVER** commit your `.env.local` file to version control
- The `.env.local` file is already in `.gitignore`
- Use environment variables for production deployment
- Rotate your SMTP credentials regularly

## Production Deployment

For production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform's settings
2. Use the same variable names as in `.env.local`
3. Consider using a dedicated transactional email service (SendGrid, Mailgun, AWS SES) for better deliverability

## API Endpoint

The form submits to: `/api/send-registration`

Request format:
```
POST /api/send-registration
Content-Type: multipart/form-data

Fields:
- firstName: string
- lastName: string
- email: string
- telephone: string
- paymentScreenshot: File
```

Response:
```json
{
  "success": true,
  "message": "Registration emails sent successfully"
}
```
