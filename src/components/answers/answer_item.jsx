import React from 'react';

const AnswerItem = ({ answer, checkAnswer }) => {

    return (
        <div className="answer-container" onClick={() => checkAnswer(answer)} data-answer={answer}>
           <span>{answer}</span>
        </div>
    )
}

export default AnswerItem