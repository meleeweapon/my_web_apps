// import React from 'react';
// import './Quiz.css';

// const Quiz = () => {
//   return (
//     <div className="quiz-container">
//       <h1 className="quiz-title">Quizzy</h1>
//       <div className="quiz-question">What is the capital of France?</div>
//       <div className="quiz-options">
//         <div className="quiz-option">
//           <input type="radio" id="option1" name="answer" value="option1" />
//           <label htmlFor="option1">Paris</label>
//         </div>
//         <div className="quiz-option">
//           <input type="radio" id="option2" name="answer" value="option2" />
//           <label htmlFor="option2">London</label>
//         </div>
//         <div className="quiz-option">
//           <input type="radio" id="option3" name="answer" value="option3" />
//           <label htmlFor="option3">Berlin</label>
//         </div>
//         <div className="quiz-option">
//           <input type="radio" id="option4" name="answer" value="option4" />
//           <label htmlFor="option4">Madrid</label>
//         </div>
//       </div>
//       <button className="quiz-submit-button">Submit</button>
//     </div>
//   );
// };

// export default Quiz;

import React, { useState } from 'react';
import './Quiz.css';

const Quiz = () => {
  const quizData = [
    {
      question: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      answer: 'Paris'
    },
    {
      question: 'Which planet is known as the Red Planet?',
      options: ['Mars', 'Jupiter', 'Venus', 'Saturn'],
      answer: 'Mars'
    },
    {
      question: 'What is the largest organ in the human body?',
      options: ['Heart', 'Liver', 'Skin', 'Lungs'],
      answer: 'Skin'
    },
  ];

  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleOptionChange = (questionIndex, option) => {
    setAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[questionIndex] = option;
      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRestart = () => {
    setShowResults(false);
    setAnswers([]);
  }

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Welcome to the Quiz Site!</h1>
      {quizData.map((quiz, index) => (
        <div key={index}>
          <div className="quiz-question">{quiz.question}</div>
          <div className="quiz-options">
            {quiz.options.map((option, optionIndex) => (
              <div className="quiz-option" key={optionIndex}>
                <input
                  type="radio"
                  id={`option${optionIndex}`}
                  name={`answer${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleOptionChange(index, option)}
                />
                <label htmlFor={`option${optionIndex}`}>{option}</label>
              </div>
            ))}
          </div>
        </div>
      ))}
      {showResults ? (
        <div className="quiz-result">
          {quizData.map((quiz, index) => (
            <p
              key={index}
              className={`quiz-result-${
                answers[index] === quiz.answer ? 'correct' : 'incorrect'
              }`}
            >
              {answers[index] === quiz.answer ? 'Correct' : 'Incorrect'}: {quiz.answer}
            </p>
          ))}
          <button className='quiz-restart-button' onClick={handleRestart}>
            Restart
          </button>
        </div>
      ) : (
        <button className="quiz-submit-button" onClick={handleSubmit}>
          Submit
        </button>
      )}
    </div>
  );
};

export default Quiz;
