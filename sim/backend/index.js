import express from "express";
import cors from "cors";
import formData from "form-data";
import Mailgun from "mailgun.js";
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

/* -------------------- MAILGUN CLIENT -------------------- */
const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
  url:
    process.env.MAILGUN_REGION === "eu"
      ? "https://api.eu.mailgun.net"
      : "https://api.mailgun.net",
});

const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN;

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
app.post("/contact", async (req, res) => {
  console.log("➡️ /contact hit", req.body);

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Please provide name, email, and message",
      });
    }

    await mg.messages.create(MAILGUN_DOMAIN, {
      from: `Portfolio <mailgun@${MAILGUN_DOMAIN}>`,
      to: ["simmerjits3@gmail.com"], // must be authorized in sandbox
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    console.log("✅ Mailgun email sent");

    res.status(200).json({
      success: true,
      message: "Message sent successfully!",
    });

  } catch (error) {
    console.error("❌ MAILGUN ERROR:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

/* -------------------- SERVER -------------------- */
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
