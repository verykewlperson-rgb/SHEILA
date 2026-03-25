import { DashboardLayout } from "@/components/DashboardLayout";
import { Swords, Trophy, Timer, TrendingUp } from "lucide-react";

const battles = [
  { opponent: "Amit S.", rank: "Silver", myScore: 78, theirScore: 65, timeLeft: "2:34", status: "active" },
  { opponent: "Lisa W.", rank: "Gold", myScore: 45, theirScore: 52, timeLeft: "5:12", status: "active" },
  { opponent: "Carlos M.", rank: "Bronze", myScore: 92, theirScore: 88, timeLeft: "0:00", status: "finished" },
];

export default function DuelingPage() {
  return (
    <DashboardLayout>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold text-foreground">Dueling Friends</h1>
              <button className="bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
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
