import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {FaArrowLeft, FaHome} from 'react-icons/fa';
import Quiz, { QuizQuestion } from './Quiz';
import axios from 'axios';
import './Dashboard.css';

export interface TrainingModule {
  id: number;
  title: string;
  content: string;
  difficulty: number;
}

const quizData: { [key: string]: QuizQuestion[] } = {
  "fire safety training": [
    {
      question: "What should you do if you hear a fire alarm?",
      options: ["Evacuate immediately", "Wait for instructions", "Ignore it", "Call a colleague"],
      correctAnswer: "Evacuate immediately",
    },
    {
      question: "Which piece of equipment is vital for fire safety?",
      options: ["Fire extinguisher", "Laptop", "Notebook", "Water bottle"],
      correctAnswer: "Fire extinguisher",
    },
  ],
  "annual compliance": [
    {
      question: "How often is annual compliance training required?",
      options: ["Once a year", "Monthly", "Weekly", "Never"],
      correctAnswer: "Once a year",
    },
  ],
  "sexual harassment and bullying": [
    {
      question: "What is a key element in preventing harassment?",
      options: ["Respect", "Silence", "Competition", "Isolation"],
      correctAnswer: "Respect",
    },
  ],
  "communication": [
    {
      question: "Effective communication should include:",
      options: ["Clear feedback", "Interrupting", "Avoiding eye contact", "One-way messaging"],
      correctAnswer: "Clear feedback",
    },
  ],
  "investment banking training": [
    {
      question: "Which activity is central to investment banking?",
      options: ["Mergers and acquisitions", "Retail sales", "Customer support", "Marketing"],
      correctAnswer: "Mergers and acquisitions",
    },
  ],
};

const ModuleDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { moduleId } = useParams<{ moduleId: string }>();

  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<{ score: number; total: number; timeTaken: number } | null>(null);

  // Retrieve module details from state if available
  const module: TrainingModule | undefined = location.state?.module;
  const moduleKey = module?.title.toLowerCase();

  const handleQuizComplete = async (score: number, total: number, timeTaken: number) => {
    setQuizResult({ score, total, timeTaken });
    setShowQuiz(false);
    try {
      await axios.post("http://127.0.0.1:8000/api/update-quiz/", {
        pointsEarned: score * 10, // Example: 10 points per correct answer
        timeTaken: timeTaken,
      }, { withCredentials: true });
    } catch (error) {
      console.error("Error updating quiz data:", error);
    }
  };

  if (!module) {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Module Details</h2>
        <p>No module details provided. Please return to the dashboard.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }
const ArrowLeft: React.FC<any> = FaArrowLeft as React.FC<any>;
  return (
    <div style={{ padding: '20px' }}>
      {/* Back arrow button replacing the text button */}
      <button className="back-button" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>
      <h2>{module.title}</h2>
      <img
        src={`/images/${module.title.replace(/\s+/g, '_').toLowerCase()}.jpg`}
        alt={module.title}
        style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }}
      />
      <div>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>{module.content}</p>
      </div>

      <div style={{ margin: '20px 0' }}>
        <button onClick={() => setShowQuiz(!showQuiz)}>
          {showQuiz ? "Hide Quiz" : "Take Quiz"}
        </button>
      </div>

      {showQuiz && moduleKey && quizData[moduleKey] ? (
        <Quiz questions={quizData[moduleKey]} onComplete={handleQuizComplete} />
      ) : null}

      {quizResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>Quiz Result</h3>
          <p>You scored {quizResult.score} out of {quizResult.total}.</p>
          <p>Time Taken: {quizResult.timeTaken} seconds</p>
          <button onClick={() => setQuizResult(null)}>Reset Quiz</button>
        </div>
      )}
    </div>
  );
};

export default ModuleDetail;