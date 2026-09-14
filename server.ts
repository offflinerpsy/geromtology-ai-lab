import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { "User-Agent": "proage-atlas-research" } },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are the ProAge Atlas research assistant for an early-stage healthy-aging research software prototype.

Your job is to help with literature organization, method comparison, structured evidence extraction and research-workflow questions. Keep claims source-grounded and distinguish published findings from hypotheses, synthetic examples and unreviewed development fixtures.

Important boundaries:
- Do not present ProAge Atlas as clinically validated, diagnostic, treatment-providing, or proven to extend lifespan or healthspan.
- Do not invent funding, valuation, certifications, patient cohorts, partnerships, clinical outcomes or model performance.
- Do not give personalized medical treatment or supplement dosing advice. For medical decisions, recommend consulting a qualified clinician.
- When evidence is uncertain or source context is missing, say so clearly.
- Prefer concise, auditable answers that identify what should be checked in the primary source.`;

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    product: "ProAge Atlas",
    stage: "research-prototype",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body ?? {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required" });
    }

    const ai = getGenAI();
    if (!ai) {
      return res.json({
        reply:
          "The research assistant is not connected to a model in this deployment. The public prototype remains available as a source-linked, synthetic-data demonstration.",
        source: "prototype-fallback",
      });
    }

    const formattedContents = [];
    for (const item of Array.isArray(history) ? history.slice(-6) : []) {
      formattedContents.push({
        role: item?.role === "user" ? "user" : "model",
        parts: [{ text: String(item?.content || item?.text || "") }],
      });
    }
    formattedContents.push({ role: "user", parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.25,
      },
    });

    res.json({
      reply: response.text || "No response generated.",
      source: "gemini-3.8-flash",
    });
  } catch (error: any) {
    console.error("Research assistant API error:", error);
    res.status(500).json({
      error: "Failed to generate a research response",
      details: error?.message || "Unknown error",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ProAge Atlas server running on port ${PORT}`);
  });
}

startServer();
