import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Badge } from '../ui/badge.jsx';
import { Progress } from '../ui/progress.jsx';
import { Target, TrendingUp, AlertTriangle, CheckCircle, KeyRound, MessageCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const ScoreCircle = ({ score, colors }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - ((score || 0) / 100) * circumference;

  return (
    <div className="relative w-40 h-40" style={{ position: 'relative', width: 160, height: 160 }}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <circle className="text-slate-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
        <motion.circle
          className={colors.text}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r="45"
          cx="50"
          cy="50"
          transform="rotate(-90 50 50)"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span className={`text-4xl font-bold ${colors.text}`} style={{ fontSize: 36, fontWeight: 700 }}>
          {Math.round(score || 0)}
        </span>
        <span className="text-sm font-medium text-slate-500" style={{ fontSize: 14, color: '#94a3b8' }}>
          Match %
        </span>
      </div>
    </div>
  );
};

export default function ResultsDisplay({ analysis, onNewAnalysis }) {
  const getScoreColor = (score) => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' };
    if (score >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' };
    return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' };
  };

  const scoreColors = getScoreColor(analysis.match_score || 0);

  return (
    <div className="space-y-8" style={{ display: 'grid', rowGap: 32 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="bg-gradient-to-br from-white to-slate-50/50">
          <CardContent className="p-8 text-center" style={{ padding: 32, textAlign: 'center' }}>
            <h2 className="text-3xl font-bold text-slate-800 mb-1" style={{ fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
              Analysis Complete
            </h2>
            {analysis.job_title && (
              <p className="text-slate-600 mb-6" style={{ color: '#475569', marginBottom: 24 }}>
                Your resume match for <span className="font-medium text-blue-600">{analysis.job_title}</span>
              </p>
            )}
            <div className="flex justify-center mb-6" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
              <ScoreCircle score={analysis.match_score} colors={scoreColors} />
            </div>

            <p className="max-w-xl mx-auto text-slate-700" style={{ maxWidth: 560, margin: '0 auto', color: '#334155' }}>
              {analysis.analysis_results?.summary || "Here's a breakdown of how your resume aligns with the job requirements."}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ display: 'grid', gap: 24 }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#047857' }}>
                <CheckCircle className="w-5 h-5" />
                Your Strengths ({analysis.analysis_results?.strengths?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.analysis_results?.strengths?.length > 0 ? (
                <ul className="space-y-3" style={{ display: 'grid', rowGap: 12 }}>
                  {analysis.analysis_results.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" style={{ width: 6, height: 6, background: '#22c55e', borderRadius: 9999, marginTop: 8 }} />
                      <span className="text-slate-700" style={{ color: '#334155' }}>
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic" style={{ color: '#64748b', fontStyle: 'italic' }}>
                  No specific strengths identified
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#c2410c' }}>
                <KeyRound className="w-5 h-5" />
                Missing Keywords ({analysis.analysis_results?.missing_keywords?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.analysis_results?.missing_keywords?.length > 0 ? (
                <div className="flex flex-wrap gap-2" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {analysis.analysis_results.missing_keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic" style={{ color: '#64748b', fontStyle: 'italic' }}>
                  All key terms are present
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#1d4ed8' }}>
                <TrendingUp className="w-5 h-5" />
                Recommendations ({analysis.analysis_results?.recommendations?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.analysis_results?.recommendations?.length > 0 ? (
                <ul className="space-y-3" style={{ display: 'grid', rowGap: 12 }}>
                  {analysis.analysis_results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" style={{ width: 6, height: 6, background: '#3b82f6', borderRadius: 9999, marginTop: 8 }} />
                      <span className="text-slate-700" style={{ color: '#334155' }}>
                        {recommendation}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic" style={{ color: '#64748b', fontStyle: 'italic' }}>
                  No specific recommendations
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b91c1c' }}>
                <AlertTriangle className="w-5 h-5" />
                Skill Gaps ({analysis.analysis_results?.skill_gaps?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analysis.analysis_results?.skill_gaps?.length > 0 ? (
                <ul className="space-y-3" style={{ display: 'grid', rowGap: 12 }}>
                  {analysis.analysis_results.skill_gaps.map((gap, index) => (
                    <li key={index} className="flex items-start gap-2" style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" style={{ width: 6, height: 6, background: '#ef4444', borderRadius: 9999, marginTop: 8 }} />
                      <span className="text-slate-700" style={{ color: '#334155' }}>
                        {gap}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 italic" style={{ color: '#64748b', fontStyle: 'italic' }}>
                  No significant skill gaps identified
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#7c3aed' }}>
              <MessageCircle className="w-5 h-5" />
              Likely Interview Questions ({analysis.interview_questions?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.interview_questions?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ display: 'grid', gap: 16 }}>
                {analysis.interview_questions.map((question, index) => (
                  <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-100" style={{ padding: 16, background: '#f3e8ff', borderRadius: 12, border: '1px solid #e9d5ff' }}>
                    <span className="text-slate-700" style={{ color: '#334155' }}>
                      {question}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic" style={{ color: '#64748b', fontStyle: 'italic' }}>
                No interview questions generated
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center" style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center' }}>
        <Button onClick={onNewAnalysis} className="bg-blue-600 hover:bg-blue-700 text-white" style={{ background: '#2563eb', color: '#fff' }}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Analyze Another Resume
        </Button>
        {analysis.resume_url && (
          <Button variant="outline" asChild>
            <a href={analysis.resume_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
              <ExternalLink className="w-4 h-4 mr-2" />
              View Original Resume
            </a>
          </Button>
        )}
      </motion.div>
    </div>
  );
}

