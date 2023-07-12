import React, { FC } from "react";
import { ITask } from "../interfaces";

interface TaskProps {
  task: ITask;
}

const Task = ({ task }: TaskProps) => {
  return (
    <div className="task">
      <div className="content">
        <span className="taskText">{task.text}</span>
        <span className="deadline">{task.deadline}</span>
      </div>
      <button className="delete">X</button>
    </div>
  );
};

export default Task;
