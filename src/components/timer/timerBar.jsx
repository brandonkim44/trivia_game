import React from 'react';
import Filler from './filler';

const TimerBar = ({ percentage }) => {
    return (
        <div className="timer-bar">
            <Filler percentage={percentage}/>
        </div>
    );
};

export default TimerBar;
