import React, { FC } from "react";
import { ITask } from "../interfaces";

interface TaskProps {
  task: ITask;
}

const Task = ({ task }: TaskProps) => {

  return (
    <div className="task">
      <span className="taskText">{task.text}</span>
      <span className="deadline">{task.deadline}</span>
      <button className="delete">X</button>
    </div>
  )
}

export default Task;