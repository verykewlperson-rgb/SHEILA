import { DashboardLayout } from "@/components/DashboardLayout";
import { Swords, Trophy, Timer, TrendingUp, Copy, Check, Loader2, X } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const battles = [
  { opponent: "Amit S.", rank: "Silver", myScore: 78, theirScore: 65, timeLeft: "2:34", status: "active" },
  { opponent: "Lisa W.", rank: "Gold", myScore: 45, theirScore: 52, timeLeft: "5:12", status: "active" },
  { opponent: "Carlos M.", rank: "Bronze", myScore: 92, theirScore: 88, timeLeft: "0:00", status: "finished" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

// Game-style cloud loader
function CloudLoader({ onComplete }: { onComplete: (id: string) => void }) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("Searching for opponents…");

  useEffect(() => {
    const texts = [
      "Searching for opponents…",
      "Preparing battle arena…",
      "Generating challenge questions…",
      "Setting up the duel…",
      "Almost ready…",
    ];
    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 18 + 5, 100);
        const idx = Math.min(Math.floor((next / 100) * texts.length), texts.length - 1);
        setStatusText(texts[idx]);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(generateId()), 600);
        }
        return next;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-background/95 flex flex-col items-center justify-center">
      {/* Animated clouds */}
      <div className="relative w-80 h-48 mb-8">
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="absolute bg-muted/40 border border-border"
            style={{
              width: 60 + i * 20,
              height: 24 + i * 6,
              top: 20 + (i % 3) * 50,
              borderRadius: "2px",
            }}
            animate={{
              x: [-(i * 30 + 40), 320],
              opacity: [0, 0.6, 0.6, 0],
            }}
            transition={{
              duration: 4 + i * 0.8,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "linear",
            }}
          />
        ))}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Swords className="h-16 w-16 text-foreground" />
        </motion.div>
      </div>

      <p className="text-lg font-semibold text-foreground mb-2">Preparing Challenge</p>
      <p className="text-sm text-muted-foreground mb-6">{statusText}</p>

      {/* Progress bar */}
      <div className="w-72 h-1.5 bg-accent border border-border overflow-hidden">
        <motion.div
          className="h-full bg-foreground"
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}%</p>
    </div>
  );
}

// Share link modal
function ShareModal({ challengeId, onClose }: { challengeId: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/dueling/challenge/${challengeId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="border border-border bg-card p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Challenge Created!</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Share this link with a friend to start a duel. They'll receive the same quiz questions!
        </p>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 border border-border bg-background px-3 py-2 text-sm text-foreground overflow-x-auto whitespace-nowrap">
            {link}
          </div>
          <button
            onClick={handleCopy}
            className="border border-border px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors flex items-center gap-1.5 shrink-0"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <button
          onClick={() => {
            onClose();
            window.location.href = `/dueling/challenge/${challengeId}`;
          }}
          className="w-full bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Go to Challenge
        </button>
      </motion.div>
    </div>
  );
}

export default function DuelingPage() {
  const [showLoader, setShowLoader] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const handleNewChallenge = () => {
    setShowLoader(true);
  };

  const handleLoaderComplete = useCallback((id: string) => {
    setShowLoader(false);
    setChallengeId(id);
  }, []);

  return (
    <DashboardLayout>
      <AnimatePresence>
        {showLoader && <CloudLoader onComplete={handleLoaderComplete} />}
      </AnimatePresence>
      {challengeId && (
        <ShareModal challengeId={challengeId} onClose={() => setChallengeId(null)} />
      )}

      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold text-foreground">Dueling Friends</h1>
              <button
                onClick={handleNewChallenge}
                className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
              >
                New Challenge
              </button>
            </div>

            <div className="space-y-3">
              {battles.map((b) => (
                <div key={b.opponent} className="border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 border border-border bg-accent flex items-center justify-center text-xs font-medium text-foreground">
                        {b.opponent[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{b.opponent}</p>
                        <p className="text-xs text-muted-foreground">{b.rank}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Timer className="h-3 w-3" />
                      {b.timeLeft}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-foreground font-medium">You</span>
                        <span className="text-foreground font-medium">{b.myScore}</span>
                      </div>
                      <div className="h-1.5 bg-accent">
                        <div className="h-full bg-foreground" style={{ width: `${b.myScore}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">VS</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">{b.opponent.split(" ")[0]}</span>
                        <span className="text-muted-foreground">{b.theirScore}</span>
                      </div>
                      <div className="h-1.5 bg-accent">
                        <div className="h-full bg-muted-foreground" style={{ width: `${b.theirScore}%` }} />
                      </div>
                    </div>
                  </div>

                  {b.status === "active" && (
                    <button className="w-full border border-border py-2 text-sm text-foreground font-medium hover:bg-accent transition-colors">
                      Continue Battle
                    </button>
                  )}
                  {b.status === "finished" && (
                    <p className="text-center text-xs text-muted-foreground">Battle completed — You won!</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-72 space-y-3">
            <p className="section-title">Your Ranking</p>
            {[
              { label: "Rank", value: "Silver", icon: Trophy },
              { label: "Points", value: "1,240", icon: TrendingUp },
              { label: "Win Rate", value: "68%", icon: Swords },
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
              <p className="section-title">Recent Activity</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>Won vs Amit S. — +15 pts</p>
                <p>Lost vs Lisa W. — -8 pts</p>
                <p>Won vs Carlos M. — +12 pts</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
