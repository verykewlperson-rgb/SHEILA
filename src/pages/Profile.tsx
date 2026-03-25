import { DashboardLayout } from "@/components/DashboardLayout";
import { Trophy, Flame, Target, Star, Award, BarChart3, RotateCcw, Download, Flag } from "lucide-react";

const achievements = [
  { title: "First Words", desc: "Spoke your first 10 words", unlocked: true },
  { title: "Week Warrior", desc: "7-day learning streak", unlocked: true },
  { title: "Sharp Ear", desc: "90%+ accuracy in Hear & Type", unlocked: false },
  { title: "Duel Master", desc: "Win 10 duels", unlocked: false },
];

export default function ProfilePage() {
  return (
    <DashboardLayout>
      <div className="page-container max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-foreground mb-6">Profile</h1>

        {/* User Header */}
        <div className="border border-border bg-card p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-14 w-14 border border-border bg-accent flex items-center justify-center text-lg font-semibold text-foreground">
            U
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">User</h2>
            <p className="text-sm text-muted-foreground">Learning Hindi · Joined March 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="border border-border px-3 py-1 text-xs font-medium text-foreground bg-accent">
              Bronze
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border mb-6">
          {[
            { label: "Rank", value: "Bronze", icon: Trophy },
            { label: "Points", value: "10", icon: Star },
            { label: "Streak", value: "3 days", icon: Flame },
            { label: "Accuracy", value: "85%", icon: Target },
          ].map((s) => (
            <div key={s.label} className="bg-card p-4 flex flex-col items-center text-center">
              <s.icon className="h-4 w-4 text-muted-foreground mb-2" />
              <p className="text-lg font-semibold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <p className="section-title">Achievements</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((a) => (
              <div
                key={a.title}
                className={`border p-4 flex items-center gap-3 ${
                  a.unlocked ? "border-border bg-card" : "border-border bg-card opacity-50"
                }`}
              >
                <Award className={`h-5 w-5 shrink-0 ${a.unlocked ? "text-foreground" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Chart Placeholder */}
        <div className="panel mb-6">
          <p className="section-title">Weekly Progress</p>
          <div className="flex items-end gap-2 h-32">
            {[40, 65, 50, 80, 70, 90, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-foreground transition-all"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Set Daily Goals", icon: Flag },
            { label: "Backup Data", icon: Download },
            { label: "Reset Progress", icon: RotateCcw },
          ].map((a) => (
            <button
              key={a.label}
              className="border border-border bg-card p-4 flex items-center gap-3 text-sm text-foreground hover:bg-accent transition-colors"
            >
              <a.icon className="h-4 w-4 text-muted-foreground" />
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
