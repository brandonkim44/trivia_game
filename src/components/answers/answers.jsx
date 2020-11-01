import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import AnswerItem from './answer_item';
import Timer from '../timer/timer';

const Answers = ({ correctAnswer, incorrectAnswers, answers, incrementScoreAndUpdate, updateQuestion }) => {

    let [currentAnswer, setCurrentAnswer] = useState("none");
    let [showAnswer, setShowAnswer] = useState(false);
    let [timeLeft, setTimeLeft] = useState(30);

    const renderAnswers = () => {
        const answerComponents = answers.map((answer, i) => {
            return (
                <AnswerItem key={i} answer={answer} checkAnswer={checkAnswer} showAnswer={showAnswer} correctAnswer={correctAnswer}/>
            );
        });
        return answerComponents;
    };


    const checkAnswer = (selectedAnswer) => {
        debugger;
        if (selectedAnswer === correctAnswer) {
            setCurrentAnswer("correct");
            debugger;
        } else {
            setCurrentAnswer("incorrect");
        }
        // if selectedAnswer matches correctAnswer, then useState is updated for correctAnswer to be true
    };
    
    const handleSubmit = (timeOut) => {

        if (timeOut) currentAnswer = "incorrect";
        
        // let answerNodes = e.target.parentNode.childNodes;
        
        // const findCorrectNode = (answerNodes) => {
            //     for (let i = 0; i < answerNodes.length - 1; i++) {
                //         if (answerNodes[i].dataset.answer === correctAnswer) return answerNodes[i];
                //     }
                // }
                
                // let correctNode = findCorrectNode(answerNodes);
                
        if (currentAnswer === "correct") {
            setShowAnswer(true);
            // correctNode.style.backgroundColor = 'white';
            setTimeout(() => {
                setShowAnswer(false);
                setTimeLeft(30);
                // correctNode.style.backgroundColor = "unset";
                incrementScoreAndUpdate();
            }, 3000);
            //dispatch thunk score inc + updateQuestion
            // alert("You are correct!")
        } else if (currentAnswer === "incorrect"){
            setShowAnswer(true);
            // correctNode.style.backgroundColor = "white";
            setTimeout(() => {
                setShowAnswer(false);
                setTimeLeft(30);
                // correctNode.style.backgroundColor = "unset";
                updateQuestion();
            }, 3000);
            //dispatch updateQuestion
            // alert("You are incorrect!");
        } else {
            alert("Please choose an answer");
        }
        //if currentAnswer = true, then incrementScore, else show correctAnswer and don't incrementScore
    };

    return (
        <div>
            {renderAnswers()}
            <Timer timeLeft={timeLeft} setTimeLeft={setTimeLeft} currentAnswer={currentAnswer} handleSubmit={handleSubmit} />
            <button className="submit-btn" onClick={() => handleSubmit()}>Submit</button>
        </div>
    );

};

export default Answers;