import React from "react";

interface ChoiceProps {
  content: string;
}

const Choice: React.FC<ChoiceProps> = (props) => {
  const { content } = props;

  return <div>{content}</div>;
}

export default Choice;