import { all } from 'async';
import React, { useState } from 'react';

const AnswerItem = ({ answer, checkAnswer, correctAnswer, showAnswer }) => {

    const display = () => {
        if (showAnswer) {
            return (answer === correctAnswer) ? "answer-correct" : "answer-incorrect";
        } else {
            return "answer-not-selected"
        }
    };

    const handleClick = (e) => {
        const allAnswers = document.querySelectorAll('[data-answer]');
        for (let i = 0; i < allAnswers.length; i++) {
            allAnswers[i].className = "answer-not-selected";
        }
        e.currentTarget.className = "answer-selected";
        checkAnswer(answer);
    };

    return (
        <div className={display()} onClick={(e) => handleClick(e)} data-answer={answer}>
           <span className="answer-label">{answer}</span>
        </div>
    );
}

export default AnswerItem