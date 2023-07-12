import React, { MouseEventHandler } from "react";

interface ChoiceProps {
  content: string;
  onClick: MouseEventHandler<HTMLDivElement>;
  isCorrect: boolean;
  isChosen: boolean;
}

const Choice: React.FC<ChoiceProps> = ({
  content,
  onClick,
  isCorrect,
  isChosen,
}) => {
  return (
    <div
      onClick={onClick}
      className={`choice ${
        isChosen
          ? isCorrect
            ? "correctPlayerAnswer"
            : "wrongPlayerAnswer"
          : ""
      }`}
    >
      {content}
    </div>
  );
};

export default Choice;
