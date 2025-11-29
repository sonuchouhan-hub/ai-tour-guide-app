import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // your React app
  })
);

// Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple health route so browser GET / works
app.get("/", (req, res) => {
  res.send("✅ Groq AI Trip Planner backend is running");
});

// Main AI Trip Planner route
app.post("/api/trips", async (req, res) => {
  try {
    const { city, days, budget, travelers, interests, stayType } = req.body;

    if (!city || !days || !budget) {
      return res.status(400).json({
        error: "City, days, and budget are required.",
      });
    }

    const prompt = `
You are an Expert AI Travel Planner. Create an extremely detailed, hyper-realistic, time-wise, distance-wise, cost-wise trip plan.

--------------------------------------
USER INPUT:
City: ${city}
Days: ${days}
Total Budget: ₹${budget}
Travellers: ${travelers}
Interests: ${interests}
Stay Type: ${stayType}

--------------------------------------
STRICT OUTPUT REQUIREMENTS:

1) TRIP SUMMARY
...

Generate a PERFECT, HUMAN-LIKE trip plan.
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

// Start server – listen on localhost:5000
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Groq AI Backend running on port ${PORT}`);
});
