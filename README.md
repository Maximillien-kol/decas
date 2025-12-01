# Decas' Day - Birthday Registration System

A complete birthday event registration system with QR code generation, email notifications, and admin dashboard.

## Features

- 🎉 **Birthday Registration Form** - Two-column layout with form and background image
- 📧 **Email Notifications** - Automated SMTP emails with QR codes
- 🎫 **QR Code Tickets** - Unique QR codes for each guest
- 📱 **Ticket Verification Page** - Displays event details when QR is scanned
- 👥 **Admin Dashboard** - Manage guest registrations (accept/reject)
- 💾 **Supabase Integration** - Cloud database for data persistence
- 🎨 **Beautiful UI** - Responsive design with modern components

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Database**: Supabase
- **Email**: Nodemailer (SMTP)
- **QR Codes**: qrcode library
- **Deployment**: Vercel

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Maximillien-kol/decas.git
cd decas
npm install
```

### 2. Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com)
2. Create a new project
3. Go to SQL Editor and run the SQL from `supabase-setup.sql`
4. Get your project URL and anon key from Settings → API

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@example.com

# Application URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Gmail SMTP Setup

1. Enable 2-Step Verification in Google Account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the generated password in `SMTP_PASSWORD`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add Environment Variables:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASSWORD`
   - `SMTP_FROM`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_BASE_URL` (your production URL)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click "Deploy"

### 3. Update Production URL

After deployment, update `NEXT_PUBLIC_BASE_URL` in Vercel environment variables to your production URL (e.g., `https://your-app.vercel.app`)

## Usage

### For Guests

1. Visit the homepage
2. Fill in registration details
3. Upload payment screenshot
4. Receive email with QR code ticket

### For Admins

1. Visit `/dashboard`
2. Login with password: `decas2025`
3. View all registrations
4. Accept or reject pending registrations

### Ticket Verification

When guests scan their QR code, they'll see:
- Event date and time
- Location details
- Dress code
- Important notes

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── guests/          # Guest management API
│   │   └── send-registration/ # Registration & email API
│   ├── dashboard/           # Admin dashboard
│   ├── ticket/              # Ticket verification page
│   └── page.tsx             # Main registration form
├── components/
│   ├── birthday-registration-form.tsx
│   ├── qr-code-display.tsx
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── email.ts             # Email service
│   ├── supabase.ts          # Supabase client
│   └── utils.ts
└── public/                  # Static assets
```

## Database Schema

The `guests` table in Supabase:

```sql
- id (UUID)
- first_name (TEXT)
- last_name (TEXT)
- email (TEXT)
- telephone (TEXT)
- registration_id (TEXT, unique)
- timestamp (TIMESTAMPTZ)
- status (TEXT: pending/accepted/rejected)
- created_at (TIMESTAMPTZ)
- updated_at (TIMESTAMPTZ)
```

## Security

- Environment variables for sensitive data
- Row Level Security (RLS) enabled in Supabase
- Password-protected admin dashboard
- Secure email transmission

## Customization

### Change Event Details

Edit `app/ticket/ticket-content.tsx` to update:
- Event date and time
- Location
- Dress code
- Important notes

### Change Color Scheme

Edit `app/globals.css` to modify the color palette.

### Change Dashboard Password

Edit `app/dashboard/page.tsx` line 44 to change from `decas2025`.

## Support

For issues or questions, contact: bagiramaximillien@gmail.com

## License

MIT License - feel free to use this project for your events!
