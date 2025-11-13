import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils/index.js';
import { Button } from '../components/ui/button.jsx';
import { BrainCircuit, Building, ArrowRight, BarChart3, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

const Feature = ({ icon: Icon, title, description }) => (
  <div style={{ textAlign: 'center' }}>
    <div style={{ width: 48, height: 48, background: '#dbeafe', color: '#2563eb', borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
      <Icon size={24} />
    </div>
    <h3 style={{ fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 8 }}>{title}</h3>
    <p style={{ color: '#475569' }}>{description}</p>
  </div>
);

export default function HomePage() {
  return (
    <div>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 896, margin: '0 auto', padding: '96px 24px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ textAlign: 'center' }}>
            <div style={{ width: 80, height: 80, margin: '0 auto 32px', background: 'linear-gradient(135deg,#10b981,#2563eb)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BrainCircuit size={40} color="#fff" />
            </div>
            <h1 style={{ fontSize: 48, fontWeight: 700, color: '#0f172a', margin: 0 }}>
              <span style={{ background: 'linear-gradient(90deg,#059669,#2563eb,#4f46e5)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                SkillSync
              </span>
            </h1>
            <p style={{ marginTop: 8, fontSize: 20, color: '#334155', fontWeight: 500 }}>Aligning Your Skills with Success</p>
            <p style={{ marginTop: 16, fontSize: 18, color: '#475569' }}>
              Go beyond simple keyword matching. Our AI-powered platform helps job seekers land their dream jobs and enables employers to find the perfect candidates.
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{ padding: '64px 0' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <BarChart3 size={40} color="#2563eb" style={{ marginBottom: 16 }} />
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>For Job Seekers</h2>
                <p style={{ color: '#475569', marginTop: 8, marginBottom: 24 }}>
                  Optimize your resume for any job description. Get an instant match score, tailored keyword suggestions, and AI-generated interview questions.
                </p>
                <Link to={createPageUrl('Analysis')}>
                  <Button size="lg" className="w-full">
                    Start Analyzing <ArrowRight size={16} style={{ marginLeft: 8 }} />
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                <Building size={40} color="#4f46e5" style={{ marginBottom: 16 }} />
                <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a' }}>For Employers</h2>
                <p style={{ color: '#475569', marginTop: 8, marginBottom: 24 }}>
                  Attract top talent by posting your vacancies on our platform. Clearly define your needs and reach a pool of qualified candidates.
                </p>
                <Link to={createPageUrl('PostVacancy')}>
                  <Button variant="secondary" size="lg" className="w-full">
                    Post a Job <ArrowRight size={16} style={{ marginLeft: 8 }} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '64px 0' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a' }}>A Smarter Way to Match</h2>
            <p style={{ fontSize: 18, color: '#475569', marginTop: 12 }}>Powerful tools for both sides of the hiring equation.</p>
          </div>
          <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr', }}>
            <Feature
              icon={BrainCircuit}
              title="Deep AI Analysis"
              description="Our AI goes beyond keywords to understand context, skills, and experience."
            />
            <Feature
              icon={Briefcase}
              title="Targeted Job Postings"
              description="Employers can define precise requirements to attract the best-fit applicants."
            />
            <Feature
              icon={BarChart3}
              title="Actionable Feedback"
              description="Get clear, specific suggestions to improve your resume and interview skills."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

