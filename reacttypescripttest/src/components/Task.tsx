import React from "react";
import { ITask } from "../interfaces";

interface TaskProps {
  task: ITask;
  handleDeleteTask(taskText: string): void;
}

const Task = ({ task, handleDeleteTask }: TaskProps) => {
  return (
    <div className="task">
      <div className="content">
        <span className="taskText">{task.text}</span>
        <span className="deadline">{task.deadline}</span>
      </div>
      <button className="delete" onClick={() => handleDeleteTask(task.text)}>
        X
      </button>
    </div>
  );
};

export default Task;
