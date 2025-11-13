import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Brain, BarChart3, History, Briefcase, Menu, X, 
  User, Target, MessageCircle, TrendingUp, Bell,
  Users, FileText, Lightbulb, DollarSign
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children, currentPageName }) {
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
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all duration-200">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  SkillSync
                </h1>
                <p className="text-xs text-slate-500 -mt-1">Aligning Skills with Success</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-2">
              <Link to={createPageUrl("Analysis")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("Analysis") ? "text-blue-700 bg-blue-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Resume Analyzer
              </Link>
              <Link to={createPageUrl("SkillGap")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("SkillGap") ? "text-blue-700 bg-blue-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Skills
              </Link>
              <Link to={createPageUrl("DiscussionHub")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive("DiscussionHub") ? "text-blue-700 bg-blue-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                Community
              </Link>
              <div className="w-px h-6 bg-slate-200 mx-2"></div>
              <Link to={createPageUrl("EmployerDashboard")}>
                <Button variant="outline" size="sm">
                  For Employers
                  <Briefcase className="w-4 h-4 ml-2"/>
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 h-full w-80 bg-white p-4 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-slate-800">Navigation</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <nav className="space-y-6">
                <div>
                  <p className="font-semibold text-slate-800 mb-3">For Candidates</p>
                  <div className="space-y-1">
                    {candidateLinks.map(link => (
                      <Link key={link.path} to={createPageUrl(link.path)} onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-3 py-2 flex items-center gap-3 text-sm font-medium rounded-md transition-colors ${
                          isActive(link.path) ? "text-blue-700 bg-blue-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <link.icon className="w-4 h-4"/>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 mb-3">For Employers</p>
                  <div className="space-y-1">
                    {employerLinks.map(link => (
                      <Link key={link.path} to={createPageUrl(link.path)} onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-3 py-2 flex items-center gap-3 text-sm font-medium rounded-md transition-colors ${
                          isActive(link.path) ? "text-blue-700 bg-blue-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <link.icon className="w-4 h-4"/>
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 mb-3">Shared Tools</p>
                  <div className="space-y-1">
                    {sharedLinks.map(link => (
                      <Link key={link.path} to={createPageUrl(link.path)} onClick={() => setIsMobileMenuOpen(false)}
                        className={`px-3 py-2 flex items-center gap-3 text-sm font-medium rounded-md transition-colors ${
                          isActive(link.path) ? "text-blue-700 bg-blue-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <link.icon className="w-4 h-4"/>
                        {link.name}
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