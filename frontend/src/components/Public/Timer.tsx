import React, { useState, useEffect, useCallback } from 'react';

type Props = {
  onTimerEnd: () => void;
  totalSec: number;
}

const Timer = (props: Props) => {
  const [seconds, setSeconds] = useState(props.totalSec);

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  useEffect(() => {
    if (seconds === 0) {
      props.onTimerEnd();
      return;
    }

    const timerId = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [seconds, props.onTimerEnd]);

  return <div>{formatTime(seconds)}</div>;
};

export default Timer;