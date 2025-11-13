import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Input } from '../ui/input.jsx';
import { Label } from '../ui/label.jsx';
import { Textarea } from '../ui/textarea.jsx';
import { Target, Sparkles, Building } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JobDescriptionInput({ data, onChange, onAnalyze, isProcessing, isValid }) {
  const handleInputChange = (field, value) => {
    onChange?.({ [field]: value });
  };

  return (
    <Card>
      <CardHeader
        style={{
          borderBottom: '1px solid #e2e8f0',
          background: 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(16,185,129,0.05))'
        }}
      >
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: 'rgba(37,99,235,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Target className="w-5 h-5 text-blue-600" style={{ width: 24, height: 24, color: '#2563eb' }} />
          </div>
          <div>
            <span style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1.3, fontWeight: 600, color: '#2563eb' }}>
              Step 2 of 3
            </span>
            <h3 style={{ margin: '6px 0 4px', fontSize: 20, fontWeight: 600, color: '#0f172a' }}>Describe the target opportunity</h3>
            <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
              The richer the job description, the smarter and more relevant your recommendations will be.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4" style={{ display: 'grid', rowGap: 20, paddingTop: 24 }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gap: 20 }}>
          <div className="space-y-2" style={{ display: 'grid', rowGap: 10 }}>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="e.g. Senior Software Engineer"
              value={data.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            />
          </div>
          <div className="space-y-2" style={{ display: 'grid', rowGap: 10 }}>
            <Label htmlFor="companyName">
              Company Name <span style={{ color: '#94a3b8' }}>(optional)</span>
            </Label>
            <div className="relative" style={{ position: 'relative' }}>
              <Building
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <Input
                id="companyName"
                placeholder="e.g. Google, Microsoft"
                value={data.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="pl-10"
                style={{ paddingLeft: 40 }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2" style={{ display: 'grid', rowGap: 10 }}>
          <Label htmlFor="jobDescription">Job Description *</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the full job description here including requirements, responsibilities, and qualifications..."
            value={data.jobDescription}
            onChange={(e) => handleInputChange('jobDescription', e.target.value)}
            rows={8}
            className="min-h-[200px]"
            style={{ minHeight: 240, paddingTop: 14, fontSize: 14 }}
          />
          <p className="text-xs text-slate-500" style={{ fontSize: 12, color: '#94a3b8' }}>
            Include as much detail as possible for better analysis
          </p>
        </div>

        <Button
          onClick={onAnalyze}
          disabled={!isValid || isProcessing}
          className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 text-white font-medium py-3"
          size="lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isProcessing ? 'Analyzing...' : 'Analyze Resume Match'}
        </Button>

        <motion.div
          style={{
            border: '1px dashed rgba(37,99,235,0.25)',
            borderRadius: 14,
            padding: 16,
            background: 'rgba(241,245,249,0.45)'
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h4 style={{ margin: '0 0 10px', fontSize: 14, color: '#0f172a', fontWeight: 600 }}>Helpful prompts</h4>
          <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', rowGap: 6, color: '#475569', fontSize: 13 }}>
            <li>Mention the team, seniority level, and primary objectives for the role.</li>
            <li>List the top technical and soft skills your target employer highlights.</li>
            <li>Include measurable outcomes or KPIs the role is accountable for.</li>
          </ul>
        </motion.div>
      </CardContent>
    </Card>
  );
}

