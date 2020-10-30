import React, { useState } from 'react';
import { connect } from 'react-redux';
import AnswerItem from './answer_item';

const Answers = ({ correctAnswer, incorrectAnswers, answers, incrementScoreAndUpdate, updateQuestion }) => {

    const renderAnswers = () => {
        const answerComponents = answers.map((answer, i) => {
            return (
                <AnswerItem key={i} answer={answer} checkAnswer={checkAnswer}/>
            );
        });
        return answerComponents;
    };

    let [currentAnswer, setCurrentAnswer] = useState("none");

    const checkAnswer = (selectedAnswer) => {
        if (selectedAnswer === correctAnswer) {
            setCurrentAnswer("correct");
        } else {
            setCurrentAnswer("incorrect");
        }
        // if selectedAnswer matches correctAnswer, then useState is updated for correctAnswer to be true
    };

    const showAnswer = () => {
        
    };
    
    const handleSubmit = (e) => {
        let answerNodes = e.target.parentNode.childNodes;

        const findCorrectNode = (answerNodes) => {
            for (let i = 0; i < answerNodes.length - 1; i++) {
                if (answerNodes[i].dataset.answer === correctAnswer) return answerNodes[i];
            }
        }
        
        let correctNode = findCorrectNode(answerNodes);
    
        if (currentAnswer === "correct") {
            correctNode.style.backgroundColor = 'white';
            setTimeout(() => {
                correctNode.style.backgroundColor = "unset";
                incrementScoreAndUpdate();
            }, 1000);
            //dispatch thunk score inc + updateQuestion
            // alert("You are correct!")
        } else if (currentAnswer === "incorrect"){
            correctNode.style.backgroundColor = "white";
            setTimeout(() => {
                correctNode.style.backgroundColor = "unset";
                updateQuestion();
            }, 1000);
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
            <button className="submit-btn" onClick={(e) => handleSubmit(e)}>Submit</button>
        </div>
    );

};

export default Answers;