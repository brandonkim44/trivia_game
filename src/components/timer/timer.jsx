import React, { useState, useEffect } from 'react';
import TimerBar from './timerBar';

const Timer = ({ handleSubmit, timeLeft, setTimeLeft }) => {
   
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

    const timeToPercent = () => {
        return (timeLeft / 30) * 100;
    };

    return (
        <div>
            <TimerBar percentage={timeToPercent()}/>
        </div>
    );
};

export default Timer;