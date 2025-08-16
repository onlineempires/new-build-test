import { Expert, Booking, TimeSlot } from '../api/experts';

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface BookingConfirmationData {
  booking: Booking;
  expert: Expert;
  timeSlot: TimeSlot;
  customerEmail: string;
  customerName: string;
}

class EmailService {
  private apiKey: string | null = null;
  
  constructor() {
    // In production, this would be loaded from environment variables
    this.apiKey = process.env.SENDGRID_API_KEY || null;
  }

  /**
   * Sends booking confirmation email to customer
   */
  async sendBookingConfirmation(data: BookingConfirmationData): Promise<boolean> {
    try {
      const template = this.generateBookingConfirmationEmail(data);
      
      // In development, simulate email sending
      if (!this.apiKey) {
        console.log('📧 EMAIL SIMULATION - Booking Confirmation');
        console.log('To:', template.to);
        console.log('Subject:', template.subject);
        console.log('HTML Content:\n', template.html);
        console.log('Text Content:\n', template.text);
        console.log('✅ Email would be sent in production');
        
        // Simulate email delivery delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return true;
      }

      // In production, use your preferred email service
      // Example with SendGrid:
      // const response = await this.sendWithSendGrid(template);
      // return response.success;
      
      return await this.simulateEmailSend(template);
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      return false;
    }
  }

  /**
   * Sends booking receipt email to customer
   */
  async sendBookingReceipt(data: BookingConfirmationData): Promise<boolean> {
    try {
      const template = this.generateBookingReceiptEmail(data);
      
      // In development, simulate email sending
      if (!this.apiKey) {
        console.log('📧 EMAIL SIMULATION - Booking Receipt');
        console.log('To:', template.to);
        console.log('Subject:', template.subject);
        console.log('HTML Content:\n', template.html);
        console.log('✅ Receipt email would be sent in production');
        
        // Simulate email delivery delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return true;
      }
      
      return await this.simulateEmailSend(template);
    } catch (error) {
      console.error('Failed to send booking receipt email:', error);
      return false;
    }
  }

  /**
   * Generates booking confirmation email template
   */
  private generateBookingConfirmationEmail(data: BookingConfirmationData): EmailTemplate {
    const { booking, expert, timeSlot, customerName, customerEmail } = data;
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    const subject = `Coaching Session Confirmed with ${expert.name} - ${formatDate(timeSlot.date)}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f7fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .booking-details { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #e2e8f0; }
          .detail-label { font-weight: 600; color: #4a5568; }
          .detail-value { color: #2d3748; }
          .meeting-link { background: #667eea; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block; margin: 15px 0; font-weight: 600; }
          .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 14px; color: #718096; border-top: 1px solid #e2e8f0; }
          .expert-info { display: flex; align-items: center; margin-bottom: 20px; padding: 15px; background: #f0f4f8; border-radius: 8px; }
          .expert-avatar { width: 60px; height: 60px; border-radius: 50%; margin-right: 15px; }
          @media (max-width: 600px) {
            .detail-row { flex-direction: column; }
            .detail-label { margin-bottom: 5px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Booking Confirmed!</h1>
            <p>Your coaching session has been successfully booked</p>
          </div>
          
          <div class="content">
            <p>Hi <strong>${customerName}</strong>,</p>
            
            <p>Great news! Your 1-on-1 coaching session has been confirmed. Here are your booking details:</p>
            
            <div class="expert-info">
              <img src="${expert.avatarUrl}" alt="${expert.name}" class="expert-avatar" />
              <div>
                <h3 style="margin: 0; color: #2d3748;">${expert.name}</h3>
                <p style="margin: 5px 0; color: #718096;">${expert.title}</p>
                <p style="margin: 5px 0; color: #718096;">${expert.level}</p>
              </div>
            </div>
            
            <div class="booking-details">
              <h3 style="margin-top: 0; color: #2d3748;">Session Details</h3>
              
              <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${formatDate(timeSlot.date)}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Time:</span>
                <span class="detail-value">${timeSlot.time}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${expert.sessionDuration} minutes</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Format:</span>
                <span class="detail-value">1-on-1 Video Call</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${booking.id}</span>
              </div>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${booking.meetingLink}" class="meeting-link">
                📹 Join Meeting Link
              </a>
              <p style="font-size: 14px; color: #718096; margin-top: 10px;">
                You'll receive the actual meeting link 24 hours before your session
              </p>
            </div>
            
            <h3>What to Expect:</h3>
            <ul style="color: #4a5568;">
              <li>You'll receive a reminder email 24 hours before your session</li>
              <li>The actual meeting link will be provided closer to your session time</li>
              <li>Come prepared with specific questions or challenges you'd like to discuss</li>
              <li>Have a notepad ready to jot down key insights and action items</li>
            </ul>
            
            <h3>Need to Reschedule?</h3>
            <p style="color: #4a5568;">
              If you need to reschedule, please contact us at least 24 hours in advance. 
              Reply to this email or contact our support team.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Digital Era - Expert Coaching</strong></p>
            <p>Building success through expert guidance</p>
            <p style="font-size: 12px; margin-top: 15px;">
              This is an automated confirmation email. Please do not reply directly to this message.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Booking Confirmation - ${expert.name}

Hi ${customerName},

Your coaching session has been confirmed!

Session Details:
- Expert: ${expert.name} (${expert.title})
- Date: ${formatDate(timeSlot.date)}
- Time: ${timeSlot.time}
- Duration: ${expert.sessionDuration} minutes
- Booking ID: ${booking.id}

Meeting Link: ${booking.meetingLink}

You'll receive a reminder email 24 hours before your session with the actual meeting link.

Thank you for booking with Digital Era!
    `;

    return {
      to: customerEmail,
      subject,
      html,
      text
    };
  }

