import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';
import config from '../config/env.js';

// ============================================================
// PUBLIC CONTROLLERS
// ============================================================

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
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

    // Send email notification (try, but don't fail if it doesn't work)
    try {
      await sendContactEmail(name, email, subject, message);
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
      // Don't fail the request if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again.'
    });
  }
};

// ============================================================
// ADMIN CONTROLLERS
// ============================================================

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Admin only
export const getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    // Build filter
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { message: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Contact.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contacts'
    });
  }
};

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Admin only
export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Mark as read if it was unread
    if (contact.status === 'unread') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact message'
    });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Admin only
export const updateContactStatus = async (req, res) => {
  try {
    const { status, reply } = req.body;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    // Update status
    contact.status = status;
    
    // If replied, set replied date and reply message
    if (status === 'replied') {
      contact.repliedAt = Date.now();
      if (reply) {
        contact.reply = reply;
      }
    }

    await contact.save();

    res.status(200).json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact status'
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Admin only
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contact message deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact message'
    });
  }
};

// @desc    Get contact statistics
// @route   GET /api/contact/stats
// @access  Admin only
export const getContactStats = async (req, res) => {
  try {
    const [total, unread, read, replied, recent] = await Promise.all([
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'unread' }),
      Contact.countDocuments({ status: 'read' }),
      Contact.countDocuments({ status: 'replied' }),
      Contact.find().sort({ createdAt: -1 }).limit(5)
    ]);

    // Get today's count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Contact.countDocuments({
      createdAt: { $gte: today }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        unread,
        read,
        replied,
        today: todayCount,
        recent
      }
    });
  } catch (error) {
    console.error('Get contact stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Send email notification
const sendContactEmail = async (name, email, subject, message) => {
  // Only send if email configuration exists
  if (!config.email.user || !config.email.pass) {
    console.log('Email not configured. Skipping email notification.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.port === 465,
    auth: {
      user: config.email.user,
      pass: config.email.pass,
    },
  });

  const mailOptions = {
    from: `"DLCSF Contact" <${config.email.user}>`,
    to: config.email.user,
    subject: `New Contact Message: ${subject || 'General Inquiry'}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a365d; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #1a365d; }
          .message-box { background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #1a365d; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>📬 New Contact Message</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">👤 Name:</span> ${name}
            </div>
            <div class="field">
              <span class="label">📧 Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            <div class="field">
              <span class="label">📝 Subject:</span> ${subject || 'General Inquiry'}
            </div>
            <div class="field">
              <span class="label">💬 Message:</span>
              <div class="message-box">${message}</div>
            </div>
          </div>
          <div class="footer">
            <p>This message was sent from the DLCSF Global website contact form.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};