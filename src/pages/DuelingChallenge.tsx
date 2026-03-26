import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Timer, Swords, Trophy, TrendingUp, BarChart3, Send, ChevronDown } from "lucide-react";

const quizQuestions = [
  { question: "How do you say 'Thank you' in Hindi?", options: ["धन्यवाद", "नमस्ते", "अलविदा", "कृपया"], correct: 0 },
  { question: "What does 'पानी' mean?", options: ["Food", "Water", "Fire", "Air"], correct: 1 },
  { question: "Translate 'Good morning' to Hindi:", options: ["शुभ रात्रि", "शुभ संध्या", "शुभ प्रभात", "नमस्कार"], correct: 2 },
  { question: "What is 'पुस्तक'?", options: ["Pen", "Paper", "Book", "Table"], correct: 2 },
  { question: "How do you say 'My name is…' in Hindi?", options: ["मेरा घर है", "मेरा नाम है", "मेरा काम है", "मेरा दोस्त है"], correct: 1 },
];

const categories = ["General", "Greetings", "Food", "Travel"];
const difficultyLevels = ["Easy", "Medium", "Hard"];

export default function DuelingChallengePage() {
  const { id } = useParams();
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [myScore, setMyScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [answered, setAnswered] = useState(false);
  const [status, setStatus] = useState("Waiting for opponent…");
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("Easy");
  const [category, setCategory] = useState("General");
  const [pastBattles] = useState([
    { opponent: "Amit S.", result: "Won", score: "+15 pts" },
    { opponent: "Lisa W.", result: "Lost", score: "-8 pts" },
    { opponent: "Carlos M.", result: "Won", score: "+12 pts" },
  ]);

  // Simulate game start
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
      setStatus("Battle in progress");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!gameStarted || answered) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [gameStarted, timeLeft, answered]);

  const handleAutoSubmit = () => {
    setAnswered(true);
    setStatus("Time's up!");
    // Simulate opponent answer
    const opGain = Math.random() > 0.4 ? 20 : 0;
    setOpponentScore((p) => p + opGain);
    setTimeout(nextQuestion, 2000);
  };

  const handleSubmit = () => {
    if (selected === null || answered) return;
    setAnswered(true);
    const q = quizQuestions[currentQ];
    if (selected === q.correct) {
      const bonus = Math.max(5, Math.round(timeLeft * 0.5));
      setMyScore((p) => p + 20 + bonus);
      setStatus("Correct! +" + (20 + bonus) + " pts");
    } else {
      setStatus("Incorrect. The answer was: " + q.options[q.correct]);
    }
    // Simulate opponent
    const opGain = Math.random() > 0.5 ? 20 : 0;
    setOpponentScore((p) => p + opGain);
    setTimeout(nextQuestion, 2500);
  };

  const nextQuestion = () => {
    if (currentQ >= quizQuestions.length - 1) {
      setStatus("Battle complete!");
      return;
    }
    setCurrentQ((p) => p + 1);
    setSelected(null);
    setAnswered(false);
    setTimeLeft(45);
    setStatus("Battle in progress");
  };

  const isComplete = currentQ >= quizQuestions.length - 1 && answered;
  const q = quizQuestions[currentQ];

  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground mb-2">Dueling Playbook</h1>
            <p className="text-xs text-muted-foreground mb-6">Challenge ID: {id}</p>

            {/* Current Battle Card */}
            <div className="border border-border bg-card p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 border border-border bg-accent flex items-center justify-center text-sm font-medium text-foreground">
                    U
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">You</p>
                    <p className="text-xs text-muted-foreground">Silver</p>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <Swords className="h-5 w-5 text-muted-foreground mb-1" />
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Timer className="h-3 w-3" />
                    <span className={timeLeft <= 10 ? "text-destructive font-medium" : ""}>{timeLeft}s</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">Opponent</p>
                    <p className="text-xs text-muted-foreground">Bronze</p>
                  </div>
                  <div className="h-10 w-10 border border-border bg-accent flex items-center justify-center text-sm font-medium text-foreground">
                    ?
                  </div>
                </div>
              </div>

              {/* Score comparison */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-foreground font-medium">You</span>
                    <span className="text-foreground font-medium">{myScore}</span>
                  </div>
                  <div className="h-2 bg-accent">
                    <motion.div
                      className="h-full bg-foreground"
                      animate={{ width: `${Math.min((myScore / Math.max(myScore + opponentScore, 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-medium">VS</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Opponent</span>
                    <span className="text-muted-foreground">{opponentScore}</span>
                  </div>
                  <div className="h-2 bg-accent">
                    <motion.div
                      className="h-full bg-muted-foreground"
                      animate={{ width: `${Math.min((opponentScore / Math.max(myScore + opponentScore, 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-center text-xs text-muted-foreground">{status}</p>
            </div>

            {/* Difficulty/Category Toggles */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex gap-px border border-border w-fit">
                {difficultyLevels.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-1.5 text-xs transition-colors ${
                      difficulty === d ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              <div className="flex gap-px border border-border w-fit">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 text-xs transition-colors ${
                      category === c ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-accent"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Quiz */}
            {!isComplete && gameStarted ? (
              <div className="panel">
                <div className="flex items-center justify-between mb-4">
                  <p className="section-title mb-0">Question {currentQ + 1} / {quizQuestions.length}</p>
                </div>
                <p className="text-foreground font-medium mb-5">{q.question}</p>
                <div className="space-y-2 mb-6">
                  {q.options.map((opt, i) => (
                    <button
                      key={i}
                      disabled={answered}
                      onClick={() => setSelected(i)}
                      className={`w-full text-left border px-4 py-3 text-sm transition-colors ${
                        answered && i === q.correct
                          ? "border-green-500 bg-green-500/10 text-foreground"
                          : answered && selected === i && i !== q.correct
                          ? "border-red-500 bg-red-500/10 text-foreground"
                          : selected === i
                          ? "border-foreground bg-accent text-foreground"
                          : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={selected === null || answered}
                  className="bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  Submit Response
                </button>
              </div>
            ) : isComplete ? (
              <div className="panel text-center py-12">
                <Trophy className="h-12 w-12 text-foreground mx-auto mb-4" />
                <p className="text-lg font-semibold text-foreground mb-2">
                  {myScore > opponentScore ? "You Won!" : myScore < opponentScore ? "You Lost" : "It's a Draw!"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Final Score: {myScore} vs {opponentScore}
                </p>
                <button
                  onClick={() => window.location.href = "/dueling"}
                  className="bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:opacity-90"
                >
                  Back to Dueling
                </button>
              </div>
            ) : (
              <div className="panel text-center py-12">
                <Swords className="h-10 w-10 text-muted-foreground mx-auto mb-4 animate-pulse" />
                <p className="text-sm text-muted-foreground">Waiting for opponent to join…</p>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-72 space-y-3">
            <p className="section-title">Battle Stats</p>
            {[
              { label: "Your Score", value: String(myScore), icon: Trophy },
              { label: "Questions Left", value: String(quizQuestions.length - currentQ - (answered ? 1 : 0)), icon: BarChart3 },
              { label: "Time per Q", value: "45s", icon: Timer },
              { label: "Win Rate", value: "68%", icon: TrendingUp },
            ].map((s) => (
              <div key={s.label} className="stat-card flex items-center gap-3">
                <s.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-medium text-foreground">{s.value}</p>
                </div>
              </div>
            ))}

            <div className="panel mt-4">
              <p className="section-title">Past Battles</p>
              <div className="space-y-2">
                {pastBattles.map((b, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{b.opponent}</span>
                    <span className={b.result === "Won" ? "text-green-400" : "text-red-400"}>
                      {b.result} {b.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <p className="section-title">Session Momentum</p>
              <div className="flex gap-1">
                {["W", "L", "W", "W", "W"].map((r, i) => (
                  <div
                    key={i}
                    className={`h-6 w-6 flex items-center justify-center text-xs font-medium border ${
                      r === "W"
                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                        : "border-red-500/50 bg-red-500/10 text-red-400"
                    }`}
                  >
                    {r}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">3-game win streak 🔥</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
