import React from 'react';
import { Card, CardContent } from '../ui/card.jsx';
import { Progress } from '../ui/progress.jsx';
import { Brain, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalysisProgress({ progress, message }) {
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-8 text-center" style={{ padding: 32, textAlign: 'center' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg"
          style={{
            width: 64,
            height: 64,
            margin: '0 auto 24px',
            background: 'linear-gradient(135deg,#10b981,#2563eb)',
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 30px rgba(37,99,235,0.2)'
          }}
        >
          <Brain className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-xl font-semibold text-slate-800 mb-2" style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>
          AI Analysis in Progress
        </h3>
        <p className="text-slate-600 mb-6" style={{ color: '#475569', marginBottom: 24 }}>
          {message}
        </p>

        <div className="space-y-2" style={{ display: 'grid', rowGap: 8 }}>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-slate-500" style={{ fontSize: 14, color: '#94a3b8' }}>
            {Math.round(progress)}% complete
          </p>
        </div>

        <div
          className="flex items-center justify-center gap-2 mt-6 text-sm text-slate-500"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, fontSize: 14, color: '#94a3b8' }}
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          This may take a minute...
        </div>
      </CardContent>
    </Card>
  );
}

