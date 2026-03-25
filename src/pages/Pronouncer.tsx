import { DashboardLayout } from "@/components/DashboardLayout";
import { Mic, Target, BarChart3, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const categories = ["All", "Greetings", "Politeness", "Numbers", "Food", "Travel"];
const difficulties = ["Easy", "Medium", "Hard"];

export default function PronouncerPage() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isRecording, setIsRecording] = useState(false);

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground mb-6">Pronouncer</h1>

            {/* Difficulty */}
            <div className="flex gap-px border border-border mb-6 w-fit">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 text-sm transition-colors ${
                    difficulty === d
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Current Word */}
            <div className="border border-border bg-card flex flex-col items-center py-16 mb-6">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider">Current Word</p>
              <p className="text-3xl font-semibold text-foreground mb-1">नमस्ते</p>
              <p className="text-sm text-muted-foreground mb-8">Namaste — Hello</p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsRecording(!isRecording)}
                className={`h-16 w-16 border-2 flex items-center justify-center transition-colors ${
                  isRecording
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                <Mic className={`h-6 w-6 ${isRecording ? "animate-pulse-subtle" : ""}`} />
              </motion.button>
              <p className="mt-3 text-xs text-muted-foreground">
                {isRecording ? "Listening…" : "Tap to record"}
              </p>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-72 space-y-4">
            <div>
              <p className="section-title">Session Stats</p>
              <div className="space-y-3">
                {[
                  { label: "Words Practiced", value: "18", icon: BarChart3 },
                  { label: "Accuracy", value: "92%", icon: Target },
                  { label: "Time Spent", value: "12 min", icon: Clock },
                ].map((s) => (
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

            <div>
              <p className="section-title">Categories</p>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className={`px-3 py-1.5 text-xs border transition-colors ${
                      activeCategory === c
                        ? "border-foreground bg-foreground text-background"
                        : "border-border text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
