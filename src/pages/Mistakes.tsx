import { DashboardLayout } from "@/components/DashboardLayout";
import { Volume2, RotateCcw, CheckCircle2, AlertCircle, BarChart3 } from "lucide-react";

const mistakes = [
  { id: 1, category: "Fluency", text: "मैं स्कूल जाता हूँ", correction: "Use present continuous for ongoing actions", status: "pending" },
  { id: 2, category: "Grammar", text: "वह खाना खाती है", correction: "Gender agreement with verb ending", status: "pending" },
  { id: 3, category: "Pronunciation", text: "धन्यवाद", correction: "Stress on second syllable", status: "done" },
  { id: 4, category: "Vocabulary", text: "किताब vs पुस्तक", correction: "किताब is more commonly used in everyday speech", status: "pending" },
];

export default function MistakesPage() {
  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground mb-6">Solving Mistakes</h1>

            <div className="space-y-3">
              {mistakes.map((m) => (
                <div
                  key={m.id}
                  className={`border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-4 ${
                    m.status === "done" ? "border-border opacity-60" : "border-border"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium border border-border px-2 py-0.5 text-muted-foreground">
                        {m.category}
                      </span>
                      {m.status === "done" && (
                        <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm font-medium text-foreground">{m.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.correction}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors flex items-center gap-1.5">
                      <Volume2 className="h-3 w-3" /> Listen
                    </button>
                    <button className="border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors flex items-center gap-1.5">
                      <RotateCcw className="h-3 w-3" /> Practice
                    </button>
                    {m.status !== "done" && (
                      <button className="bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90 transition-opacity">
                        Mark Finished
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-72 space-y-3">
            <p className="section-title">Overview</p>
            {[
              { label: "Total Mistakes", value: "47" },
              { label: "Resolved This Week", value: "12" },
              { label: "Pending", value: "35" },
            ].map((s) => (
              <div key={s.label} className="stat-card">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-semibold text-foreground">{s.value}</p>
              </div>
            ))}

            <div className="panel mt-4">
              <p className="section-title">Practice Focus</p>
              <div className="space-y-2">
                {["Fluency", "Grammar", "Pronunciation", "Vocabulary"].map((cat) => (
                  <div key={cat} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{cat}</span>
                    <div className="w-24 h-1.5 bg-accent">
                      <div
                        className="h-full bg-foreground"
                        style={{ width: `${Math.random() * 60 + 30}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
