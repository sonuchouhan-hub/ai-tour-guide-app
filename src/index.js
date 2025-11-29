import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Allowed frontend URLs (local + Render deployed)
const allowedOrigins = [
  "http://localhost:5173",
  "https://ai-tour-guide-frontend-o73i.onrender.com" // <-- put YOUR actual frontend URL
];

// ✅ CORS Middleware (Fixes “Failed to fetch”)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server/test tools
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
  })
);

// Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple test route
app.get("/", (req, res) => {
  res.send("✅ Groq AI Trip Planner backend is running");
});

// Main Trip Planner route
app.post("/api/trips", async (req, res) => {
  try {
    const { city, days, budget, travelers, interests, stayType } = req.body;

    if (!city || !days || !budget) {
      return res.status(400).json({
        error: "City, days, and budget are required.",
      });
    }

    const prompt = `
You are an Expert AI Travel Planner. Create an extremely detailed trip plan.

City: ${city}
Days: ${days}
Budget: ₹${budget}
Travellers: ${travelers}
Interests: ${interests}
Stay Type: ${stayType}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    return res.json({
      success: true,
      plan: completion.choices[0].message.content,
    });
  } catch (err) {
    console.error("❌ Backend Error:", err);
    return res.status(500).json({
      error: "Trip generation failed. " + err.toString(),
    });
  }
});

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Groq AI Backend running on port ${PORT}`);
});
