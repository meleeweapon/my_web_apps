import React, { FC, ChangeEvent, useState } from 'react';
import './App.css';
import { ITask } from './interfaces';

const App: FC = () => {
  const [taskContent, setTaskContent] = useState<string>("");
  const [deadline, setDeadline] = useState<number>(0);
  const [todoList, setTodoList] = useState<ITask[]>([]);

  const handleTask = (event: ChangeEvent<HTMLInputElement>): void => {
    setTaskContent(event.target.value);
  }

  const handleDeadline = (event: ChangeEvent<HTMLInputElement>): void => {
    setDeadline(Number(event.target.value));
  }

  const handleAddTask = (): void => {
    setTodoList((previous: ITask[]) => {
      const task: ITask = {
        text: taskContent, 
        deadline: deadline,
      };
      return [...previous, task];
    })
  }

  return (
    <div className="App">
      <div className='header'>
        <div className='inputContainer'>
          <input type="text" onChange={handleTask} placeholder='Task' />
          <input type="number" onChange={handleDeadline} placeholder='Deadline in Days' />
        </div>
        <button onClick={handleAddTask}>Add ITask</button>
      </div>
      <div className='toDoList'>
        {todoList.map((task) => {
          return (
            <>
              <div>{task.text}</div>
              <div>{task.deadline}</div>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default App;
