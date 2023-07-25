import React, { FC } from "react";
import Chronometer from "./Chronometer";
import MatchesInfo from "./MatchesInfo";

interface StatisticsProps {
  hidden: boolean;
}

const Statistics: FC<StatisticsProps> = (props) => {
  const { hidden } = props;

  return (
    <div className={`statistics ${hidden && "hidden"}`}>
      <Chronometer />
      <MatchesInfo />
    </div>
  );
};

export default Statistics;
