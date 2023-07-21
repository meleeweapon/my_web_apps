import React from "react";
import Chronometer from "./Chronometer";
import MatchesInfo from "./MatchesInfo";

function Statistics() {
  return (
    <div className="statistics">
      <Chronometer />
      <MatchesInfo />
    </div>
  );
}

export default Statistics;
