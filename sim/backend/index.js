import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import nodemailer from "nodemailer";
import connectDB from "./db/config.js";
import Project from "./db/Project.js";

const app = express();
const PORT = process.env.PORT || 5000;

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors({
  origin: [
    "https://simmerjit.vercel.app",
    "http://localhost:5173",
  ],
}));

app.use(express.json());

/* -------------------- DB -------------------- */
connectDB();

/* -------------------- BREVO SMTP -------------------- */
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER, // e.g. 9f0e45001@smtp-brevo.com
    pass: process.env.BREVO_PASS, // Brevo SMTP key
  },
});

/* -------------------- ROUTES -------------------- */

/* PROJECT ROUTES */
app.post("/upload/project", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/project", async (req, res) => {
  try {
    const project = await Project.find();
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* -------------------- CONTACT ROUTE -------------------- */
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Please provide name, email, and message",
      });
    }

    /* ---------- EMAIL TO YOU ---------- */
    await transporter.sendMail({
      from: "Portfolio <simmerjits3@gmail.com>", // MUST be verified in Brevo
      to: "simmerjits3@gmail.com",
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="border-bottom: 2px solid #007bff;">New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    /* ---------- AUTO-REPLY (SAFE, NON-BLOCKING) ---------- */
    try {
      await transporter.sendMail({
        from: "Portfolio <simmerjits3@gmail.com>",
        to: email,
        subject: "Thank you for reaching out!",
        html: `
          <p>Hi ${name},</p>
          <p>Thank you for contacting me. I’ve received your message and will get back to you within 24–48 hours.</p>
          <p><strong>Your message:</strong></p>
          <em>"${message}"</em>
          <p><br>Best regards,<br><strong>Simmerjit Singh Sethi</strong></p>
        `,
      });
    } catch (autoErr) {
      console.warn("⚠️ Auto-reply failed:", autoErr.message);
      // IMPORTANT: we do NOT fail the request if auto-reply fails
    }

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

/* -------------------- SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
