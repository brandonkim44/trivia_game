import React from 'react';

const AnswerItem = ({ answer, checkAnswer, correctAnswer, showAnswer }) => {

    const display = () => {
        if (showAnswer) {
            return (answer === correctAnswer) ? "answer-correct" : "answer-incorrect";
        } else {
            return "answer-container"
        }
    }

    return (
        <div className={display()} onClick={() => checkAnswer(answer)} data-answer={answer}>
           <span>{answer}</span>
        </div>
    );
}

export default AnswerItem