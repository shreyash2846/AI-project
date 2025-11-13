const defaultQuestions = [
  'Can you walk me through a challenging project you recently worked on?',
  'How do you prioritize tasks when everything feels important?',
  'Describe a time when you had to learn a new skill quickly. How did you approach it?',
  'Tell me about a time you disagreed with a teammate. What happened?',
  'How do you ensure the quality of your work when under tight deadlines?',
  'Describe a situation where you improved a process or workflow.',
  'How do you handle receiving critical feedback from a supervisor?',
  'Where do you see your career progressing in the next few years?'
];

const sampleAnalysis = {
  match_score: 72,
  strengths: [
    'Demonstrates strong experience with cross-functional collaboration',
    'Highlights measurable results from previous roles',
    'Shows familiarity with modern tooling and agile practices'
  ],
  missing_keywords: ['OKR', 'Stakeholder engagement', 'Budget ownership'],
  recommendations: [
    'Add a short summary section tailored to the target role',
    'Include metrics for your most recent accomplishment',
    'Highlight experience working with distributed teams'
  ],
  skill_gaps: ['Advanced data storytelling', 'Executive stakeholder communication'],
  summary: 'Overall a solid match. Add more strategic impact and executive communication examples to strengthen alignment.'
};

const sampleInterviewQuestions = [
  'Describe a time you had to align multiple stakeholders with conflicting priorities.',
  'How do you measure the success of a project after launch?',
  'Tell me about a time you identified a gap in your team’s skills and how you addressed it.',
  'How do you balance short-term deliverables with long-term strategy?',
  'What’s an example of a metric you introduced that changed how your team operated?',
  'How do you prepare your team for a high-stakes presentation or executive review?',
  'Describe a situation where a project was going off-track. What did you do?',
  'What excites you most about this role and our company’s mission?'
];

export async function UploadFile({ file }) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const safeName = file?.name ? file.name.replace(/\s+/g, '-').toLowerCase() : 'resume.pdf';
  return {
    file_url: `https://example.com/uploads/${safeName}`
  };
}

export async function ExtractDataFromUploadedFile({ file_url }) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return {
    status: 'success',
    output: {
      text_content: `Sample extracted text from resume located at ${file_url}. Add your parsing logic here.`
    }
  };
}

export async function InvokeLLM({ prompt, payload }) {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (prompt === 'generate_questions') {
    return {
      questions: defaultQuestions.map((question) => question.replace('project', payload?.jobRole || 'role'))
    };
  }

  if (prompt === 'evaluate_answer') {
    return {
      feedback:
        'Great structure and relevant experience. Consider adding a specific metric or outcome to demonstrate measurable impact.',
      score: 7.5,
      strengths: ['Clear explanation', 'Relevant experience', 'Positive tone'],
      improvements: ['Add metrics to highlight impact', 'Mention teamwork or collaboration aspects']
    };
  }

  if (typeof prompt === 'string' && prompt.includes('expert resume analyzer')) {
    return sampleAnalysis;
  }

  if (typeof prompt === 'string' && prompt.includes('generate 8-10 likely interview questions')) {
    return { questions: sampleInterviewQuestions };
  }

  return {};
}

