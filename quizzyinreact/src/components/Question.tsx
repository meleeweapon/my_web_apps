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
  };

  const [question, setQuestion] = useState<Question>(firstQuestion);

  const { questionText, choices, correctAnswer, playerAnswer } = question;

  const handleChoice = (event: MouseEvent, choice: string): void => {
    if (playerAnswer) return;
    setQuestion((previousQuestion) => {
      return { ...previousQuestion, playerAnswer: choice };
    });
  };

  return (
    <div className="question">
      <QuestionText questionText={questionText} />
      <div className="choices">
        {choices.map((choice, key) => {
          return (
            <Choice
              onClick={(event) => {
                handleChoice(event, choice);
              }}
              content={choice}
              isCorrect={choice === correctAnswer}
              isChosen={choice === playerAnswer}
              key={key}
            />
          );
        })}
      </div>
      {playerAnswer && <div className="nextQuestionBtn">Next Question</div>}
    </div>
  );
};

export default Question;
