import React, { createContext, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import SchulteTable from "./components/SchulteTable";
import ControlPanel from "./components/ControlPanel";
import Statistics from "./components/Statistics";

export const CompletedContext = createContext(false);

function App() {
  const [completed, setCompleted] = useState<boolean>(false);
  return (
    <div className="App">
      <ControlPanel completed={completed} />
      <SchulteTable completed={completed} setCompleted={setCompleted} />
      <CompletedContext.Provider value={completed}>
        <Statistics />
      </CompletedContext.Provider>
    </div>
  );
}

export default App;
