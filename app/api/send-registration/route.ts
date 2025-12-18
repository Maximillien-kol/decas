import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '@/lib/email';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const telephone = formData.get('telephone') as string;
    const paymentScreenshot = formData.get('paymentScreenshot') as File;

    // Validate required fields
    if (!firstName || !lastName || !email || !telephone || !paymentScreenshot) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Convert payment screenshot to buffer for email attachment
    const paymentBuffer = Buffer.from(await paymentScreenshot.arrayBuffer());

    // Generate unique registration data
    const registrationData = {
      firstName,
      lastName,
      email,
      telephone,
      registrationId: `DECAS-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`,
      timestamp: new Date().toISOString(),
    };

    // Prepare attachments for user email (removed QR code - sent manually)
    const userAttachments: Array<{
      filename: string;
      content: Buffer;
      contentType: string;
    }> = [];

    // Prepare attachments for admin email (payment screenshot)
    const adminAttachments = [
      {
        filename: paymentScreenshot.name,
        content: paymentBuffer,
        contentType: paymentScreenshot.type,
      },
    ];

    // Generate email content
    const userEmail = emailTemplates.registration({
      firstName,
      lastName,
      email,
      telephone,
    });

    const adminEmail = emailTemplates.adminNotification({
      firstName,
      lastName,
      email,
      telephone,
      timestamp: new Date().toLocaleString(),
    });

    // Send email to user (no attachments - QR code sent manually)
    const userEmailResult = await sendEmail(
      email,
      userEmail.subject,
      userEmail.html,
      userEmail.text
    );

    // Send notification to admin (with payment screenshot attachment)
    const adminEmailResult = await sendEmail(
      process.env.ADMIN_EMAIL || process.env.SMTP_USER || '',
      adminEmail.subject,
      adminEmail.html,
      adminEmail.text,
      adminAttachments
    );

    if (userEmailResult.success && adminEmailResult.success) {
      // Save guest to Supabase
      if (supabase) {
        try {
          const { error: dbError } = await supabase
            .from('guests')
            .insert([
              {
                first_name: firstName,
                last_name: lastName,
                email: email,
                telephone: telephone,
                registration_id: registrationData.registrationId,
                timestamp: registrationData.timestamp,
                status: 'pending',
              },
            ]);

          if (dbError) {
            console.error('Error saving to Supabase:', dbError);
          }
        } catch (dbError) {
          console.error('Supabase error:', dbError);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Registration emails sent successfully',
        guestData: registrationData, // Return guest data for client-side storage
      });
    } else {
      return NextResponse.json(
        {
          error: 'Failed to send emails',
          details: {
            userEmail: userEmailResult.success,
            adminEmail: adminEmailResult.success,
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in send-registration API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
