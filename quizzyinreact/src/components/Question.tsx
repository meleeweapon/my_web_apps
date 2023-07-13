import React, { useState, MouseEvent } from "react";
import QuestionText from "./QuestionText";
import Choice from "./Choice";
import { IQuestion } from "../interfaces";

const Question: React.FC = () => {
  const questions: IQuestion[] = [
    {
      questionText: "what is up",
      choices: ["good", "bad", "ok", "awesome"],
      correctAnswer: "awesome",
      playerAnswer: null,
    },
    {
      questionText: "how you doin",
      choices: ["yes", "no", "huh", "alright!"],
      correctAnswer: "alright!",
      playerAnswer: null,
    },
  ];

  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const [questionIndex, setQuestionIndex] = useState<number>(0);

  const [question, setQuestion] = useState<IQuestion>(questions[questionIndex]);

  const { questionText, choices, correctAnswer, playerAnswer } = question;

  const handleChoice = (event: MouseEvent, choice: string): void => {
    if (playerAnswer) return;
    setQuestion((previousQuestion) => {
      return { ...previousQuestion, playerAnswer: choice };
    });
  };

  const handleNextQuestion = (): void => {
    setQuestionIndex((previousQuestionIndex) => {
      const newQuestionIndex = previousQuestionIndex + 1;
      const newQuestion = questions[newQuestionIndex];
      if (newQuestion) {
        setQuestion(questions[newQuestionIndex]);
      } else {
        setIsGameOver(true);
      }
      return newQuestionIndex;
    });

    // setQuestion((previousQuestion) => {
    //   const nextQuestionIndex = questions.indexOf(previousQuestion);
    //   console.log(nextQuestionIndex);
    //   console.log(questions[nextQuestionIndex]);
    //   return questions[nextQuestionIndex];
    // });
  };

  const handlePlayAgain = (): void => {
    // eslint-disable-next-line no-restricted-globals
    location.reload();
  };

  return isGameOver ? (
    <div className="gameOver">
      <div className="finished">Finished!</div>
      <div className="scoreContainer">
        <div className="score">Score: 5</div>
      </div>
      <div className="playAgain" onClick={handlePlayAgain}>
        Play Again
      </div>
    </div>
  ) : (
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
              reveal={Boolean(playerAnswer)}
              key={key}
            />
          );
        })}
      </div>
      {playerAnswer && (
        <div className="nextQuestionBtn" onClick={handleNextQuestion}>
          Next Question
        </div>
      )}
    </div>
  );
};

export default Question;
