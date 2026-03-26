import { DashboardLayout } from "@/components/DashboardLayout";
import { Play, RefreshCw, Target, Clock, BarChart3, Volume2, CheckCircle, XCircle, Square } from "lucide-react";
import { useState } from "react";
import { useSpeechSynthesis } from "@/hooks/use-speech";

const difficulties = ["Easy", "Medium", "Hard"];

const phrases: Record<string, { hindi: string; romanized: string; english: string }[]> = {
  Easy: [
    { hindi: "नमस्ते, आप कैसे हैं?", romanized: "Namaste, aap kaise hain?", english: "Hello, how are you?" },
    { hindi: "मेरा नाम राज है।", romanized: "Mera naam Raj hai.", english: "My name is Raj." },
    { hindi: "यह किताब है।", romanized: "Yeh kitaab hai.", english: "This is a book." },
  ],
  Medium: [
    { hindi: "कृपया मुझे एक गिलास पानी दीजिए।", romanized: "Kripaya mujhe ek gilaas paani dijiye.", english: "Please give me a glass of water." },
    { hindi: "आज मौसम बहुत अच्छा है।", romanized: "Aaj mausam bahut accha hai.", english: "The weather is very nice today." },
  ],
  Hard: [
    { hindi: "भारत एक विविधताओं से भरा देश है।", romanized: "Bharat ek vividhtaaon se bhara desh hai.", english: "India is a country full of diversity." },
    { hindi: "शिक्षा सबसे शक्तिशाली हथियार है।", romanized: "Shiksha sabse shaktishali hathiyaar hai.", english: "Education is the most powerful weapon." },
  ],
};

export default function HearAndTypePage() {
  const [difficulty, setDifficulty] = useState("Easy");
  const [answer, setAnswer] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [result, setResult] = useState<"correct" | "incorrect" | null>(null);
  const [completed, setCompleted] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const { isSpeaking, speak, stop } = useSpeechSynthesis();

  const currentPhrases = phrases[difficulty];
  const current = currentPhrases[phraseIndex % currentPhrases.length];

  const handlePlay = () => {
    if (isSpeaking) {
      stop();
    } else {
      speak(current.hindi);
    }
  };

  const handleGenerate = () => {
    setPhraseIndex((i) => i + 1);
    setAnswer("");
    setResult(null);
  };

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const isCorrect =
      answer.trim().toLowerCase() === current.romanized.toLowerCase() ||
      answer.trim() === current.hindi ||
      answer.trim().toLowerCase() === current.english.toLowerCase();
    setResult(isCorrect ? "correct" : "incorrect");
    setCompleted((c) => c + 1);
    if (isCorrect) setCorrectCount((c) => c + 1);
    setTimeout(() => {
      setResult(null);
      setAnswer("");
      setPhraseIndex((i) => i + 1);
    }, 2500);
  };

  const accuracy = completed > 0 ? Math.round((correctCount / completed) * 100) : 0;

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
                  onClick={() => { setDifficulty(d); setPhraseIndex(0); setAnswer(""); setResult(null); }}
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
              <button
                onClick={handlePlay}
                className={`h-16 w-16 border-2 flex items-center justify-center transition-colors mb-4 ${
                  isSpeaking
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:bg-accent"
                }`}
              >
                {isSpeaking ? <Square className="h-5 w-5" /> : <Play className="h-6 w-6 ml-1" />}
              </button>
              <p className="text-sm text-muted-foreground mb-6">
                {isSpeaking ? "Playing…" : "Click to play audio"}
              </p>
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Generate Phrase
              </button>
            </div>

            {/* Input */}
            <div className="panel">
              <p className="section-title">Type what you hear</p>
              <p className="text-xs text-muted-foreground mb-3">Type in Hindi, Romanized, or English</p>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Type your answer here…"
                className={`w-full border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-colors bg-background ${
                  result === "correct"
                    ? "border-green-500"
                    : result === "incorrect"
                    ? "border-red-500"
                    : "border-border focus:border-foreground"
                }`}
              />
              {result && (
                <div className={`mt-3 flex items-center gap-2 text-sm ${result === "correct" ? "text-green-400" : "text-red-400"}`}>
                  {result === "correct" ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  {result === "correct" ? "Correct!" : `Answer: ${current.romanized} (${current.hindi})`}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={!answer.trim() || result !== null}
                className="mt-4 bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Submit
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="w-full lg:w-72 space-y-3">
            <p className="section-title">Session Stats</p>
            {[
              { label: "Phrases Completed", value: String(completed), icon: BarChart3 },
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
      </div>
    </DashboardLayout>
  );
}
