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

/* -------------------- GMAIL NODEMAILER -------------------- */
/*
IMPORTANT:
EMAIL_USER = your gmail address
EMAIL_PASS = 16-character Gmail APP PASSWORD (not normal password)
*/

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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

/* -------------------- CONTACT ROUTE (GMAIL SAFE) -------------------- */
app.post("/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Please provide name, email, and message",
      });
    }

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,   // ONLY send to yourself
      replyTo: email,               // user email goes here
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("❌ Gmail error:", error);
    res.status(500).json({
      error: "Failed to send message",
    });
  }
});

/* -------------------- SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