  /**
   * Generates booking receipt email template
   */
  private generateBookingReceiptEmail(data: BookingConfirmationData): EmailTemplate {
    const { booking, expert, timeSlot, customerName, customerEmail } = data;
    
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr + 'T00:00:00');
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    };

    const formatDateTime = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    const subject = `Payment Receipt - Coaching Session with ${expert.name}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f7fafc; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; padding: 30px 20px; text-align: center; }
          .content { padding: 30px 20px; }
          .receipt-details { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #48bb78; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; padding-bottom: 5px; border-bottom: 1px solid #e2e8f0; }
          .detail-label { font-weight: 600; color: #4a5568; }
          .detail-value { color: #2d3748; }
          .total-row { font-weight: bold; font-size: 18px; color: #2d3748; border-bottom: 2px solid #48bb78; padding-bottom: 10px; margin-bottom: 10px; }
          .footer { background: #f7fafc; padding: 20px; text-align: center; font-size: 14px; color: #718096; border-top: 1px solid #e2e8f0; }
          .commission-info { background: #e6fffa; border: 1px solid #81e6d9; border-radius: 8px; padding: 15px; margin: 20px 0; }
          @media (max-width: 600px) {
            .detail-row { flex-direction: column; }
            .detail-label { margin-bottom: 5px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>💳 Payment Receipt</h1>
            <p>Thank you for your payment</p>
          </div>
          
          <div class="content">
            <p>Hi <strong>${customerName}</strong>,</p>
            
            <p>This is your payment receipt for the coaching session booking. Your payment has been processed successfully.</p>
            
            <div class="receipt-details">
              <h3 style="margin-top: 0; color: #2d3748;">Payment Details</h3>
              
              <div class="detail-row">
                <span class="detail-label">Transaction Date:</span>
                <span class="detail-value">${formatDateTime(booking.createdAt)}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span class="detail-value">${booking.id}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Service:</span>
                <span class="detail-value">1-on-1 Coaching Session</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Expert:</span>
                <span class="detail-value">${expert.name}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Session Date:</span>
                <span class="detail-value">${formatDate(timeSlot.date)} at ${timeSlot.time}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${expert.sessionDuration} minutes</span>
              </div>
              
              <div class="detail-row total-row">
                <span class="detail-label">Total Paid:</span>
                <span class="detail-value">$${booking.amount.toFixed(2)}</span>
              </div>
              
              <div class="detail-row">
                <span class="detail-label">Payment Status:</span>
                <span class="detail-value" style="color: #38a169; font-weight: bold;">✓ Completed</span>
              </div>
            </div>
            
            ${booking.affiliateCommission > 0 ? `
            <div class="commission-info">
              <h4 style="margin-top: 0; color: #2d3748;">💼 Revenue Distribution</h4>
              <div style="font-size: 14px; color: #4a5568;">
                <div style="margin-bottom: 5px;">Expert receives: $${(booking.amount - booking.commission).toFixed(2)}</div>
                <div style="margin-bottom: 5px;">Platform fee: $${booking.commission.toFixed(2)}</div>
                ${booking.affiliateCommission > 0 ? `<div>Affiliate commission: $${booking.affiliateCommission.toFixed(2)}</div>` : ''}
              </div>
            </div>
            ` : ''}
            
            <h3>Important Information:</h3>
            <ul style="color: #4a5568;">
              <li>Keep this receipt for your records</li>
              <li>You will receive a separate session confirmation email</li>
              <li>Meeting details will be provided 24 hours before your session</li>
              <li>For support or questions, reply to this email</li>
            </ul>
            
            <p style="color: #4a5568;">
              <strong>Refund Policy:</strong> Cancellations made 24+ hours in advance are eligible for a full refund. 
              Cancellations within 24 hours are subject to a 50% cancellation fee.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Digital Era - Expert Coaching</strong></p>
            <p>Professional coaching services</p>
            <p style="font-size: 12px; margin-top: 15px;">
              This is an automated receipt. Please save this email for your records.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Payment Receipt - Digital Era

Hi ${customerName},

Payment Details:
- Transaction Date: ${formatDateTime(booking.createdAt)}
- Booking ID: ${booking.id}
- Service: 1-on-1 Coaching Session
- Expert: ${expert.name}
- Session: ${formatDate(timeSlot.date)} at ${timeSlot.time}
- Duration: ${expert.sessionDuration} minutes
- Total Paid: $${booking.amount.toFixed(2)}
- Status: Completed

Keep this receipt for your records. You will receive a separate session confirmation email.

Thank you for choosing Digital Era!
    `;

    return {
      to: customerEmail,
      subject,
      html,
      text
    };
  }

  /**
   * Simulates email sending for development
   */
  private async simulateEmailSend(template: EmailTemplate): Promise<boolean> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (success) {
      console.log(`✅ Email sent successfully to ${template.to}`);
      console.log(`📧 Subject: ${template.subject}`);
    } else {
      console.log(`❌ Failed to send email to ${template.to}`);
    }
    
    return success;
  }

  /**
   * Production email sending with SendGrid (example)
   */
  private async sendWithSendGrid(template: EmailTemplate): Promise<{ success: boolean; messageId?: string }> {
    try {
      // This would be the actual SendGrid implementation
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(this.apiKey);
      // 
      // const msg = {
      //   to: template.to,
      //   from: 'noreply@digitalera.com',
      //   subject: template.subject,
      //   text: template.text,
      //   html: template.html,
      // };
      // 
      // const response = await sgMail.send(msg);
      // return { success: true, messageId: response[0].headers['x-message-id'] };
      
      return { success: true };
    } catch (error) {
      console.error('SendGrid email failed:', error);
      return { success: false };
    }
  }
}

export const emailService = new EmailService();
export default emailService;