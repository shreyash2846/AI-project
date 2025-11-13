import React, { useState } from 'react';
import { ResumeAnalysis } from '../entities/ResumeAnalysis.js';
import { UploadFile, ExtractDataFromUploadedFile, InvokeLLM } from '../integrations/core.js';
import {
  AlertCircle,
  Brain,
  ClipboardCheck,
  FileText,
  Sparkles,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  ListChecks
} from 'lucide-react';
import { Alert, AlertDescription } from '../components/ui/alert.jsx';
import { motion, AnimatePresence } from 'framer-motion';

import FileUploader from '../components/analysis/FileUploader.jsx';
import JobDescriptionInput from '../components/analysis/JobDescriptionInput.jsx';
import AnalysisProgress from '../components/analysis/AnalysisProgress.jsx';
import ResultsDisplay from '../components/analysis/ResultsDisplay.jsx';

export default function AnalysisPage() {
  const [currentStep, setCurrentStep] = useState('upload');
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    resumeFile: null,
    resumeUrl: ''
  });
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');

  const wizardSteps = [
    { key: 'upload', title: 'Upload Resume', description: 'Securely add your latest PDF resume.' },
    { key: 'analyzing', title: 'AI Analysis', description: 'We interpret your resume and job brief.' },
    { key: 'results', title: 'Insights & Prep', description: 'Review tailored guidance and next steps.' }
  ];

  const deliverables = [
    {
      icon: BarChart3,
      title: 'Match Score Dashboard',
      description: 'See how each section of your resume aligns with the role and where to focus revisions.'
    },
    {
      icon: MessageSquare,
      title: 'Interview Playbook',
      description: 'Receive curated questions with talking points so you can rehearse with confidence.'
    },
    {
      icon: ListChecks,
      title: 'Action Checklist',
      description: 'Follow a prioritized roadmap covering keywords, skill gaps, and suggested enhancements.'
    }
  ];

  const handleFileUpload = (file) => {
    setFormData((prev) => ({ ...prev, resumeFile: file }));
    setError('');
  };

  const handleJobDescriptionChange = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const startAnalysis = async () => {
    if (!formData.resumeFile || !formData.jobDescription.trim()) {
      setError('Please upload a resume and provide a job description');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError('');
    setCurrentStep('analyzing');

    try {
      setProgressMessage('Uploading your resume...');
      setProgress(20);
      const { file_url } = await UploadFile({ file: formData.resumeFile });
      setFormData((prev) => ({ ...prev, resumeUrl: file_url }));

      setProgressMessage('Reading and analyzing resume content...');
      setProgress(40);
      const extractResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: 'object',
          properties: {
            text_content: { type: 'string' }
          }
        }
      });

      if (extractResult.status !== 'success') {
        throw new Error('Failed to read resume content');
      }

      const resumeText = extractResult.output?.text_content || '';

      setProgressMessage('AI is analyzing your resume match...');
      setProgress(70);

      const analysisResult = await InvokeLLM({
        prompt: `You are an expert resume analyzer and career consultant. Analyze how well this resume matches the given job description.

RESUME CONTENT:
${resumeText}

JOB DESCRIPTION:
${formData.jobDescription}

Please provide a comprehensive analysis with:
1. Overall match score (0-100)
2. Key strengths that align with the job
3. Missing keywords that should be added
4. Specific recommendations for improvement
5. Skill gaps to address

Be specific and actionable in your recommendations.`,
        response_json_schema: {
          type: 'object',
          properties: {
            match_score: { type: 'number' },
            strengths: {
              type: 'array',
              items: { type: 'string' }
            },
            missing_keywords: {
              type: 'array',
              items: { type: 'string' }
            },
            recommendations: {
              type: 'array',
              items: { type: 'string' }
            },
            skill_gaps: {
              type: 'array',
              items: { type: 'string' }
            },
            summary: { type: 'string' }
          }
        }
      });

      setProgressMessage('Preparing interview questions...');
      setProgress(90);

      const interviewResult = await InvokeLLM({
        prompt: `Based on this job description, generate 8-10 likely interview questions that candidates should prepare for:

JOB DESCRIPTION:
${formData.jobDescription}

Provide a mix of:
- Technical/skill-based questions
- Behavioral questions
- Company/role-specific questions
- Situational questions

Make them realistic and commonly asked in interviews.`,
        response_json_schema: {
          type: 'object',
          properties: {
            questions: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        }
      });

      setProgressMessage('Saving your analysis...');
      setProgress(100);

      const savedAnalysis = await ResumeAnalysis.create({
        job_title: formData.jobTitle,
        company_name: formData.companyName,
        job_description: formData.jobDescription,
        resume_url: file_url,
        resume_text: resumeText,
        match_score: analysisResult.match_score,
        analysis_results: {
          strengths: analysisResult.strengths,
          missing_keywords: analysisResult.missing_keywords,
          recommendations: analysisResult.recommendations,
          skill_gaps: analysisResult.skill_gaps,
          summary: analysisResult.summary
        },
        interview_questions: interviewResult.questions,
        status: 'completed'
      });

      setAnalysis(savedAnalysis);
      setCurrentStep('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError('Analysis failed. Please try again.');
      setCurrentStep('upload');
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const startNewAnalysis = () => {
    setCurrentStep('upload');
    setFormData({
      jobTitle: '',
      companyName: '',
      jobDescription: '',
      resumeFile: null,
      resumeUrl: ''
    });
    setAnalysis(null);
    setError('');
    setProgress(0);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div className="max-w-5xl mx-auto" style={{ maxWidth: 1120, margin: '0 auto' }}>
        <div className="text-center mb-12" style={{ textAlign: 'center', marginBottom: 48 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div
              className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
              style={{
                width: 64,
                height: 64,
                margin: '0 auto 16px',
                background: 'linear-gradient(135deg,#10b981,#2563eb)',
                borderRadius: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 60px rgba(37,99,235,0.25)'
              }}
            >
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontSize: 34, fontWeight: 700, marginBottom: 16 }}>
              <span
                className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg,#059669,#2563eb)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent'
                }}
              >
                TalentBridge AI
              </span>
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto" style={{ fontSize: 18, color: '#475569', maxWidth: 640, margin: '0 auto' }}>
              Get an instant match score, keyword suggestions, and interview prep tailored to your target job
            </p>
          </motion.div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6" style={{ marginBottom: 24 }}>
            <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </div>
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {currentStep === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
              style={{ display: 'grid', rowGap: 32 }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: 28,
                  flexWrap: 'wrap',
                  alignItems: 'stretch',
                  justifyContent: 'center'
                }}
              >
                <motion.div
                  style={{ flex: '1 1 560px', minWidth: 480, display: 'grid', rowGap: 28 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <div
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: 16,
                      padding: 20,
                      background: '#ffffff',
                      boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg,#10b981,rgba(37,99,235,0.85))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <ClipboardCheck size={18} color="#fff" />
                      </div>
                      <div>
                        <span style={{ fontSize: 12, letterSpacing: 1.2, fontWeight: 600, textTransform: 'uppercase', color: '#059669' }}>
                          Step 1 of 3
                        </span>
                        <h2 style={{ margin: 4, fontSize: 22, fontWeight: 600, color: '#0f172a' }}>Upload & Brief</h2>
                        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
                          Share your resume and target role so we can tailor the analysis to your aspirations.
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gap: 12,
                        marginTop: 12,
                        paddingTop: 12,
                        borderTop: '1px dashed #e2e8f0'
                      }}
                    >
                      {wizardSteps.map((step, index) => {
                        const isActive = step.key === currentStep;
                        const currentIndex = wizardSteps.findIndex((s) => s.key === currentStep);
                        const isCompleted = index < currentIndex;
                        return (
                          <div key={step.key} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: 999,
                                border: '2px solid',
                                borderColor: isActive ? '#2563eb' : isCompleted ? '#10b981' : '#cbd5f5',
                                background: isCompleted ? '#10b981' : '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: isCompleted ? '#fff' : isActive ? '#2563eb' : '#94a3b8',
                                fontWeight: 600,
                                fontSize: 12
                              }}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p style={{ margin: 0, fontWeight: 600, color: isActive ? '#0f172a' : '#334155', fontSize: 14 }}>{step.title}</p>
                              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{step.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <FileUploader onFileSelect={handleFileUpload} selectedFile={formData.resumeFile} />
                  <JobDescriptionInput
                    data={formData}
                    onChange={handleJobDescriptionChange}
                    onAnalyze={startAnalysis}
                    isProcessing={isProcessing}
                    isValid={formData.resumeFile && formData.jobDescription.trim()}
                  />
                </motion.div>

                <motion.aside
                  style={{
                    flex: '0 1 320px',
                    minWidth: 280,
                    borderRadius: 20,
                    padding: 24,
                    background: 'linear-gradient(160deg, rgba(16,185,129,0.15), rgba(37,99,235,0.18))',
                    border: '1px solid rgba(37,99,235,0.2)',
                    boxShadow: '0 16px 45px rgba(37, 99, 235, 0.18)',
                    maxHeight: 520,
                    overflowY: 'auto'
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 14,
                        backdropFilter: 'blur(6px)',
                        background: 'rgba(255,255,255,0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Sparkles size={24} color="#2563eb" />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 12, letterSpacing: 1.1, textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>Pro Tips</p>
                      <h3 style={{ margin: 2, fontSize: 18, color: '#0f172a' }}>Get the most from your analysis</h3>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 14 }}>
                    {[
                      {
                        title: '1️⃣ Keep it current',
                        description:
                          'Upload the latest version of your resume and make sure every new skill, certification, and key project is reflected. Regular updates keep your profile relevant and competitive.'
                      },
                      {
                        title: '2️⃣ Paste the full job details',
                        description:
                          'Include not just the job description but also company values, preferred skills, and tone of communication — this helps the AI tailor your recommendations for both technical fit and cultural alignment.'
                      },
                      {
                        title: '3️⃣ Aim for specificity',
                        description:
                          'Use metrics, tools, and outcomes: e.g., “Increased process efficiency by 25% using Python automation”. The more specific your examples, the more precise your analysis.'
                      },
                      {
                        title: '4️⃣ Highlight measurable impact',
                        description:
                          'Mention quantifiable results — percentages, revenue growth, reduced costs, improved performance, or project delivery time. These make your achievements stand out.'
                      },
                      {
                        title: '5️⃣ Tailor for each role',
                        description:
                          'Slightly adjust your resume for every application. Align your keywords with the exact language used in the job post for a stronger match score.'
                      },
                      {
                        title: '6️⃣ Showcase your personality',
                        description:
                          'Add brief mentions of teamwork, leadership, adaptability, and creativity. Recruiters value human traits as much as technical expertise.'
                      },
                      {
                        title: '7️⃣ Optimize formatting',
                        description:
                          'Keep it clean, consistent, and ATS-friendly. Avoid tables or graphics that might confuse resume scanners.'
                      },
                      {
                        title: '8️⃣ Add a short professional summary',
                        description:
                          'Include a 2-3 line statement at the top of your resume highlighting your experience level, domain expertise, and career goals — it sets the tone for your profile.'
                      },
                      {
                        title: '9️⃣ Leverage keywords strategically',
                        description:
                          'Research and include industry-specific keywords (e.g., “data visualization,” “predictive analytics,” “cross-functional collaboration”) to pass automated screenings.'
                      },
                      {
                        title: '🔟 Review tone and clarity',
                        description:
                          'Ensure every statement is active and confident — verbs like “led,” “developed,” “implemented,” “optimized” make your experience sound more impactful.'
                      }
                    ].map((tip, index) => (
                      <motion.div
                        key={tip.title}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + index * 0.05 }}
                        style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                      >
                        <Sparkles size={18} color={index % 2 === 0 ? '#059669' : '#2563eb'} style={{ marginTop: 2 }} />
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{tip.title}</p>
                          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#334155' }}>{tip.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.aside>
              </div>

              <motion.div
                style={{
                  borderRadius: 18,
                  padding: 28,
                  background: 'linear-gradient(140deg, rgba(15,118,110,0.12), rgba(37,99,235,0.18))',
                  border: '1px solid rgba(15,118,110,0.18)',
                  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.18)'
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 20 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.4, color: '#0f766e', fontWeight: 600 }}>
                      What you’ll unlock
                    </p>
                    <h3 style={{ margin: '6px 0', fontSize: 22, color: '#0f172a', fontWeight: 600 }}>
                      A complete suite of AI-powered career insights
                    </h3>
                    <p style={{ margin: 0, fontSize: 14, color: '#1e293b', maxWidth: 520 }}>
                      Within a couple of minutes you’ll receive a detailed dossier covering alignment scores, keyword intelligence, skill coaching,
                      and interview preparation materials—all tailored to the role you’ve specified.
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                    style={{
                      minWidth: 220,
                      padding: 16,
                      borderRadius: 16,
                      background: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(148,163,184,0.4)',
                      backdropFilter: 'blur(8px)'
                    }}
                  >
                    <p style={{ margin: '0 0 8px', fontSize: 13, color: '#2563eb', fontWeight: 600 }}>Estimated turn-around</p>
                    <h4 style={{ margin: '0 0 12px', fontSize: 28, fontWeight: 700, color: '#0f172a' }}>&lt; 2 minutes</h4>
                    <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', rowGap: 6, fontSize: 12, color: '#334155' }}>
                      <li>Processing runs securely in the background.</li>
                      <li>Progress updates keep you informed at each milestone.</li>
                      <li>Results download-ready for future applications.</li>
                    </ul>
                  </motion.div>
                </div>

                <div style={{ display: 'grid', gap: 18, gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))' }}>
                  {deliverables.map((item, idx) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.08 }}
                      whileHover={{ translateY: -6 }}
                      style={{
                        borderRadius: 16,
                        padding: 18,
                        background: 'rgba(255,255,255,0.82)',
                        border: '1px solid rgba(148,163,184,0.35)',
                        boxShadow: '0 18px 35px rgba(15, 23, 42, 0.12)',
                        display: 'grid',
                        gap: 10
                      }}
                    >
                      <div
                        style={{
                          width: 42,
                          height: 42,
                          borderRadius: 12,
                          background: 'rgba(37,99,235,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <item.icon size={20} color="#2563eb" />
                      </div>
                      <div>
                        <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 600, color: '#0f172a' }}>{item.title}</h4>
                        <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 'analyzing' && (
            <motion.div key="analyzing" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
              <AnalysisProgress progress={progress} message={progressMessage} />
            </motion.div>
          )}

          {currentStep === 'results' && analysis && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <ResultsDisplay analysis={analysis} onNewAnalysis={startNewAnalysis} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

