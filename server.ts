import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lazy GoogleGenAI client
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `You are ProAge Atlas AI — the Longevity & Epigenetic Biomarker Intelligence Copilot.
You specialize in:
1. Epigenetic clocks (DunedinPACE, Horvath clock, PhenoAge, GrimAge DNA methylation).
2. Hallmarks of Aging (cellular senescence, mitochondrial bioenergetics, telomere attrition, genomic instability, proteostasis).
3. Evidence-based interventions (NAD+ precursors like NMN/NR, Senolytics like Fisetin, Metformin/SGLT2i research, Rapamycin mTOR inhibition, Heat/Cold hormesis, VO2 Max optimization, deep sleep architectures).
4. ProAge Atlas platform technology, multi-omics biomarker kits, and investment thesis ($640B Longevity TAM, B2B2C business model, clinical grade accuracy).

Provide rigorous, scientific yet clear and inspiring answers. If the user asks in Russian, reply in Russian. If in English, reply in English. Format with clean bullet points and bold key biomarkers.`;

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    model: "gemini-3.8-flash",
    timestamp: new Date().toISOString(),
  });
});

// Gemini Longevity Copilot Chat API
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message string is required" });
    }

    const ai = getGenAI();

    if (!ai) {
      // Intelligent fallback if no API key is set yet
      const isRussian = /[а-яё]/i.test(message);
      let reply = "";
      if (isRussian) {
        reply = `**[ProAge Clinical Intelligence]**\n\nАнализ запроса: *"${message}"*\n\n1. **Эпигенетический статус:** Регулярный мониторинг ДНК-метилирования (часы GrimAge и алгоритм DunedinPACE) позволяет зафиксировать замедление биологического темпа старения до **0.78–0.82 года** за календарный год.\n\n2. **Рекомендуемые интервенции:**\n• **Митохондриальный каскад:** Бустинг пула NAD+ (500–1000 мг NMN/NR сублингвально в утренний циркадный пик).\n• **Очистка сенесцентных клеток:** Флавоноидные сенолитики (Физетин 20 мг/кг курсами по протоколу Mayo Clinic).\n• **Метаболическая гибкость:** Зона 2 кардио (3-4 часа в неделю) для роста плотности крист митохондрий.\n\n*Для детального персонализированного протокола подключите ключ Gemini API в панели Settings.*`;
      } else {
        reply = `**[ProAge Clinical Intelligence]**\n\nQuery analysis: *"${message}"*\n\n1. **Epigenetic Biomarker Vector:** Measuring 850k+ CpG methylation sites via DunedinPACE tracks aging pace down to **0.76–0.80 years** per calendar year.\n\n2. **Evidence-Based Protocol Recommendations:**\n• **Mitochondrial Homeostasis:** Intracellular NAD+ elevation via NMN/NR (600–1000 mg/day).\n• **Senescent Cell Clearance:** Intermittent high-dose Fisetin senolytic pulse protocol.\n• **Vascular Elasticity:** Endothelial nitric oxide synthase activation via Zone 2 aerobic base.\n\n*Configure your Gemini API key in Settings > Secrets for real-time live synthesis.*`;
      }
      return res.json({ reply, source: "proage-knowledge-base" });
    }

    // Build chat contents from history + current message
    const formattedContents = [];
    for (const item of history.slice(-6)) {
      formattedContents.push({
        role: item.role === "user" ? "user" : "model",
        parts: [{ text: item.content || item.text || "" }],
      });
    }
    formattedContents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: formattedContents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const reply = response.text || "No response generated";
    res.json({ reply, source: "gemini-3.8-flash" });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      details: error?.message || "Unknown error",
    });
  }
});

// Vite middleware & Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
