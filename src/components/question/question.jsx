import React from 'react';

const Question = ({ currentQuestion, questionNum }) => {

    return (
        <div>
            <span>Question {questionNum}</span>
            <br/>
            <span>{currentQuestion}</span>
        </div>
    );
};

export default Question;