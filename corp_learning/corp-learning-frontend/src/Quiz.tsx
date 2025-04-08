import React, { useState, useEffect } from 'react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizProps {
  questions: QuizQuestion[];
  // When the quiz is complete, onComplete will receive:
  // score: number of correct answers,
  // total: total questions,
  // timeTaken: time in seconds
  onComplete: (score: number, total: number, timeTaken: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [timer, setTimer] = useState<number>(0);

  // Start the timer on component mount, update every second
  useEffect(() => {
    setStartTime(new Date());
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmitAnswer = () => {
    if (selected !== null) {
      if (selected === questions[currentQuestion].correctAnswer) {
        setScore(prev => prev + 1);
      }
      setSubmitted(true);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelected(null);
      setSubmitted(false);
    } else {
      // Calculate total time taken
      const timeTaken = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      onComplete(
        score + (selected === questions[currentQuestion].correctAnswer ? 1 : 0),
        questions.length,
        timeTaken
      );
    }
  };

  const current = questions[currentQuestion];

  return (
    <div className="quiz-container">
      <h3>Quiz: Question {currentQuestion + 1} of {questions.length}</h3>
      <p>{current.question}</p>
      <ul>
        {current.options.map((option, idx) => (
          <li key={idx}>
            <label>
              <input
                type="radio"
                value={option}
                checked={selected === option}
                onChange={() => setSelected(option)}
                disabled={submitted}
              />
              {option}
            </label>
          </li>
        ))}
      </ul>
      <div>Time Elapsed: {timer} seconds</div>
      {!submitted ? (
        <button onClick={handleSubmitAnswer} disabled={selected === null}>
          Submit Answer
        </button>
      ) : (
        <>
          {selected === current.correctAnswer ? (
            <p style={{ color: 'green' }}>Correct!</p>
          ) : (
            <p style={{ color: 'red' }}>
              Incorrect! The correct answer was: {current.correctAnswer}
            </p>
          )}
          <button onClick={handleNextQuestion}>Next Question</button>
        </>
      )}
    </div>
  );
};

export default Quiz;