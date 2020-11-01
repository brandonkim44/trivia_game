import React from 'react';
import Score from '../score/score';

const End = ({ score, fetchTriviaQuestions }) => {
    return (
        <div>
            <Score score={score}/>
            END
            <button onClick={() => fetchTriviaQuestions()}>Play Again</button>
        </div>
    )
}

export default End;