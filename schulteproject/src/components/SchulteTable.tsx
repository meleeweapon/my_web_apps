// TODO: fix grid tiles being slightly different width

import React, { FC, useState } from "react";

interface SchulteTableProps {}

const SchulteTable: FC<SchulteTableProps> = (props) => {
  const [numbers, setNumbers] = useState<number[]>(
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].sort(
      () => Math.random() - 0.5
    )
  );

  const [expectedNumber, setExpectedNumber] = useState<number>(1);

  const [completed, setCompleted] = useState<boolean>(false);

  const handleTile = (theNumber: number): void => {
    if (theNumber !== expectedNumber) {
      return;
    }

    if (theNumber === Math.max(...numbers)) {
      setCompleted(true);
    }
    setExpectedNumber((previousExpectedNumber) => previousExpectedNumber + 1);
  };

  return completed ? (
    <div>Finished</div>
  ) : (
    <div className="schulteTable">
      {numbers.map((theNumber, index) => {
        return (
          <button
            className={`tile ${theNumber < expectedNumber ? " clicked" : ""}`}
            key={index}
            onClick={() => handleTile(theNumber)}
          >
            {theNumber}
          </button>
        );
      })}
    </div>
  );
};

export default SchulteTable;
