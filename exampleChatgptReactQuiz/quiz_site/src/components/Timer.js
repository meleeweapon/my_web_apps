import { useState, useEffect } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds(prevSecs => prevSecs + 1);
    }, 1000);
    return () => {clearInterval(intervalId)};
  }, []);

  return <p>Seconds: {seconds}</p>;
}
export default Timer;