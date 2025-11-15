AI Resume Analyzer
An AI-powered system to analyze résumés and generate insights, recommendations, and ATS-friendly scoring.
| Name                 | Roll No. | Role                  |
| -------------------- | -------- | --------------------- |
| **Shreyash Gadling** | 24BDS023 | Project Lead          |
| **Vikas P**          | 24BDS088 | Developer             |
| **E V S Harsha**     | 24BDS020 | NLP/ML Developer      |
| **Rahul Patil**      | 24BDS064 | Developer / Testing   |
| **Ganesh**           | 24BDS041 | UI/Frontend Developer |

AI-Resume-Analyzer/
│
├── data/
│   ├── sample_resumes/
│   └── job_descriptions/
│
├── src/
│   ├── app.py
│   ├── analyzer.py
│   ├── parser.py
│   ├── utils.py
│   └── model/
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   └── style.css
│
├── notebooks/
│   └── model_training.ipynb
│
├── README.md
└── requirements.txt


🚀 Features
Resume upload (PDF/DOCX)
Text extraction using OCR and parsing
Skill matching with Job Description
AI-based scoring (ATS Score, Skill Score, Relevance Score)
Improvement suggestions
Clean frontend interface
Option to download analysis report


🛠️ Tech Stack
Backend: Python, Flask / FastAPI
AI/NLP: spaCy, NLTK, SBERT / Transformers
Frontend: HTML, CSS, JavaScript / Streamlit
Utilities: PyPDF2, docx2txt, scikit-learn

🧪 Usage Instructions
Open the application
Upload your resume (PDF/DOCX)
Upload or paste a Job Description
Click Analyze Resume
View:
ATS Score
Skill Relevance
Missing Keywords
Improvement Suggestions
Download the generated report
