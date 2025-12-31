import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import connectDB from "./db/config.js";
import Project from "./db/Project.js";
// import Experience from "./db/Experience.js"; // You'll need to create this model

const app = express();
const PORT = process.env.PORT || 5000;




app.use(cors({
  origin: [
    'https://simmerjit.vercel.app',
    'http://localhost:5173'
  ]
}));

app.use(express.json());

connectDB();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "9f0e45001@smtp-brevo.com",
    pass: "aSm1PrNkhyscqFfZ",
  },
});


// Existing project routes
app.post('/upload/project', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/project', async (req, res) => {
  try {
    const project = await Project.find();
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Contact form route with Nodemailer
app.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Please provide name, email, and message' 
      });
    }

    // Email to you (receiving the message)
    const mailToYou = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Your email to receive messages
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background-color: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
              ${message}
            </div>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            Sent from your portfolio website contact form
          </p>
        </div>
      `,
    };

    // Auto-reply email to the sender
    const autoReply = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for reaching out! - Simmerjit Singh Sethi",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Message Received Successfully</p>
          </div>
          
          <div style="padding: 30px 20px; background-color: white;">
            <h2 style="color: #333; margin-top: 0;">Hi ${name}! 👋</h2>
            
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for reaching out through my portfolio website! I've received your message and I'm excited to connect with you.
            </p>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2; font-weight: 500;">
                <strong>What's Next?</strong>
              </p>
              <p style="margin: 10px 0 0 0; color: #555;">
                I'll review your message and get back to you within 24-48 hours. In the meantime, feel free to check out my projects and connect with me on social media!
              </p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              <strong>Your message:</strong><br>
              <em style="color: #777;">"${message}"</em>
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://www.linkedin.com/in/simmerjit/" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: 500; margin: 0 10px;">
                Connect on LinkedIn
              </a>
              <a href="https://github.com/simmerjit" style="display: inline-block; background: #24292e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: 500; margin: 0 10px;">
                View GitHub
              </a>
            </div>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center;">
            <p style="color: #777; margin: 0; font-size: 14px;">
              Best regards,<br>
              <strong>Simmerjit Singh Sethi</strong><br>
              Full Stack Developer
            </p>
            <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
              This is an automated response. Please don't reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(mailToYou),
      transporter.sendMail(autoReply)
    ]);

    console.log(`📧 Contact form submission from: ${name} (${email})`);
    
    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! You should receive a confirmation email shortly.' 
    });

  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({ 
      error: 'Failed to send message. Please try again later.' 
    });
  }
});




// Experience routes (you'll need to create Experience model)
/*
app.post('/upload/experience', async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/experience", async (req, res) => {
  try {
    const experience = await Experience.find();
    res.json(experience);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
*/

app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
