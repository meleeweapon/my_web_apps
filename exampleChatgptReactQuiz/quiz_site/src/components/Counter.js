import { useState } from "react";

const Counter = () => {
  const [counter, setCounter] = useState(0);

  const increment = () => {
    setCounter(counter + 1);
  }

  return (
    <button onClick={increment}>{counter}</button>
  )
}

export default Counter;