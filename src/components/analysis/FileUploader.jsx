import React, { useCallback } from 'react';
import { Card, CardContent } from '../ui/card.jsx';
import { Button } from '../ui/button.jsx';
import { Upload, FileText, CheckCircle, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FileUploader({ onFileSelect, selectedFile }) {
  const [dragActive, setDragActive] = React.useState(false);
  const [error, setError] = React.useState('');
  const fileInputRef = React.useRef(null);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files || []);
    handleFiles(files);
  }, []);

  const handleFiles = (files) => {
    const file = files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    onFileSelect?.(file);
  };

  const handleFileInput = (e) => {
    handleFiles(Array.from(e.target.files || []));
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div
          style={{
            padding: 24,
            borderBottom: '1px solid #e2e8f0',
            background: 'linear-gradient(135deg, rgba(16,185,129,0.06), rgba(37,99,235,0.1))'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <span style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 600, color: '#2563eb' }}>
                Resume Upload
              </span>
              <h3 style={{ margin: '6px 0 4px', fontSize: 20, fontWeight: 600, color: '#0f172a' }}>Securely add your PDF resume</h3>
              <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
                We only store it for this analysis session and never share your documents.
              </p>
            </div>
            <div
              style={{
                minWidth: 64,
                minHeight: 64,
                borderRadius: 20,
                background: 'rgba(37,99,235,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Upload size={26} color="#2563eb" />
            </div>
          </div>
        </div>
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed transition-all duration-200 ${
            dragActive ? 'border-blue-400 bg-blue-50' : selectedFile ? 'border-green-400 bg-green-50' : 'border-slate-300'
          }`}
          style={{
            padding: 40,
            margin: 28,
            borderRadius: 20,
            background: '#fff',
            transition: 'all 0.2s ease',
            minHeight: 260
          }}
          initial={false}
          animate={{
            scale: dragActive ? 1.02 : 1,
            boxShadow: dragActive
              ? '0 22px 45px rgba(37, 99, 235, 0.25)'
              : selectedFile
              ? '0 18px 38px rgba(34, 197, 94, 0.22)'
              : '0 12px 32px rgba(15, 23, 42, 0.08)'
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileInput} className="hidden" />

          <div className="text-center" style={{ textAlign: 'center' }}>
            {selectedFile ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                <div
                  className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center"
                  style={{
                    width: 64,
                    height: 64,
                    margin: '0 auto',
                    background: '#dcfce7',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Resume Uploaded</h3>
                  <p className="text-sm text-green-600 mb-1">{selectedFile.name}</p>
                  <p className="text-xs text-green-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button variant="outline" onClick={handleBrowseClick} className="border-green-300 text-green-700">
                  Change Resume
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-4" style={{ maxWidth: 420, margin: '0 auto' }}>
                <div
                  className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    dragActive ? 'bg-blue-100' : 'bg-slate-100'
                  }`}
                  style={{
                    width: 64,
                    height: 64,
                    margin: '0 auto',
                    borderRadius: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: dragActive ? '#dbeafe' : '#f1f5f9'
                  }}
                >
                  <Upload className="w-8 h-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload Your Resume</h3>
                  <p className="text-sm text-slate-600 mb-4">Drag and drop your PDF resume here, or click to browse</p>
                </div>
                <Button onClick={handleBrowseClick} className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose Resume File
                </Button>
                <p className="text-xs text-slate-500 mt-4">PDF files only, max 10MB</p>
              </div>
            )}
          </div>
        </motion.div>

        <div
          style={{
            padding: '0 24px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Encrypted storage, automatically purged after your analysis session completes.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#475569' }}>
            <Sparkles size={16} color="#2563eb" />
            <span>AI-friendly parsing preserves layout, bullet structure, and quantitative highlights.</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-t border-red-200" style={{ padding: 16, background: '#fee2e2', borderTop: '1px solid #fecaca' }}>
            <div className="flex items-center gap-2 text-red-800" style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b91c1c' }}>
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

