import React, { useState } from 'react';
import { MockInterview } from '../entities/MockInterview.js';
import { InvokeLLM } from '../integrations/core.js';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Input } from '../components/ui/input.jsx';
import { Label } from '../components/ui/label.jsx';
import { Textarea } from '../components/ui/textarea.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Progress } from '../components/ui/progress.jsx';
import { MessageCircle, Play, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MockInterviewPage() {
  const [jobRole, setJobRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [responses, setResponses] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [finalResults, setFinalResults] = useState(null);
  const [stage, setStage] = useState('setup'); // setup, interview, results

  const generateQuestions = async () => {
    if (!jobRole.trim()) return;

    setIsGenerating(true);
    try {
      const result = await InvokeLLM({
        prompt: 'generate_questions',
        payload: { jobRole }
      });

      setQuestions(result.questions || []);
      setStage('interview');
    } catch (error) {
      console.error('Failed to generate questions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!currentAnswer.trim()) return;

    setIsAnalyzing(true);
    try {
      const feedback = await InvokeLLM({
        prompt: 'evaluate_answer',
        payload: {
          jobRole,
          question: questions[currentQuestionIndex],
          answer: currentAnswer
        }
      });

      const newResponse = {
        question: questions[currentQuestionIndex],
        answer: currentAnswer,
        feedback: feedback.feedback,
        score: feedback.score,
        strengths: feedback.strengths,
        improvements: feedback.improvements
      };

      const nextResponses = [...responses, newResponse];
      setResponses(nextResponses);
      setCurrentAnswer('');

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        const averageScore =
          nextResponses.reduce((sum, r) => sum + (r.score || 0), 0) / Math.max(nextResponses.length, 1);

        const finalAnalysis = await MockInterview.create({
          job_role: jobRole,
          questions,
          responses: nextResponses,
          overall_score: averageScore,
          improvement_areas: nextResponses.flatMap((r) => r.improvements || [])
        });

        setFinalResults(finalAnalysis);
        setStage('results');
      }
    } catch (error) {
      console.error('Failed to analyze answer:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startNewInterview = () => {
    setStage('setup');
    setJobRole('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setCurrentAnswer('');
    setResponses([]);
    setFinalResults(null);
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ minHeight: '100vh', padding: '32px 16px' }}>
      <div className="max-w-4xl mx-auto" style={{ maxWidth: 960, margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              width: 64,
              height: 64,
              background: 'linear-gradient(135deg,#a855f7,#ec4899)',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <MessageCircle className="w-8 h-8 text-white" style={{ width: 32, height: 32, color: '#fff' }} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800" style={{ fontSize: 28, fontWeight: 700, color: '#0f172a' }}>
            Mock Interview Assistant
          </h1>
          <p className="text-slate-600 mt-2" style={{ color: '#475569', marginTop: 8 }}>
            Practice with AI-generated questions and get instant feedback
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {stage === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Start Your Mock Interview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobRole">Job Role/Position</Label>
                    <Input
                      id="jobRole"
                      placeholder="e.g. Software Engineer, Product Manager"
                      value={jobRole}
                      onChange={(e) => setJobRole(e.target.value)}
                    />
                  </div>
                  <Button onClick={generateQuestions} disabled={isGenerating || !jobRole.trim()} className="w-full">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating Questions...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Start Mock Interview
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {stage === 'interview' && (
            <motion.div key="interview" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="space-y-6" style={{ display: 'grid', rowGap: 24 }}>
                <div className="flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 className="text-xl font-semibold" style={{ fontSize: 20, fontWeight: 600 }}>
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </h3>
                    <p className="text-slate-600" style={{ color: '#475569' }}>
                      For: {jobRole}
                    </p>
                  </div>
                  <div style={{ width: 128 }}>
                    <Progress value={(currentQuestionIndex / Math.max(questions.length, 1)) * 100} />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg" style={{ fontSize: 18 }}>
                      {questions[currentQuestionIndex]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="answer">Your Answer</Label>
                      <Textarea
                        id="answer"
                        placeholder="Take your time to provide a thoughtful answer..."
                        value={currentAnswer}
                        onChange={(e) => setCurrentAnswer(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <Button onClick={submitAnswer} disabled={isAnalyzing || !currentAnswer.trim()} className="w-full">
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing Answer...
                        </>
                      ) : (
                        <>
                          {currentQuestionIndex < questions.length - 1 ? (
                            <>
                              <ArrowRight className="w-4 h-4 mr-2" />
                              Next Question
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Complete Interview
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {responses.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Previous Responses</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4" style={{ display: 'grid', rowGap: 16 }}>
                        {responses.map((response, index) => (
                          <div key={index} className="p-4 border rounded-lg" style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 16 }}>
                            <div
                              className="flex items-center justify-between mb-2"
                              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}
                            >
                              <h4 className="font-medium" style={{ fontWeight: 600 }}>
                                Question {index + 1}
                              </h4>
                              <Badge
                                className={`${
                                  response.score >= 8 ? 'bg-green-100 text-green-800' : response.score >= 6 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {response.score}/10
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600" style={{ fontSize: 14, color: '#475569', marginBottom: 8 }}>
                              {response.question}
                            </p>
                            <p className="text-sm" style={{ fontSize: 14 }}>{response.feedback}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          )}

          {stage === 'results' && finalResults && (
            <motion.div key="results" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="space-y-6" style={{ display: 'grid', rowGap: 24 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      Interview Complete!
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center mb-6" style={{ textAlign: 'center', marginBottom: 24 }}>
                      <div className="text-4xl font-bold text-slate-800 mb-2" style={{ fontSize: 32, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
                        {finalResults.overall_score?.toFixed(1)}/10
                      </div>
                      <p className="text-slate-600" style={{ color: '#475569' }}>
                        Overall Performance
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gap: 24 }}>
                      <div>
                        <h4 className="font-semibold mb-3" style={{ fontWeight: 600, marginBottom: 12 }}>
                          Your Responses
                        </h4>
                        <div className="space-y-3" style={{ display: 'grid', rowGap: 12 }}>
                          {finalResults.responses?.map((response, index) => (
                            <div key={index} className="p-3 border rounded-lg" style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: 12 }}>
                              <div
                                className="flex items-center justify-between mb-2"
                                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}
                              >
                                <span className="font-medium" style={{ fontWeight: 600 }}>
                                  Q{index + 1}
                                </span>
                                <Badge variant="outline">{response.score}/10</Badge>
                              </div>
                              <p className="text-sm text-slate-600" style={{ fontSize: 14, color: '#475569' }}>
                                {response.question}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3" style={{ fontWeight: 600, marginBottom: 12 }}>
                          Areas for Improvement
                        </h4>
                        <div className="space-y-2" style={{ display: 'grid', rowGap: 8 }}>
                          {finalResults.improvement_areas?.slice(0, 5).map((area, index) => (
                            <div key={index} className="p-3 bg-yellow-50 rounded-lg" style={{ background: '#fef08a', borderRadius: 12, padding: 12 }}>
                              <span className="text-sm text-yellow-800" style={{ fontSize: 14, color: '#92400e' }}>
                                {area}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Button onClick={startNewInterview} className="w-full mt-6">
                      Start New Interview
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

