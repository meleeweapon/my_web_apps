import React, { FC, useContext, useState } from "react";
import { GridSizeContext, MatchesContext, SetMatchesContext } from "../App";
import { formatMatchDuration, last } from "../utils";
import { GridSize } from "../interfaces";

interface MatchesInfoProps {}

const MatchesInfo: FC<MatchesInfoProps> = (props) => {
  const matches = useContext(MatchesContext);
  const setMatches = useContext(SetMatchesContext);
  const gridSize = useContext(GridSizeContext);

  const handleReset = () => {
    if (!setMatches) throw new Error("setMatches must not be null");
    setMatches([]);
  };

  const findPersonalBestRecord = () =>
    matches.length
      ? matches.reduce((previousMatch, currentMatch) =>
          previousMatch.durationInMilliseconds <
          currentMatch.durationInMilliseconds
            ? previousMatch
            : currentMatch
        )
      : undefined;

  const personalBestRecord = findPersonalBestRecord();
  const personalBestSeconds = personalBestRecord
    ? formatMatchDuration(personalBestRecord)
    : undefined;

  // i might wanna add date to match record type and sort them that way
  const findLastPlayed = () => last(matches);
  const lastMatchRecord = findLastPlayed();
  const lastMatchSeconds = lastMatchRecord
    ? formatMatchDuration(lastMatchRecord)
    : undefined;

  return (
    <div className="matchesInfo">
      <button onClick={handleReset}>Reset</button>

      <div>{gridSize}</div>

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
