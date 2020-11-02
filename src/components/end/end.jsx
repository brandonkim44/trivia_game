import React from 'react';
import Score from '../score/score';

const End = ({ score, fetchTriviaQuestions }) => {
    return (
        <div className="end-container">
            <Score score={score} end={true}/>
            <span>the end!</span>
            <button onClick={() => fetchTriviaQuestions()}>Play Again</button>
        </div>
    )
}

export default End;