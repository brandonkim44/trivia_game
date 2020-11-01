import React, { useState, useEffect } from 'react';

const Timer = ({ duration, checkAnswer, handleSubmit, currentAnswer, timeLeft, setTimeLeft }) => {
//    const [resetTimer, setResetTimer] = useState(false);
   
    useEffect(() => {
        if (timeLeft === 0) {
            handleSubmit(true);
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(timeLeft - 1);
        }, 1000);

        //clean up side effect

        return () => clearInterval(timerId);
    }, [timeLeft]);

    return (
        <div>
            {timeLeft}
        </div>
    );
};

export default Timer;