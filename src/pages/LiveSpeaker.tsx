import { DashboardLayout } from "@/components/DashboardLayout";
import { Mic, MessageSquare, Target, TrendingUp, BarChart3 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function LiveSpeakerPage() {
  const [isRecording, setIsRecording] = useState(false);

  const stats = [
    { label: "Words Spoken", value: "142", icon: MessageSquare },
    { label: "Interactions", value: "23", icon: BarChart3 },
    { label: "Accuracy", value: "87%", icon: Target },
    { label: "Progress", value: "Level 3", icon: TrendingUp },
  ];

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Area */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground mb-6">Live Speaker</h1>

            {/* Mic Button */}
            <div className="border border-border bg-card flex flex-col items-center justify-center py-20 mb-6">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRecording(!isRecording)}
                className={`h-24 w-24 border-2 flex items-center justify-center transition-colors duration-200 ${
                  isRecording
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <Mic className={`h-8 w-8 ${isRecording ? "animate-pulse-subtle" : ""}`} />
              </motion.button>
              <p className="mt-4 text-sm text-muted-foreground">
                {isRecording ? "Listening…" : "Click to start speaking"}
              </p>
            </div>

            {/* Conversation */}
            <div className="panel mb-4">
              <p className="section-title">Current Conversation</p>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground border-l-2 border-border pl-3">
                  AI: नमस्ते! आज आप कैसे हैं?
                </div>
                <div className="text-sm text-foreground border-l-2 border-foreground pl-3">
                  You: मैं अच्छा हूँ, धन्यवाद!
                </div>
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
