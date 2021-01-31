import React, { useEffect, useState } from "react";

interface TimerProps {
  duration: number;
  onCountdownEnd: Function;
  start: boolean;
  oneTime?: number;
}

const Timer = (props: TimerProps) => {
  const [count, setCount] = useState(props.duration);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (props.start)
      id = setInterval(
        () =>
          setCount((s: any) => {
            if (s === 0) {
              props.onCountdownEnd();
              if (props.oneTime) {
                clearInterval(id);
                return 0;
              } else return props.duration;
            } else {
              return s - 1;
            }
          }),
        1000
      );

    return () => {
      if (id) clearInterval(id);
    };
  }, [props.start]);

  const formatNum = (n: number): string => {
    const s = String(n);
    if (s.length == 1) return "0" + s;
    return s;
  };

  return (
    <h3 className="timer">{`${formatNum(Math.floor(count / 60))}:${formatNum(
      count % 60
    )}`}</h3>
  );
};

export default Timer;
