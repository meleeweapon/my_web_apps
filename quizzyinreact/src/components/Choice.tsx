import React, { MouseEventHandler } from "react";

interface ChoiceProps {
  content: string;
  onClick: MouseEventHandler<HTMLDivElement>;
}

const Choice: React.FC<ChoiceProps> = (props) => {
  const { content, onClick } = props;

  return <div onClick={onClick} className="choice">{content}</div>;
}

export default Choice;