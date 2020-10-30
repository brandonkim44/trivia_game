import React from 'react';
import Score from '../score/score';

const End = ({ score, restartGame }) => {
    return (
        <div>
            <Score score={score}/>
            END
            <button onClick={() => restartGame()}>Play Again</button>
        </div>
    )
}

export default End;