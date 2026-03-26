import { DashboardLayout } from "@/components/DashboardLayout";
import { Trophy, Flame, Target, Star, Award, Flag, Download, RotateCcw, Lock, Mail, Bell, Eye, EyeOff, User, Globe } from "lucide-react";
import { useState } from "react";

const achievements = [
  { title: "First Words", desc: "Spoke your first 10 words", unlocked: true },
  { title: "Week Warrior", desc: "7-day learning streak", unlocked: true },
  { title: "Sharp Ear", desc: "90%+ accuracy in Hear & Type", unlocked: false },
  { title: "Duel Master", desc: "Win 10 duels", unlocked: false },
];

const tabs = ["Overview", "Account", "Preferences"];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });

  return (
    <DashboardLayout>
      <div className="page-container max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold text-foreground mb-6">Profile & Settings</h1>

        {/* User Header */}
        <div className="border border-border bg-card p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-14 w-14 border border-border bg-accent flex items-center justify-center text-lg font-semibold text-foreground">
            U
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-foreground">User</h2>
            <p className="text-sm text-muted-foreground">user@example.com · Joined March 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="border border-border px-3 py-1 text-xs font-medium text-foreground bg-accent">
              Bronze
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "Overview" && (
          <>
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

            {/* Progress Chart */}
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

            {/* Quick Actions */}
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
          </>
        )}

        {/* Account Tab */}
        {activeTab === "Account" && (
          <div className="space-y-6">
            {/* Profile Info */}
            <div className="panel">
              <p className="section-title">Profile Information</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Display Name</label>
                  <div className="flex items-center border border-border bg-background px-3 py-2">
                    <User className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <input type="text" defaultValue="User" className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Email Address</label>
                  <div className="flex items-center border border-border bg-background px-3 py-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <input type="email" defaultValue="user@example.com" className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
                  </div>
                </div>
                <button className="border border-border bg-accent px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  Save Changes
                </button>
              </div>
            </div>

            {/* Change Password */}
            <div className="panel">
              <p className="section-title">Change Password</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Current Password</label>
                  <div className="flex items-center border border-border bg-background px-3 py-2">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
                    <button onClick={() => setShowPassword(!showPassword)} className="text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">New Password</label>
                  <div className="flex items-center border border-border bg-background px-3 py-2">
                    <Lock className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <input type={showNewPassword ? "text" : "password"} placeholder="••••••••" className="bg-transparent text-sm outline-none w-full text-foreground placeholder:text-muted-foreground" />
                    <button onClick={() => setShowNewPassword(!showNewPassword)} className="text-muted-foreground hover:text-foreground">
                      {showNewPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
                <button className="border border-border bg-accent px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  Update Password
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="panel border-destructive/30">
              <p className="section-title text-destructive">Danger Zone</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <button className="border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm text-destructive hover:bg-destructive/20 transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "Preferences" && (
          <div className="space-y-6">
            {/* Language */}
            <div className="panel">
              <p className="section-title">Language & Learning</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Learning Language</label>
                  <div className="flex items-center border border-border bg-background px-3 py-2">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <select className="bg-transparent text-sm outline-none w-full text-foreground cursor-pointer">
                      <option value="hindi">Hindi</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="japanese">Japanese</option>
                      <option value="korean">Korean</option>
                      <option value="german">German</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1.5">Daily Goal (minutes)</label>
                  <div className="flex items-center border border-border bg-background px-3 py-2">
                    <Target className="h-3.5 w-3.5 text-muted-foreground mr-2" />
                    <select className="bg-transparent text-sm outline-none w-full text-foreground cursor-pointer">
                      <option>10 minutes</option>
                      <option>20 minutes</option>
                      <option>30 minutes</option>
                      <option>60 minutes</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="panel">
              <p className="section-title">Notifications</p>
              <div className="space-y-3">
                {[
                  { key: "email" as const, label: "Email Notifications", desc: "Receive updates via email" },
                  { key: "push" as const, label: "Push Notifications", desc: "Browser push notifications" },
                  { key: "weekly" as const, label: "Weekly Reports", desc: "Weekly progress summary" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                      className={`w-10 h-5 border border-border rounded-full relative transition-colors ${notifications[item.key] ? "bg-foreground" : "bg-muted"}`}
                    >
                      <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all ${notifications[item.key] ? "right-0.5 bg-background" : "left-0.5 bg-muted-foreground"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button className="border border-border bg-accent px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              Save Preferences
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
