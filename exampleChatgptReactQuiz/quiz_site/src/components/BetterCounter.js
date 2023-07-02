import { useReducer } from "react";

const initialState = { count: 0 };

const reducer = (state, action) => {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1};
    case "decrement":
      return { count: state.count - 1};
    case "reset":
      return initialState;
    default:
      throw new Error("invalid action");
  }
}

const BetterCounter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <div>Counter: { state.count }</div>
      <button onClick={()=> dispatch({ type: "increment" })}>Add</button>
      <button onClick={()=> dispatch({ type: "decrement" })}>Substract</button>
      <button onClick={()=> dispatch({ type: "reset" })}>Reset</button>
    </div>
  );
}

export default BetterCounter;