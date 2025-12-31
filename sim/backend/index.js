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
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Please provide name, email, and message",
      });
    }

    /* ---------------- EMAIL TO YOU ---------------- */
    await transporter.sendMail({
      from: "Portfolio <simmerjits3@gmail.com>", // ✅ fixed sender
      to: "simmerjits3@gmail.com",
      replyTo: email,
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
    });

    /* ---------------- AUTO-REPLY (SAFE) ---------------- */
    await transporter.sendMail({
      from: "Portfolio <simmerjits3@gmail.com>", // ✅ same verified sender
      to: email,
      subject: "Thank you for reaching out! - Simmerjit Singh Sethi",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Thank You!</h1>
            <p style="color: white; opacity: 0.9;">Message Received Successfully</p>
          </div>

          <div style="padding: 30px 20px; background-color: white;">
            <h2>Hi ${name}! 👋</h2>

            <p>
              Thank you for reaching out through my portfolio website!
              I've received your message and will get back to you within
              24–48 hours.
            </p>

            <p><strong>Your message:</strong></p>
            <em>"${message}"</em>

            <p style="margin-top: 30px;">
              Best regards,<br>
              <strong>Simmerjit Singh Sethi</strong><br>
              Full Stack Developer
            </p>
          </div>

          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px;">
            This is an automated response. Please don’t reply to this email.
          </div>
        </div>
      `,
    });

    console.log(`📧 Contact form submission from ${name} (${email})`);

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("❌ Brevo email error:", error);
    res.status(500).json({
      error: "Failed to send message. Please try again later.",
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
