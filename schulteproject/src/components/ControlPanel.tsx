import React, { FC, useContext } from "react";

interface ControlPanelProps {
  completed: boolean;
}

// function ControlPanel(props: ControlPanelProps) {
const ControlPanel: FC<ControlPanelProps> = (props) => {
  const { completed } = props;
  // const completed = useContext(smt);

  return (
    <div className="controlPanel">
      {completed && <button className="playAgain">Play Again</button>}
      {/* {<button className="playAgain">Play Again</button>} */}
    </div>
  );
};

export default ControlPanel;
