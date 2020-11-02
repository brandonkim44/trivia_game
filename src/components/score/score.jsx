import React from 'react';

const Score = ({ score, end }) => {

    const className = () => {
        return (end) ? "score-end" : "score-game";
    };

    return (
        <div className={className()}>
            {score} / 10
        </div>  
    );
};

export default Score;