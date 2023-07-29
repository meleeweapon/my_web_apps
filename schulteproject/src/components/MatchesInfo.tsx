import React, { FC, useContext, useState } from "react";
import { MatchesContext, SetMatchesContext } from "../App";
import { formatMatchDuration } from "../utils";

type MatchesInfoProps = {};

const MatchesInfo: FC<MatchesInfoProps> = (props) => {
  const matches = useContext(MatchesContext);
  const setMatches = useContext(SetMatchesContext);

  const handleReset = () => {
    if (!setMatches) throw new Error("setMatches must not be null");
    setMatches([]);
  };

  const findPersonalBestRecord = () =>
    matches.reduce((previousMatch, currentMatch) =>
      previousMatch.durationInMilliseconds < currentMatch.durationInMilliseconds
        ? previousMatch
        : currentMatch
    );

  const personalBestRecord = matches.length
    ? findPersonalBestRecord()
    : undefined;

  // const lastMatchSeconds = formatMatchDuration(matches[matches.length - 1]);
  // const personalBestSeconds = formatMatchDuration(Math.min(...matches));

  return (
    <div className="matchesInfo">
      <button onClick={handleReset}>Reset</button>
      {matches.length <= 0 ? (
        <div>No records yet.</div>
      ) : (
        <>
          <div>Personal Best: {personalBestSeconds} s</div>
          <div>
            Last Played: {lastMatchSeconds} s
            {lastMatchSeconds === personalBestSeconds && " ⭐"}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchesInfo;
