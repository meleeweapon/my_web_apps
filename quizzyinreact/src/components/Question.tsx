import React from "react";
import { useState } from "react";
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
  // const [questionText, setQuestionText] = useState<string>("what is up?");
  // const [choices, setChoices] = useState<string[]>(["a", "b", "c", "d"]);

  const firstQuestion: Question = {
    questionText: "what is up",
    choices: ["good", "bad", "ok", "awesome"],
    correctAnswer: "awesome",
    playerAnswer: null,
  }

  const [question, setQuestion] = useState<Question>(firstQuestion);

  const { questionText, choices, correctAnswer, playerAnswer } = question;

  return (
    <>
      <QuestionText questionText={questionText}/>
      {choices.map((choice) => {
        return <Choice content={choice}/>
      })}
    </>
  );
};

export default Question;