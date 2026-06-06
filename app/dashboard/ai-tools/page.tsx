"use client";
import { useState, useRef, useEffect } from "react";
import { chatWithAI, analyzeSentiment, SentimentResult, ChatMessage } from "@/lib/aiFeatures";

export default function AIToolsPage() {
  const [activeTab, setActiveTab] = useState<"chatbot" | "sentiment" | "voice">("chatbot");

  // Chatbot state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! 👋 I'm your AI HR Assistant. I can help you with leave policies, payroll queries, appraisals, WFH policies, health insurance, and more. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sentiment state
  const [sentimentText, setSentimentText] = useState("");
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  // Voice state
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceThinking, setVoiceThinking] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [voiceResponse, setVoiceResponse] = useState("");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);
    const response = await chatWithAI(chatInput, messages);
    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: response,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, aiMsg]);
    setChatLoading(false);
  };

  const runSentiment = async () => {
    if (!sentimentText.trim()) return;
    setSentimentLoading(true);
    setSentimentResult(null);
    const result = await analyzeSentiment(sentimentText);
    setSentimentResult(result);
    setSentimentLoading(false);
  };

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis && (window.SpeechSynthesisUtterance || (window as any).webkitSpeechSynthesisUtterance)) {
      window.speechSynthesis.cancel();
      const UtteranceClass = window.SpeechSynthesisUtterance || (window as any).webkitSpeechSynthesisUtterance;
      const utterance = new UtteranceClass(text);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceDemo = () => {
    const SpeechRecognition = typeof window !== "undefined" ? ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition) : null;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setVoiceRecording(true);
        setVoiceTranscript("Listening... Speak now.");
        setVoiceResponse("");
      };

      recognition.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setVoiceTranscript(text);
        setVoiceRecording(false);
        setVoiceThinking(true);
        setVoiceResponse("");
        try {
          const reply = await chatWithAI(text, []);
          setVoiceResponse(reply);
          speak(reply);
        } catch (e) {
          setVoiceResponse("Sorry, I could not process your request. Please try again.");
        } finally {
          setVoiceThinking(false);
        }
      };

      recognition.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setVoiceRecording(false);
        setVoiceTranscript("Error capturing voice. Please check mic permissions.");
      };

      recognition.onend = () => {
        setVoiceRecording(false);
      };

      recognition.start();
    } else {
      runVoiceSimulation();
    }
  };

  const runVoiceSimulation = async () => {
    setVoiceRecording(true);
    setVoiceTranscript("");
    setVoiceResponse("");
    setVoiceThinking(false);
    await new Promise(r => setTimeout(r, 2000));
    const transcript = "What is the leave policy for sick leaves at FWC IT Services?";
    setVoiceTranscript(transcript);
    setVoiceRecording(false);
    setVoiceThinking(true);
    try {
      const response = await chatWithAI(transcript, []);
      setVoiceResponse(response);
      speak(response);
    } catch (e) {
      setVoiceResponse("Sorry, I could not process your request. Please try again.");
    } finally {
      setVoiceThinking(false);
    }
  };

  const SENTIMENT_COLORS: Record<string, string> = {
    Positive: "#10b981",
    Neutral: "#f59e0b",
    Negative: "#ef4444",
  };

  const QUICK_PROMPTS = [
    "What is the leave policy?",
    "How is salary calculated?",
    "How to apply for WFH?",
    "When is appraisal?",
    "What are office hours?",
    "How to claim health insurance?",
  ];

  return (
    <div className="animate-fade-in">
      <div className="section-header">
        <div>
          <div className="section-title">AI Tools Suite</div>
          <div className="section-subtitle">Powered by FWC AI Engine – Intelligent HR Automation</div>
        </div>
        <span className="badge badge-success" style={{ padding: "8px 16px", fontSize: 13 }}>🤖 AI Online</span>
      </div>

      {/* AI Feature Cards */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        {[
          { icon: "💬", title: "HR Chatbot", desc: "Natural language HR queries", color: "#6366f1", tab: "chatbot" },
          { icon: "🧠", title: "Sentiment Analyzer", desc: "Employee feedback analysis", color: "#10b981", tab: "sentiment" },
          { icon: "🎙️", title: "Voice Assistant", desc: "Voice-powered HR interaction", color: "#f59e0b", tab: "voice" },
        ].map(tool => (
          <div
            key={tool.tab}
            className="glass-card"
            onClick={() => setActiveTab(tool.tab as any)}
            style={{
              padding: 20, cursor: "pointer", transition: "all 0.2s",
              border: activeTab === tool.tab ? `1px solid ${tool.color}60` : "1px solid var(--glass-border)",
              background: activeTab === tool.tab ? `${tool.color}12` : "var(--glass)",
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>{tool.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{tool.title}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{tool.desc}</div>
            {activeTab === tool.tab && (
              <div style={{ marginTop: 10 }}>
                <span className="badge" style={{ background: `${tool.color}20`, color: tool.color, border: `1px solid ${tool.color}40` }}>Active</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chatbot */}
      {activeTab === "chatbot" && (
        <div className="glass-card" style={{ overflow: "hidden" }}>
          {/* Chat Header */}
          <div style={{
            padding: "16px 20px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 12
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20
            }}>🤖</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>FWC HR AI Assistant</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#10b981" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                Online • Responds instantly
              </div>
            </div>
            <button
              onClick={() => setMessages([{
                id: "1", role: "assistant",
                content: "Chat cleared! How can I help you today? 😊",
                timestamp: new Date()
              }])}
              className="btn btn-secondary btn-sm"
              style={{ marginLeft: "auto" }}
            >
              Clear Chat
            </button>
          </div>

          {/* Quick Prompts */}
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {QUICK_PROMPTS.map(p => (
              <button
                key={p}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: 11 }}
                onClick={() => { setChatInput(p); }}
              >{p}</button>
            ))}
          </div>

          {/* Messages */}
          <div className="chat-messages" style={{ maxHeight: 380, overflowY: "auto", padding: "16px 20px" }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start", gap: 4 }}>
                {msg.role === "assistant" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>🤖</div>
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>AI Assistant</span>
                  </div>
                )}
                <div className={`chat-bubble ${msg.role === "user" ? "user" : "ai"}`}>
                  {msg.role === "assistant" ? (
                    <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}>
                      {msg.content.split("\n").map((line, li) => {
                        // Bold: **text**
                        const parts = line.split(/\*\*(.*?)\*\*/g);
                        const formatted = parts.map((part, pi) =>
                          pi % 2 === 1
                            ? <strong key={pi} style={{ color: "white", fontWeight: 700 }}>{part}</strong>
                            : <span key={pi}>{part}</span>
                        );
                        return <div key={li} style={{ marginBottom: line === "" ? 6 : 1 }}>{formatted}</div>;
                      })}
                    </div>
                  ) : msg.content}
                </div>
                <div style={{ fontSize: 10, color: "var(--text-muted)" }}>
                  {msg.timestamp.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="chat-bubble ai" style={{ padding: "12px 16px" }}>
                  <div className="ai-processing">
                    <div className="ai-dot" />
                    <div className="ai-dot" />
                    <div className="ai-dot" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendChat} style={{
            padding: "12px 16px",
            borderTop: "1px solid var(--border)",
            display: "flex", gap: 10
          }}>
            <input
              className="form-input"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              placeholder="Ask about HR policies, payroll, leaves..."
              id="chat-input"
              disabled={chatLoading}
            />
            <button type="submit" className="btn btn-primary" disabled={chatLoading || !chatInput.trim()} id="chat-send" style={{ flexShrink: 0 }}>
              Send →
            </button>
          </form>
        </div>
      )}

      {/* Sentiment Analyzer */}
      {activeTab === "sentiment" && (
        <div className="grid-sidebar">
          <div className="glass-card" style={{ padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 28 }}>🧠</span>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18 }}>Employee Sentiment Analyzer</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>AI-powered feedback analysis for HR insights</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Employee Feedback Text</label>
              <textarea
                className="form-input"
                rows={8}
                placeholder="Paste employee feedback here... The AI will analyze the sentiment, emotions, and provide actionable insights for HR teams."
                value={sentimentText}
                onChange={e => setSentimentText(e.target.value)}
                style={{ resize: "vertical" }}
                id="sentiment-input"
              />
            </div>

            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <button
                className="btn btn-primary"
                onClick={runSentiment}
                disabled={sentimentLoading || !sentimentText.trim()}
                id="analyze-sentiment-btn"
                style={{ flex: 1, justifyContent: "center" }}
              >
                {sentimentLoading ? <><div className="spinner" /> Analyzing...</> : "🧠 Analyze Sentiment"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSentimentText("I really love working at FWC IT Services. The team is great and the management is very supportive. The work-life balance has improved a lot. I feel motivated and engaged every day!");
                }}
                id="load-sample-btn"
              >Sample +</button>
            </div>

            {/* Quick Sample Texts */}
            <div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Sample Feedback Templates:</div>
              {[
                ["😊 Positive", "The work environment is excellent and supportive. I feel valued and appreciated."],
                ["😐 Neutral", "Work is okay. Some things could be improved but overall it is manageable."],
                ["😟 Negative", "I am very frustrated with the workload. Feeling stressed and demotivated lately."],
              ].map(([label, text]) => (
                <button
                  key={label}
                  className="btn btn-secondary"
                  onClick={() => setSentimentText(text)}
                  style={{ width: "100%", justifyContent: "flex-start", marginBottom: 6, fontSize: 12 }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            {sentimentLoading && (
              <div className="glass-card" style={{ padding: 32, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
                <div className="ai-processing" style={{ justifyContent: "center", marginBottom: 8 }}>
                  <div className="ai-dot" />
                  <div className="ai-dot" />
                  <div className="ai-dot" />
                  <span>Analyzing Sentiment...</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Processing emotions, tone, and intent</div>
              </div>
            )}

            {sentimentResult && (
              <div className="glass-card" style={{ padding: 24, animation: "fadeIn 0.5s ease" }}>
                {/* Sentiment Badge */}
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <div style={{ fontSize: 56, marginBottom: 8 }}>
                    {sentimentResult.sentiment === "Positive" ? "😊" : sentimentResult.sentiment === "Neutral" ? "😐" : "😟"}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: SENTIMENT_COLORS[sentimentResult.sentiment] }}>
                    {sentimentResult.sentiment} Sentiment
                  </div>
                  <div style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
                    Confidence: {sentimentResult.score}%
                  </div>
                </div>

                {/* Score Bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                    <span style={{ color: "#ef4444" }}>Negative</span>
                    <span style={{ color: "#f59e0b" }}>Neutral</span>
                    <span style={{ color: "#10b981" }}>Positive</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: "linear-gradient(90deg, #ef4444, #f59e0b, #10b981)", position: "relative" }}>
                    <div style={{
                      position: "absolute",
                      left: `${sentimentResult.score}%`,
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      width: 16, height: 16, borderRadius: "50%",
                      background: SENTIMENT_COLORS[sentimentResult.sentiment],
                      border: "2px solid white",
                      boxShadow: `0 0 10px ${SENTIMENT_COLORS[sentimentResult.sentiment]}`
                    }} />
                  </div>
                </div>

                {/* Emotion Scores */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 10 }}>Emotion Breakdown</div>
                  {Object.entries(sentimentResult.emotions).map(([emotion, score]) => (
                    <div key={emotion} style={{ marginBottom: 8 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                        <span style={{ textTransform: "capitalize", color: "var(--text-secondary)" }}>{emotion}</span>
                        <span style={{ fontWeight: 700 }}>{score}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${score}%`, background: emotion === "joy" || emotion === "engagement" ? "#10b981" : "#ef4444" }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Insights */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#6366f1" }}>💡 AI Insights</div>
                  {sentimentResult.insights.map((insight, i) => (
                    <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", padding: "4px 0" }}>• {insight}</div>
                  ))}
                </div>

                {/* Action Items */}
                <div style={{ background: "rgba(99,102,241,0.1)", borderRadius: 10, padding: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#818cf8" }}>📋 Recommended Actions</div>
                  {sentimentResult.actionItems.map((action, i) => (
                    <div key={i} style={{ fontSize: 13, color: "var(--text-secondary)", padding: "4px 0" }}>
                      {i + 1}. {action}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!sentimentResult && !sentimentLoading && (
              <div className="glass-card" style={{ padding: 32, textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🧠</div>
                <div style={{ fontWeight: 700, color: "var(--text-secondary)", marginBottom: 8 }}>Ready to Analyze</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Enter employee feedback text and click Analyze Sentiment to see AI insights</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Voice Assistant */}
      {activeTab === "voice" && (
        <div className="glass-card" style={{ padding: 32, textAlign: "center" }}>
          <div style={{ maxWidth: 500, margin: "0 auto" }}>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>🎙️ Voice HR Assistant</div>
            <div style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>
              Speak naturally to get HR policy information, apply for leaves, or check your status
            </div>

            {/* Mic Button */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: 32 }}>
              {voiceRecording && (
                <>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{
                      position: "absolute",
                      inset: `-${i * 20}px`,
                      borderRadius: "50%",
                      border: "2px solid rgba(239,68,68,0.3)",
                      animation: `pulse-glow ${0.8 + i * 0.2}s ease infinite`,
                    }} />
                  ))}
                </>
              )}
              <button
                onClick={handleVoiceDemo}
                disabled={voiceRecording || voiceThinking}
                id="voice-record-btn"
                style={{
                  width: 120, height: 120, borderRadius: "50%",
                  background: voiceRecording
                    ? "linear-gradient(135deg, #ef4444, #dc2626)"
                    : voiceThinking
                    ? "linear-gradient(135deg, #8b5cf6, #6366f1)"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  border: "none", cursor: (voiceRecording || voiceThinking) ? "not-allowed" : "pointer",
                  fontSize: 44, display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: voiceRecording ? "0 0 40px rgba(239,68,68,0.5)" : "0 0 30px rgba(99,102,241,0.4)",
                  transition: "all 0.3s ease",
                  position: "relative", zIndex: 1
                }}
              >
                {voiceRecording ? "🔴" : voiceThinking ? "⏳" : "🎙️"}
              </button>
            </div>

            <div style={{ marginBottom: 24 }}>
              {voiceRecording ? (
                <div>
                  <div className="ai-processing" style={{ justifyContent: "center", marginBottom: 8 }}>
                    <div className="ai-dot" />
                    <div className="ai-dot" />
                    <div className="ai-dot" />
                    <span style={{ color: "#ef4444", fontWeight: 600 }}>🔴 Listening... Speak now</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 6 }}>Speak clearly into your microphone</div>
                </div>
              ) : voiceThinking ? (
                <div>
                  {voiceTranscript && (
                    <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: "#6366f1", marginBottom: 4, fontWeight: 700 }}>🎙️ YOU SAID:</div>
                      <div style={{ fontSize: 15, fontWeight: 600 }}>"{voiceTranscript}"</div>
                    </div>
                  )}
                  <div className="ai-processing" style={{ justifyContent: "center", marginBottom: 8 }}>
                    <div className="ai-dot" />
                    <div className="ai-dot" />
                    <div className="ai-dot" />
                    <span style={{ color: "#818cf8", fontWeight: 600 }}>🤖 AI is thinking...</span>
                  </div>
                </div>
              ) : voiceTranscript ? (
                <div>
                  <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: "#6366f1", marginBottom: 4, fontWeight: 700 }}>🎙️ YOU SAID:</div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>"{voiceTranscript}"</div>
                  </div>
                  {voiceResponse && (
                    <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))", borderRadius: 12, padding: 16, textAlign: "left", border: "1px solid rgba(99,102,241,0.2)" }}>
                      <div style={{ fontSize: 11, color: "#10b981", marginBottom: 8, fontWeight: 700 }}>🤖 AI RESPONSE:</div>
                      <div style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{voiceResponse}</div>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: 12, fontSize: 11 }}
                        onClick={() => speak(voiceResponse)}
                      >🔊 Read Again</button>
                    </div>
                  )}
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 12 }}
                    onClick={() => { setVoiceTranscript(""); setVoiceResponse(""); }}
                  >🔄 Ask Another</button>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Click the mic to start speaking</div>
                  <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Real microphone input • Falls back to demo if unsupported</div>
                </div>
              )}
            </div>

            <div style={{ marginBottom: 12, fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>Or tap a quick question:</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
              {[
                "What is the leave policy?",
                "How is salary calculated?",
                "When is the next appraisal?",
                "How to apply for WFH?",
                "What is the notice period?",
                "How to claim health insurance?"
              ].map(cmd => (
                <button
                  key={cmd}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: 12, opacity: (voiceThinking || voiceRecording) ? 0.5 : 1 }}
                  disabled={voiceThinking || voiceRecording}
                  onClick={async () => {
                    setVoiceTranscript(cmd);
                    setVoiceResponse("");
                    setVoiceThinking(true);
                    try {
                      const res = await chatWithAI(cmd, []);
                      setVoiceResponse(res);
                      speak(res);
                    } catch (e) {
                      setVoiceResponse("Sorry, could not fetch a response. Please try again.");
                    } finally {
                      setVoiceThinking(false);
                    }
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
