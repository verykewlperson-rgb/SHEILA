import { DashboardLayout } from "@/components/DashboardLayout";
import { Mic, MicOff, MessageSquare, Target, TrendingUp, BarChart3, AlertCircle, Volume2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech";

interface Message {
  role: "ai" | "user";
  text: string;
}

const aiResponses = [
  "बहुत अच्छा! आपका उच्चारण बेहतर हो रहा है।",
  "चलिए अगले विषय पर चलते हैं। आज का मौसम कैसा है?",
  "शाबाश! क्या आप मुझे अपने परिवार के बारे में बता सकते हैं?",
  "अच्छा प्रयास! 'ध' की ध्वनि पर ध्यान दें।",
];

export default function LiveSpeakerPage() {
  const { isRecording, transcript, error, toggleRecording } = useSpeechRecognition();
  const { isSpeaking, speak } = useSpeechSynthesis();
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "नमस्ते! आज आप कैसे हैं?" },
  ]);
  const [wordsSpoken, setWordsSpoken] = useState(0);
  const [interactions, setInteractions] = useState(0);

  const handleToggle = () => {
    if (isRecording && transcript) {
      const userMsg: Message = { role: "user", text: transcript };
      const aiReply = aiResponses[interactions % aiResponses.length];
      const aiMsg: Message = { role: "ai", text: aiReply };
      setMessages((prev) => [...prev, userMsg, aiMsg]);
      setWordsSpoken((prev) => prev + transcript.split(/\s+/).length);
      setInteractions((prev) => prev + 1);
    }
    toggleRecording();
  };

  const stats = [
    { label: "Words Spoken", value: String(wordsSpoken), icon: MessageSquare },
    { label: "Interactions", value: String(interactions), icon: BarChart3 },
    { label: "Accuracy", value: "87%", icon: Target },
    { label: "Progress", value: "Level 3", icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground mb-6">Live Speaker</h1>

            {error && (
              <div className="border border-destructive/50 bg-destructive/10 px-4 py-3 mb-4 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Mic Button */}
            <div className="border border-border bg-card flex flex-col items-center justify-center py-20 mb-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                className={`h-24 w-24 border-2 flex items-center justify-center transition-colors duration-200 ${
                  isRecording
                    ? "border-destructive bg-destructive text-destructive-foreground"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-8 w-8 animate-pulse" />
                ) : (
                  <Mic className="h-8 w-8" />
                )}
              </motion.button>
              <p className="mt-4 text-sm text-muted-foreground">
                {isRecording ? "Listening… Click to stop" : "Click to start speaking"}
              </p>
              {isRecording && transcript && (
                <p className="mt-2 text-sm text-foreground border border-border px-4 py-2 bg-accent max-w-md text-center">
                  {transcript}
                </p>
              )}
            </div>

            {/* Conversation */}
            <div className="panel mb-4">
              <p className="section-title">Current Conversation</p>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {messages.map((msg, i) => (
                  <div key={i} className={`text-sm border-l-2 pl-3 flex items-start gap-2 ${
                    msg.role === "ai"
                      ? "text-muted-foreground border-border"
                      : "text-foreground border-foreground"
                  }`}>
                    <span className="flex-1">
                      {msg.role === "ai" ? "AI" : "You"}: {msg.text}
                    </span>
                    {msg.role === "ai" && (
                      <button
                        onClick={() => speak(msg.text)}
                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
                        title="Listen"
                      >
                        <Volume2 className={`h-3.5 w-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <p className="section-title">Current Topic</p>
              <p className="text-sm text-foreground">Daily Greetings & Introductions</p>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="w-full lg:w-72 space-y-3">
            <p className="section-title">Session Stats</p>
            {stats.map((s) => (
              <div key={s.label} className="stat-card flex items-center gap-3">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-medium text-foreground">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
