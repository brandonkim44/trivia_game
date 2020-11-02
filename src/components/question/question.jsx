import React from 'react';

const Question = ({ currentQuestion, questionNum }) => {

    return (
        <div className="question-container">
            <span className="question-num">Q{questionNum}: </span>
            <span className="question-label">{currentQuestion}</span>
        </div>
    );
};

export default Question;