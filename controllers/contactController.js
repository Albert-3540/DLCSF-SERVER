// This will be for storing contact messages
import { Contact } from '../models/Contact.js';
import { sendEmail } from '../services/emailService.js';

// @desc    Send contact message
// @route   POST /api/contact/send
export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Save to database
    const contact = await Contact.create({
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      status: 'unread'
    });

    // Send email notification (optional)
    try {
      await sendEmail({
        to: 'info@dlgccp.org',
        subject: `New Contact Message: ${subject || 'General Inquiry'}`,
        html: `
          <h2>New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
};