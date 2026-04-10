import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Sparkles, Zap } from "lucide-react";
import axios from "axios";
import { AI_API_END_POINT } from "../utils/constant";

const suggestions = [
  "Find React jobs in Bangalore",
  "How to improve my resume?",
  "Top companies hiring now",
  "Jobs with ₹20+ LPA",
];


const AIChatButton = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! I'm your AI career assistant. Ask me anything about jobs, resumes, or career advice! 🚀" },
  ]);
  // Keep a parallel array of {role, content} for the API
  const historyRef = useRef([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInput("");
    setTyping(true);

    // Build history for API
    const updatedHistory = [...historyRef.current, { role: "user", content: msg }];
    historyRef.current = updatedHistory;

    try {
      const { data } = await axios.post(`${AI_API_END_POINT}/chat`, {
        messages: updatedHistory,
      });
      const reply = data.reply || "Sorry, I couldn't get a response. Please try again.";
      historyRef.current = [...updatedHistory, { role: "assistant", content: reply }];
      setMessages((prev) => [...prev, { from: "ai", text: reply }]);
    } catch {
      const errMsg = "Oops! Something went wrong. Please try again.";
      setMessages((prev) => [...prev, { from: "ai", text: errMsg }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* ── Chat panel ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-[88px] right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[340px] rounded-2xl overflow-hidden flex flex-col"
            style={{
              height: 460,
              background: "rgba(8,14,32,0.96)",
              backdropFilter: "blur(28px)",
              border: "1px solid rgba(39,187,210,0.22)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), 0 0 60px rgba(39,187,210,0.1)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3.5 shrink-0"
              style={{ background: "linear-gradient(90deg,#27bbd2,#6366f1)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="p-2 rounded-xl bg-white/20">
                    <Bot size={16} className="text-white" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[#34d399] border-2 border-[#27bbd2]" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm leading-tight">CareerNest AI</p>
                  <p className="text-white/60 text-xs">Always online · Instant answers</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, background: "rgba(255,255,255,0.25)" }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg bg-white/15 text-white transition-colors"
              >
                <X size={14} />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.22 }}
                  className={`flex items-end gap-2 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "ai" && (
                    <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0 mb-0.5"
                      style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                      <Sparkles size={10} className="text-white" />
                    </div>
                  )}
                  <div
                    className="max-w-[82%] px-3.5 py-2.5 text-xs leading-relaxed"
                    style={
                      msg.from === "user"
                        ? { background: "linear-gradient(135deg,#27bbd2,#6366f1)", color: "white", borderRadius: "16px 16px 4px 16px" }
                        : { background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.82)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px 16px 16px 4px" }
                    }
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {typing && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="flex items-end gap-2"
                  >
                    <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}>
                      <Sparkles size={10} className="text-white" />
                    </div>
                    <div className="px-4 py-3 rounded-2xl flex items-center gap-1"
                      style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="h-1.5 w-1.5 rounded-full bg-[#67e8f9] block"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {messages.length <= 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0"
                >
                  {suggestions.map((s) => (
                    <motion.button
                      key={s}
                      whileHover={{ scale: 1.03, borderColor: "rgba(39,187,210,0.5)" }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full transition-all"
                      style={{ background: "rgba(39,187,210,0.08)", color: "#67e8f9", border: "1px solid rgba(39,187,210,0.2)" }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div
              className="flex items-center gap-2 px-3 py-3 shrink-0"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent outline-none text-xs text-white placeholder:text-white/25 py-1"
              />
              <motion.button
                whileHover={{ scale: 1.12, boxShadow: "0 0 16px rgba(39,187,210,0.5)" }}
                whileTap={{ scale: 0.88 }}
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="p-2.5 rounded-xl transition-opacity"
                style={{
                  background: "linear-gradient(135deg,#27bbd2,#6366f1)",
                  opacity: input.trim() ? 1 : 0.4,
                }}
              >
                <Send size={13} className="text-white" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FAB ── */}
      <div className="fixed bottom-5 right-5 z-50">
        {/* Outer glow ring */}
        {!open && (
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.35, 0, 0.35] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{ background: "linear-gradient(135deg,#27bbd2,#6366f1)" }}
          />
        )}

        <motion.button
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative h-14 w-14 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg,#27bbd2,#6366f1)",
            boxShadow: open
              ? "0 8px 32px rgba(99,102,241,0.5)"
              : "0 8px 32px rgba(39,187,210,0.45), 0 0 0 1px rgba(255,255,255,0.1)",
          }}
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.div key="x"
                initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22 }}
              >
                <X size={20} className="text-white" />
              </motion.div>
            ) : (
              <motion.div key="bot"
                initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.22 }}
              >
                <Bot size={20} className="text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ opacity: 0, x: 8, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.9 }}
              transition={{ delay: 1.5, duration: 0.3 }}
              className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold text-white pointer-events-none"
              style={{ background: "rgba(8,14,32,0.9)", border: "1px solid rgba(39,187,210,0.25)", backdropFilter: "blur(12px)" }}
            >
              <Zap size={10} className="inline mr-1 text-[#67e8f9]" />
              AI Career Assistant
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AIChatButton;
