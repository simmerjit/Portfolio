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

/* -------------------- NODEMAILER (GMAIL) -------------------- */
// Add detailed connection logging
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Enable debug output
  logger: true, // Log to console
});

// Better verification
transporter.verify((err, success) => {
  if (err) {
    console.error("❌ SMTP Connection Failed");
    console.error("Error:", err.message);
    console.error("Code:", err.code);
    console.error("EMAIL_USER set?", !!process.env.EMAIL_USER);
    console.error("EMAIL_PASS set?", !!process.env.EMAIL_PASS);
  } else {
    console.log("✅ SMTP Ready:", success);
  }
});
/* -------------------- PROJECT ROUTES -------------------- */
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
app.get("/test-email", async (req, res) => {
  try {
    console.log("Testing email configuration...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");
    
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email from Render",
      text: "If you receive this, email is working!",
    });
    
    res.json({ 
      success: true, 
      message: "Test email sent!",
      messageId: info.messageId 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      code: error.code 
    });
  }
});


app.post("/contact", async (req, res) => {
  console.log("➡️ /contact hit", req.body);

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Please provide name, email, and message",
      });
    }

    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>New Contact Form Submission</h2>
          <p><b>Name:</b> ${name}</p>
          <p><b>Email:</b> ${email}</p>
          <p><b>Message:</b></p>
          <p>${message}</p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("❌ Nodemailer error:", error);
    res.status(500).json({
      error: "Failed to send message",
    });
  }
});

/* -------------------- SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
