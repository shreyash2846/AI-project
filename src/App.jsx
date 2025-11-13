import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './Layout.jsx';
import HomePage from './pages/Home.jsx';
import AnalysisPage from './pages/Analysis.jsx';
import MockInterviewPage from './pages/MockInterview.jsx';

const Placeholder = ({ title }) => (
  <div style={{ padding: 24 }}>
    <h2>{title}</h2>
    <p>This page is not yet implemented.</p>
  </div>
);

export default function App() {
  return (
    <Layout currentPageName="Home">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Home" element={<Navigate to="/" replace />} />
        <Route path="/Analysis" element={<AnalysisPage />} />
        <Route path="/SkillGap" element={<Placeholder title="Skill Gap Analysis" />} />
        <Route path="/DiscussionHub" element={<Placeholder title="Discussion Hub" />} />
        <Route path="/EmployerDashboard" element={<Placeholder title="Employer Dashboard" />} />
        <Route path="/PostVacancy" element={<Placeholder title="Post Vacancy" />} />
        <Route path="/SalaryInsights" element={<Placeholder title="Salary Insights" />} />
        <Route path="/MockInterview" element={<MockInterviewPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

