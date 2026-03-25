import { DashboardLayout } from "@/components/DashboardLayout";
import { Mic, Headphones, Volume2, AlertCircle, Swords, BarChart3, ArrowRight, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  { title: "Live Speaker", desc: "Practice real-time conversations with AI", icon: Mic, url: "/live-speaker" },
  { title: "Hear & Type", desc: "Listen to phrases and type what you hear", icon: Headphones, url: "/hear-and-type" },
  { title: "Pronouncer", desc: "Perfect your pronunciation word by word", icon: Volume2, url: "/pronouncer" },
  { title: "Solving Mistakes", desc: "Review and practice your weak areas", icon: AlertCircle, url: "/mistakes" },
  { title: "Dueling Friends", desc: "Challenge friends to language battles", icon: Swords, url: "/dueling" },
  { title: "Progress Tracking", desc: "Monitor your learning journey", icon: BarChart3, url: "/profile" },
];

const testimonials = [
  { name: "Sarah K.", text: "This platform transformed how I learn Hindi. The AI conversations feel incredibly natural.", role: "Software Engineer" },
  { name: "James M.", text: "The pronunciation tool is exceptional. My accent has improved dramatically in just weeks.", role: "University Student" },
  { name: "Priya R.", text: "Finally a language platform that feels professional, not gamified. Perfect for serious learners.", role: "Business Analyst" },
];

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="page-container max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-semibold tracking-tight text-foreground mb-3">
            AI-Powered Language Learning Platform
          </h1>
          <p className="text-muted-foreground text-base max-w-2xl leading-relaxed">
            Master new languages through intelligent conversations, precision pronunciation training,
            and adaptive exercises — all powered by advanced AI.
          </p>
          <Link
            to="/live-speaker"
            className="inline-flex items-center gap-2 mt-6 bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Start Learning
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-12">
          <p className="section-title">Features</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border border border-border">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <Link to={f.url} className="feature-card block bg-card">
                  <f.icon className="h-5 w-5 text-foreground mb-3" />
                  <h3 className="text-sm font-medium text-foreground mb-1">{f.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-12">
          <p className="section-title">What learners say</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="panel">
                <Quote className="h-4 w-4 text-muted-foreground mb-3" />
                <p className="text-sm text-foreground leading-relaxed mb-4">"{t.text}"</p>
                <div>
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
