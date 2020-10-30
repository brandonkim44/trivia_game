import React, { useState, useEffect } from 'react';

const Timer = ({ duration }) => {

   const [timeLeft, setTimeLeft] = useState(duration);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timerId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        return () => clearInterval(timerId);
    }, [timeLeft]);

    return (
        <div>
            {timeLeft}
        </div>
    );
};

export default Timer;