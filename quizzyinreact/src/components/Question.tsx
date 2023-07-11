import React, { useState, MouseEvent, MouseEventHandler } from "react";
import QuestionText from "./QuestionText";
import Choice from "./Choice";

interface Question {
  questionText: string;
  choices: string[];
  correctAnswer: string;
  playerAnswer: string | null;
}

type Result = "correct" | "wrong" | "empty";

interface QuestionResult {
  question: Question;
  result: Result;
}

const Question: React.FC = () => {
  const firstQuestion: Question = {
    questionText: "what is up",
    choices: ["good", "bad", "ok", "awesome"],
    correctAnswer: "awesome",
    playerAnswer: null,
  }

  const [question, setQuestion] = useState<Question>(firstQuestion);

  const { questionText, choices, correctAnswer, playerAnswer } = question;

  const handleChoice: MouseEventHandler<HTMLDivElement> = (event): void => {
    setQuestion((previousQuestion) => {
      const targetElement = event.target as HTMLDivElement;
      targetElement.className += " correct-player-answer";
      return {...previousQuestion, playerAnswer: targetElement.textContent};
    })
  };

  return (
    <div className="question">
      <QuestionText questionText={questionText}/>
      <div className="choices">
        {choices.map((choice) => {
          return <Choice onClick={handleChoice} content={choice}/>
        })}
      </div>
    </div>
  );
};

export default Question;