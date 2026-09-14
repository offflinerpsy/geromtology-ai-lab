import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bot,
  Sparkles,
  RefreshCw,
  Dna,
  ShieldCheck,
  ChevronDown,
  User,
} from "lucide-react";
import { ChatMessage } from "../types";
import { luxuryEase } from "../utils/motion";

interface LongevityCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt?: string | null;
}

export const LongevityCopilot: React.FC<LongevityCopilotProps> = ({
  isOpen,
  onClose,
  initialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "model",
      text: "Здравствуйте! Я Longevity AI Copilot платформы ProAge Atlas. Я специализируюсь на эпигенетических часах (DunedinPACE, GrimAge, Horvath), митохондриальном здоровье, сенолитиках и клинических протоколах омоложения. Чем могу помочь вам сегодня?",
      timestamp: "Just now",
      source: "proage-knowledge-base",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle external initial prompt injection
  useEffect(() => {
    if (initialPrompt && isOpen) {
      sendMessage(initialPrompt);
    }
  }, [initialPrompt, isOpen]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "ru-RU"; // Default to RU with fallback

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          if (transcript) {
            setInputText(transcript);
            sendMessage(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Voice synthesis readout
  const speakText = (text: string) => {
    if (!speechEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Clean markdown tags for voice readout
      const cleanText = text.replace(/[*_#`[\]()]/g, " ").slice(0, 320);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Голосовой ввод не поддерживается данным браузером.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      stopSpeaking();
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  const sendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);
    stopSpeaking();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: messages.map((m) => ({
            role: m.role,
            content: m.text,
          })),
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "Не удалось получить ответ.";

      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        source: data.source,
      };

      setMessages((prev) => [...prev, modelMsg]);

      if (speechEnabled) {
        speakText(replyText);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: "Произошла ошибка при соединении с сервером Gemini API. Пожалуйста, попробуйте еще раз.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "Как снизить темп старения DunedinPACE ниже 0.80?",
    "Какова схема приема сенолитиков по протоколу клиники Mayo?",
    "Каковы инвестиционные метрики и юнит-экономика ProAge?",
    "В чем разница между часами Horvath и GrimAge v2?",
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, x: 380 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 380 }}
          transition={{ duration: 0.35, ease: luxuryEase }}
          className="w-full max-w-lg bg-[#FAF9F5] h-full shadow-2xl flex flex-col border-l border-[#E2E0D8]"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#E2E0D8] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#064E3B] to-[#10B981] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-5 h-5 text-emerald-100" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-[#141716] font-editorial">
                    ProAge Longevity Copilot
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Gemini 3.8
                  </span>
                </div>
                <span className="text-xs text-[#6A6860]">
                  Epigenetic & Biomarker Clinical Intelligence
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (isSpeaking) stopSpeaking();
                  setSpeechEnabled(!speechEnabled);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  speechEnabled ? "text-emerald-700 bg-emerald-50" : "text-gray-400 hover:bg-gray-100"
                }`}
                title={speechEnabled ? "Voice Output Active" : "Voice Output Muted"}
              >
                {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={() => {
                  stopSpeaking();
                  onClose();
                }}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-4 py-2.5 bg-[#F4F2EB] border-b border-[#E2E0D8] overflow-x-auto whitespace-nowrap flex gap-2 text-xs">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(q)}
                className="px-3 py-1.5 rounded-full bg-white text-[#141716] hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 border border-[#E2E0D8] transition-all shrink-0 text-left"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.role === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 ${
                      isUser
                        ? "bg-[#141716] text-[#FAF9F5] rounded-tr-xs"
                        : "bg-white text-[#141716] border border-[#E2E0D8] rounded-tl-xs shadow-2xs"
                    }`}
                  >
                    <div className="whitespace-pre-line break-words">{msg.text}</div>
                    <div
                      className={`text-[10px] font-mono flex items-center justify-between gap-2 pt-1 border-t ${
                        isUser ? "border-white/10 text-gray-400" : "border-gray-100 text-[#7A7870]"
                      }`}
                    >
                      <span>{msg.timestamp}</span>
                      {!isUser && msg.source && (
                        <span className="text-emerald-700">Source: {msg.source}</span>
                      )}
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-lg bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-[#6A6860]">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex items-center gap-2 bg-white px-3.5 py-2.5 rounded-2xl border border-[#E2E0D8]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-200" />
                  <span className="text-xs font-mono ml-1">Analyzing biological markers...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Audio Indicator when reading */}
          {isSpeaking && (
            <div className="px-4 py-1.5 bg-emerald-50 border-t border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Voice Copilot speaking...
              </span>
              <button
                onClick={stopSpeaking}
                className="text-[11px] font-semibold text-emerald-900 underline"
              >
                Stop
              </button>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#E2E0D8] space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <textarea
                  rows={2}
                  placeholder={
                    isListening
                      ? "Слушаю ваш голос..."
                      : "Задайте вопрос о биологическом возрасте, протоколах или инвестициях..."
                  }
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="w-full resize-none p-3 text-xs rounded-xl bg-[#FAF9F5] border border-[#E2E0D8] text-[#141716] placeholder-[#8A8880] focus:outline-emerald-600 focus:bg-white"
                />
              </div>

              {/* Speech Recognition Button */}
              <button
                onClick={toggleListening}
                className={`p-3 rounded-xl border transition-all ${
                  isListening
                    ? "bg-red-500 text-white border-red-600 animate-pulse"
                    : "bg-[#FAF9F5] text-[#525048] hover:text-[#141716] border-[#E2E0D8] hover:bg-[#F2EFE8]"
                }`}
                title={isListening ? "Остановить запись" : "Голосовой ввод"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Submit Button */}
              <button
                onClick={() => sendMessage()}
                disabled={!inputText.trim() || isLoading}
                className="p-3 rounded-xl bg-[#141716] text-white hover:bg-[#252827] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-[10px] text-[#7A7870] font-mono px-1">
              <span>Press Enter to send • Russian & English</span>
              <span>Gemini 3.8 Flash Engine</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
