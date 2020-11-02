import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AnswerItem from './answer_item';
import Timer from '../timer/timer';

const Answers = ({ correctAnswer, incorrectAnswers, answers, incrementScoreAndUpdate, updateQuestion }) => {

    let [currentAnswer, setCurrentAnswer] = useState("none");
    let [showAnswer, setShowAnswer] = useState(false);
    let [timeLeft, setTimeLeft] = useState(30);
    let [stopTime, setStopTime] = useState(false);

    const renderAnswers = () => {
        const answerComponents = answers.map((answer, i) => {
            return (
                <AnswerItem key={i} answer={answer} checkAnswer={checkAnswer} showAnswer={showAnswer} correctAnswer={correctAnswer}/>
            );
        });
        return answerComponents;
    };

    const checkAnswer = (selectedAnswer) => {
        if (selectedAnswer === correctAnswer) {
            setCurrentAnswer("correct");
        } else {
            setCurrentAnswer("incorrect");
        }
    };

    const renderNextQ = (dispatchFn) => {
        setShowAnswer(true);
        setStopTime(true);
        setTimeout(() => {
            let submit = document.querySelector(".submit-btn");
            submit.disabled = false;
            setStopTime(false);
            setCurrentAnswer("none");
            setTimeLeft(30);
            setShowAnswer(false);
            dispatchFn();
        }, 2000);
    };
    
    const handleSubmit = (timeOut) => {
        let submit = document.querySelector('.submit-btn');
        submit.disabled = true;

        if (timeOut && currentAnswer === "none") currentAnswer = "incorrect";
    
        if (currentAnswer === "correct") {
            renderNextQ(incrementScoreAndUpdate);
        } else if (currentAnswer === "incorrect"){
            renderNextQ(updateQuestion);
        } else {
            alert("Please choose an answer");
        }
    };

    return (
        <div className="answers-container">
            {renderAnswers()}
            <Timer timeLeft={timeLeft} stopTime={stopTime} setTimeLeft={setTimeLeft} currentAnswer={currentAnswer} handleSubmit={handleSubmit} />
            <button className="submit-btn" onClick={() => handleSubmit()}>Submit</button>
        </div>
    );

};

export default Answers;