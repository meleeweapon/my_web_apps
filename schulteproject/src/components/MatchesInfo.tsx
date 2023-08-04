import React, { FC, useContext, useState } from "react";
import {
  GameModeContext,
  GridSizeContext,
  MatchesContext,
  SetMatchesContext,
} from "../App";
import {
  findLastPlayed,
  findPersonalBestRecord,
  findSettingSpecificMatches,
  formatMatchDuration,
  gameModeToDisplay,
  gridSizeToDisplay,
  last,
} from "../utils";
import { GameMode, GridSize, MatchRecord } from "../interfaces";
import { Match } from "@testing-library/react";

interface MatchesInfoProps {}

const MatchesInfo: FC<MatchesInfoProps> = (props) => {
  const matches = useContext(MatchesContext);
  const setMatches = useContext(SetMatchesContext);
  const gridSize = useContext(GridSizeContext);
  const gameMode = useContext(GameModeContext);

  const handleReset = () => {
    if (!setMatches) throw new Error("setMatches must not be null");
    setMatches([]);
  };

  // TODO: find a better word than settings, settings sounds technical,
  // apply the same strategy as changing gamemode name 'classic' to 'vanilla'
  const settingSpecificMatches = findSettingSpecificMatches(
    matches,
    gridSize,
    gameMode
  );

  const personalBestRecord = findPersonalBestRecord(settingSpecificMatches);
  const personalBestSeconds = personalBestRecord
    ? formatMatchDuration(personalBestRecord)
    : undefined;

  // TODO: i might wanna add date to match record type and sort them that way
  const lastMatchRecord = findLastPlayed(settingSpecificMatches);
  const lastMatchSeconds = lastMatchRecord
    ? formatMatchDuration(lastMatchRecord)
    : undefined;

  return (
    <div className="matchesInfo">
      <button onClick={handleReset}>Reset</button>

      <div>{`${gridSizeToDisplay(gridSize)} ${gameModeToDisplay(
        gameMode
      )}`}</div>

      {settingSpecificMatches.length <= 0 ? (
        <div>No records yet.</div>
      ) : (
        <>
          <div>Personal Best: {personalBestSeconds} s</div>
          <div>
            Last Played: {lastMatchSeconds} s
            {lastMatchRecord === personalBestRecord && " ⭐"}
          </div>
        </>
      )}
    </div>
  );
};

export default MatchesInfo;
