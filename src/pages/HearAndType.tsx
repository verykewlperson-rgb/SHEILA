import { DashboardLayout } from "@/components/DashboardLayout";
import { Play, RefreshCw, Target, Clock, BarChart3 } from "lucide-react";
import { useState } from "react";

const difficulties = ["Easy", "Medium", "Hard"];

export default function HearAndTypePage() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [answer, setAnswer] = useState("");

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground mb-6">Hear & Type</h1>

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

            {/* Audio Area */}
            <div className="border border-border bg-card flex flex-col items-center py-16 mb-6">
              <button className="h-16 w-16 border-2 border-border bg-card text-foreground hover:bg-accent flex items-center justify-center transition-colors mb-4">
                <Play className="h-6 w-6 ml-1" />
              </button>
              <p className="text-sm text-muted-foreground mb-6">Click to play audio</p>
              <button className="flex items-center gap-2 border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">
                <RefreshCw className="h-3.5 w-3.5" />
                Generate Phrase
              </button>
            </div>

            {/* Input */}
            <div className="panel">
              <p className="section-title">Type what you hear</p>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here…"
                className="w-full border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-foreground transition-colors"
              />
              <button className="mt-4 bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
                Submit
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="w-full lg:w-72 space-y-3">
            <p className="section-title">Session Stats</p>
            {[
              { label: "Phrases Completed", value: "14", icon: BarChart3 },
              { label: "Accuracy", value: "79%", icon: Target },
              { label: "Time Spent", value: "18 min", icon: Clock },
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
      </div>
    </DashboardLayout>
  );
}
