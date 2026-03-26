import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Search, ChevronDown, Globe, User, LogOut, X, Sun, Moon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const languages = ["Hindi", "English", "Spanish", "French", "Japanese", "Mandarin", "Korean", "German"];

const searchItems = [
  { label: "Home", url: "/" },
  { label: "Live Speaker", url: "/live-speaker" },
  { label: "Mistakes", url: "/mistakes" },
  { label: "Dueling", url: "/dueling" },
  { label: "Hear & Type", url: "/hear-and-type" },
  { label: "Pronouncer", url: "/pronouncer" },
  { label: "Profile", url: "/profile" },
  { label: "Daily Goals", url: "/profile" },
  { label: "Progress", url: "/profile" },
];

function getInitialTheme(): "dark" | "light" {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") return stored;
  }
  return "dark";
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("Hindi");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">(getInitialTheme);
  const navigate = useNavigate();
  const langRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredSearch = searchQuery.trim()
    ? searchItems.filter((s) => s.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-background shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              {/* Search */}
              <div ref={searchRef} className="relative hidden sm:block">
                <div className={`flex items-center border bg-card px-3 py-1.5 w-80 transition-colors ${searchFocused ? "border-muted-foreground" : "border-border"}`}>
                  <Search className="h-3.5 w-3.5 text-muted-foreground mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search or ask anything…"
                    className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground text-foreground"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                {searchFocused && filteredSearch.length > 0 && (
                  <div className="dropdown-menu left-0 right-0 w-full">
                    {filteredSearch.map((item) => (
                      <div
                        key={item.label}
                        className="dropdown-item"
                        onClick={() => {
                          navigate(item.url);
                          setSearchQuery("");
                          setSearchFocused(false);
                        }}
                      >
                        <Search className="h-3 w-3" />
                        {item.label}
                      </div>
                    ))}
                  </div>
                )}
                {searchFocused && searchQuery && filteredSearch.length === 0 && (
                  <div className="dropdown-menu left-0 right-0 w-full">
                    <div className="px-4 py-3 text-xs text-muted-foreground">No results found</div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                className="topbar-btn"
                onClick={toggleTheme}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </button>

              {/* Language Selector */}
              <div ref={langRef} className="relative">
                <button className="topbar-btn" onClick={() => { setLangOpen(!langOpen); setProfileOpen(false); }}>
                  <Globe className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">{selectedLang}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {langOpen && (
                  <div className="dropdown-menu">
                    <div className="px-4 py-2 text-xs text-muted-foreground uppercase tracking-widest border-b border-border">Language</div>
                    {languages.map((lang) => (
                      <div
                        key={lang}
                        className={`dropdown-item ${lang === selectedLang ? "text-foreground bg-accent" : ""}`}
                        onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                      >
                        {lang}
                        {lang === selectedLang && <span className="ml-auto text-xs">✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile */}
              <div ref={profileRef} className="relative">
                <button
                  className="h-8 w-8 border border-border bg-accent flex items-center justify-center text-xs font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => { setProfileOpen(!profileOpen); setLangOpen(false); }}
                >
                  U
                </button>
                {profileOpen && (
                  <div className="dropdown-menu">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-medium text-foreground">User</p>
                      <p className="text-xs text-muted-foreground">user@example.com</p>
                    </div>
                    <div className="dropdown-item" onClick={() => { navigate("/profile"); setProfileOpen(false); }}>
                      <User className="h-3.5 w-3.5" /> Profile & Settings
                    </div>
                    <div className="border-t border-border">
                      <div className="dropdown-item text-destructive" onClick={() => { navigate("/login"); setProfileOpen(false); }}>
                        <LogOut className="h-3.5 w-3.5" /> Log out
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
