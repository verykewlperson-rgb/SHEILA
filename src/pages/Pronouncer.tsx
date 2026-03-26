import { DashboardLayout } from "@/components/DashboardLayout";
import { Mic, MicOff, Target, BarChart3, Clock, Volume2, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSpeechRecognition, useSpeechSynthesis } from "@/hooks/use-speech";

const categories = ["All", "Greetings", "Politeness", "Numbers", "Food", "Travel"];
const difficulties = ["Easy", "Medium", "Hard"];

const wordBank: Record<string, { word: string; romanized: string; meaning: string; category: string }[]> = {
  Easy: [
    { word: "नमस्ते", romanized: "Namaste", meaning: "Hello", category: "Greetings" },
    { word: "धन्यवाद", romanized: "Dhanyavaad", meaning: "Thank you", category: "Politeness" },
    { word: "हाँ", romanized: "Haan", meaning: "Yes", category: "All" },
    { word: "नहीं", romanized: "Nahin", meaning: "No", category: "All" },
    { word: "पानी", romanized: "Paani", meaning: "Water", category: "Food" },
  ],
  Medium: [
    { word: "कृपया", romanized: "Kripaya", meaning: "Please", category: "Politeness" },
    { word: "शुभ प्रभात", romanized: "Shubh Prabhaat", meaning: "Good morning", category: "Greetings" },
    { word: "कितना", romanized: "Kitna", meaning: "How much", category: "Numbers" },
    { word: "स्टेशन", romanized: "Station", meaning: "Station", category: "Travel" },
  ],
  Hard: [
    { word: "अनुग्रह", romanized: "Anugrah", meaning: "Grace/Favor", category: "Politeness" },
    { word: "विश्वविद्यालय", romanized: "Vishwavidyalaya", meaning: "University", category: "Travel" },
    { word: "प्रतिस्पर्धा", romanized: "Pratispardha", meaning: "Competition", category: "All" },
  ],
};

export default function PronouncerPage() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [activeCategory, setActiveCategory] = useState("All");
  const [wordIndex, setWordIndex] = useState(0);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [practiced, setPracticed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const { isRecording, transcript, error, toggleRecording, setTranscript } = useSpeechRecognition();
  const { isSpeaking, speak } = useSpeechSynthesis();

  const words = wordBank[difficulty].filter(
    (w) => activeCategory === "All" || w.category === activeCategory
  );
  const currentWord = words[wordIndex % words.length];

  const handleToggle = () => {
    if (isRecording && transcript) {
      const isCorrect = transcript.toLowerCase().includes(currentWord.romanized.toLowerCase()) ||
        transcript.includes(currentWord.word);
      setResult(isCorrect ? "correct" : "incorrect");
      setPracticed((p) => p + 1);
      if (isCorrect) setCorrect((c) => c + 1);
      setTimeout(() => {
        setResult(null);
        setTranscript("");
        setWordIndex((i) => i + 1);
      }, 2000);
    }
    toggleRecording();
  };

  const accuracy = practiced > 0 ? Math.round((correct / practiced) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground mb-6">Pronouncer</h1>

            {error && (
              <div className="border border-destructive/50 bg-destructive/10 px-4 py-3 mb-4 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Difficulty */}
            <div className="flex gap-px border border-border mb-6 w-fit">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => { setDifficulty(d); setWordIndex(0); }}
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
              <p className="text-3xl font-semibold text-foreground mb-1">{currentWord.word}</p>
              <p className="text-sm text-muted-foreground mb-2">{currentWord.romanized} — {currentWord.meaning}</p>
              <button
                onClick={() => speak(currentWord.word)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <Volume2 className={`h-3.5 w-3.5 ${isSpeaking ? "animate-pulse" : ""}`} />
                Listen
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleToggle}
                className={`h-16 w-16 border-2 flex items-center justify-center transition-colors ${
                  isRecording
                    ? "border-destructive bg-destructive text-destructive-foreground"
                    : result === "correct"
                    ? "border-green-500 bg-green-500/20 text-green-400"
                    : result === "incorrect"
                    ? "border-red-500 bg-red-500/20 text-red-400"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                {result === "correct" ? (
                  <CheckCircle className="h-6 w-6" />
                ) : result === "incorrect" ? (
                  <XCircle className="h-6 w-6" />
                ) : isRecording ? (
                  <MicOff className="h-6 w-6 animate-pulse" />
                ) : (
                  <Mic className="h-6 w-6" />
                )}
              </motion.button>
              <p className="mt-3 text-xs text-muted-foreground">
                {result === "correct"
                  ? "Correct! Moving to next word…"
                  : result === "incorrect"
                  ? "Try again! Moving to next word…"
                  : isRecording
                  ? "Listening… Click to stop"
                  : "Tap to record"}
              </p>
              {isRecording && transcript && (
                <p className="mt-2 text-sm text-foreground border border-border px-4 py-2 bg-accent">
                  {transcript}
                </p>
              )}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-72 space-y-4">
            <div>
              <p className="section-title">Session Stats</p>
              <div className="space-y-3">
                {[
                  { label: "Words Practiced", value: String(practiced), icon: BarChart3 },
                  { label: "Accuracy", value: `${accuracy}%`, icon: Target },
                  { label: "Time Spent", value: "—", icon: Clock },
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
                    onClick={() => { setActiveCategory(c); setWordIndex(0); }}
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
