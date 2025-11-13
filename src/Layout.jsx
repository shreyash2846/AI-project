import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils/index.js";
import { 
  Brain, BarChart3, History, Briefcase, Menu, X, 
  User, Target, MessageCircle, TrendingUp, Bell,
  Users, FileText, Lightbulb, DollarSign
} from "lucide-react";
import { Button } from "./components/ui/button.jsx";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const candidateLinks = [
    { name: "Resume Analyzer", path: "Analysis", icon: BarChart3 },
    { name: "Resume Builder", path: "ResumeBuilder", icon: FileText },
    { name: "Skill Gap Analysis", path: "SkillGap", icon: Target },
    { name: "Mock Interviews", path: "MockInterview", icon: MessageCircle },
    { name: "Career Roadmap", path: "CareerRoadmap", icon: TrendingUp },
    { name: "Job Alerts", path: "JobAlerts", icon: Bell },
    { name: "Profile", path: "Profile", icon: User },
    { name: "History", path: "History", icon: History },
  ];

  const employerLinks = [
    { name: "Dashboard", path: "EmployerDashboard", icon: Briefcase },
    { name: "Post Vacancy", path: "PostVacancy", icon: FileText },
    { name: "AI Shortlisting", path: "AIShortlisting", icon: Users },
    { name: "Candidate Insights", path: "CandidateInsights", icon: BarChart3 },
    { name: "Interview Assistant", path: "InterviewAssistant", icon: MessageCircle },
    { name: "JD Optimizer", path: "JDOptimizer", icon: Lightbulb },
  ];

  const sharedLinks = [
    { name: "Salary Insights", path: "SalaryInsights", icon: DollarSign },
    { name: "Discussion Hub", path: "DiscussionHub", icon: MessageCircle },
  ];

  const isActive = (pageName) => location.pathname === createPageUrl(pageName);

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc', fontFamily: 'sans-serif' }}>
      <header style={{ background: 'rgba(255,255,255,0.9)', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
            <Link to={createPageUrl("Home")} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{ width: 40, height: 40, background: 'linear-gradient(135deg, #10b981, #2563eb)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={20} color="#fff" />
              </div>
              <div>
                <h1 style={{ fontSize: 18, fontWeight: 700, background: 'linear-gradient(90deg,#059669,#2563eb,#4f46e5)', WebkitBackgroundClip: 'text', color: 'transparent', margin: 0 }}>
                  SkillSync
                </h1>
                <p style={{ fontSize: 12, color: '#64748b', margin: 0, marginTop: -4 }}>Aligning Skills with Success</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-2" style={{ display: 'none' }}>
              <Link to={createPageUrl("Analysis")}>
                <Button variant={isActive("Analysis") ? 'default' : 'outline'} size="sm">
                  Resume Analyzer
                </Button>
              </Link>
              <Link to={createPageUrl("SkillGap")}>
                <Button variant={isActive("SkillGap") ? 'default' : 'outline'} size="sm">
                  Skills
                </Button>
              </Link>
              <Link to={createPageUrl("DiscussionHub")}>
                <Button variant={isActive("DiscussionHub") ? 'default' : 'outline'} size="sm">
                  Community
                </Button>
              </Link>
              <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 8px' }} />
              <Link to={createPageUrl("EmployerDashboard")}>
                <Button variant="outline" size="sm">
                  For Employers
                  <Briefcase size={16} style={{ marginLeft: 8 }} />
                </Button>
              </Link>
            </nav>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 50 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'absolute', top: 0, right: 0, height: '100%', width: 320, background: '#fff', padding: 16, overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', margin: 0 }}>Navigation</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <nav style={{ display: 'grid', gap: 24 }}>
                <div>
                  <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>For Candidates</p>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {candidateLinks.map(link => (
                      <Link key={link.path} to={createPageUrl(link.path)} onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, color: '#334155', border: '1px solid #e2e8f0' }}>
                          <link.icon className="w-4 h-4"/>
                          {link.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>For Employers</p>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {employerLinks.map(link => (
                      <Link key={link.path} to={createPageUrl(link.path)} onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, color: '#334155', border: '1px solid #e2e8f0' }}>
                          <link.icon className="w-4 h-4"/>
                          {link.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: 12 }}>Shared Tools</p>
                  <div style={{ display: 'grid', gap: 6 }}>
                    {sharedLinks.map(link => (
                      <Link key={link.path} to={createPageUrl(link.path)} onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', borderRadius: 8, color: '#334155', border: '1px solid #e2e8f0' }}>
                          <link.icon className="w-4 h-4"/>
                          {link.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>{children}</main>
    </div>
  );
}

