import React from "react";

interface QuestionTextProps {
  questionText: string;
}

const QuestionText: React.FC<QuestionTextProps> = (props) => {
  const { questionText } = props;

  return <div>{questionText}</div>;
}

export default QuestionText;