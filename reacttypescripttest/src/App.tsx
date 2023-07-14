import React, { FC, ChangeEvent, useState } from "react";
import "./App.css";
import { ITask } from "./interfaces";
import Task from "./components/Task";

const App: FC = () => {
  const [taskContent, setTaskContent] = useState<string>("");
  const [deadline, setDeadline] = useState<number>(0);
  const [todoList, setTodoList] = useState<ITask[]>([]);

  const handleTask = (event: ChangeEvent<HTMLInputElement>): void => {
    setTaskContent(event.target.value);
  };

  const handleDeadline = (event: ChangeEvent<HTMLInputElement>): void => {
    setDeadline(Number(event.target.value));
  };

  const handleAddTask = (): void => {
    setTodoList((previous: ITask[]) => {
      const task: ITask = {
        text: taskContent,
        deadline: deadline,
      };
      setTaskContent("");
      setDeadline(0);

      return [...previous, task];
    });
  };

  const handleDeleteTask = (taskText: string): void => {
    setTodoList((previousTodoList) => {
      return previousTodoList.filter((todoItem) => todoItem.text !== taskText);
    });
  };

  return (
    <div className="App">
      <div className="header">
        <div className="inputContainer">
          <input
            type="text"
            onChange={handleTask}
            name="task"
            value={taskContent}
            placeholder="Task"
          />
          <input
            type="number"
            onChange={handleDeadline}
            name="deadline"
            value={deadline}
            placeholder="Deadline in Days"
          />
        </div>
        <button onClick={handleAddTask}>Add ITask</button>
      </div>
      <div className="toDoList">
        {todoList.map((task) => {
          return <Task task={task} handleDeleteTask={handleDeleteTask} />;
        })}
      </div>
    </div>
  );
};

export default App;
