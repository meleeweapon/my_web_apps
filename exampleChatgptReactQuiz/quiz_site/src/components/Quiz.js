import React from 'react';

const Quiz = () => {
  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quizzy</h1>
      <div className="quiz-question">What is the capital of France?</div>
      <div className="quiz-options">
        <div className="quiz-option">
          <input type="radio" id="option1" name="answer" value="option1" />
          <label htmlFor="option1">Paris</label>
        </div>
        <div className="quiz-option">
          <input type="radio" id="option2" name="answer" value="option2" />
          <label htmlFor="option2">London</label>
        </div>
        <div className="quiz-option">
          <input type="radio" id="option3" name="answer" value="option3" />
          <label htmlFor="option3">Berlin</label>
        </div>
        <div className="quiz-option">
          <input type="radio" id="option4" name="answer" value="option4" />
          <label htmlFor="option4">Madrid</label>
        </div>
      </div>
      <button className="quiz-submit-button">Submit</button>
    </div>
  );
};

export default Quiz;