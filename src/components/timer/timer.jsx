import React, { useState, useEffect } from 'react';
import TimerBar from './timerBar';

const Timer = ({ handleSubmit, timeLeft, setTimeLeft, stopTime }) => {
   
    useEffect(() => {
        if (timeLeft === 0 && !stopTime) {
            handleSubmit(true);
            return;
        }

        let timerId = null;

        const manageTimer = (stopTime) => {
            if (stopTime) {
                clearInterval(timerId);
            } else {
                timerId = setInterval(() => {
                    setTimeLeft(timeLeft-1)
                }, 1000)
            }
        };

        manageTimer(stopTime);
        
        //clean up side effect
        return () => clearInterval(timerId);
    }, [timeLeft]);

    const timeToPercent = () => {
        return (timeLeft / 30) * 100;
    };

    return (
        <>
            <TimerBar percentage={timeToPercent()}/>
        </>
    );
};

export default Timer;