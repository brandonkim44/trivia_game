import React, { useState } from 'react';
import Question from '../question/question';
import AnswersContainer from '../answers/answers_container';
import Score from '../score/score';
import Timer from '../timer/timer';

const Board = ({ currentQuestion, correctAnswer, incorrectAnswers, score, questionNum }) => {

    //Durstenfeld Shuffle (optimized Fisher-Yates Shuffle)

    const randomizeAnswers = (correctAnswer, incorrectAnswers) => {
        const answers = [correctAnswer].concat(incorrectAnswers);
        for (let currentIndex = answers.length - 1; currentIndex > 0; currentIndex--) {
            const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
            let temp = answers[currentIndex];
            answers[currentIndex] = answers[randomIndex];
            answers[randomIndex] = temp;
        }
        return answers;
    };

    return(
        <div>
            <Score score={score}/>
            <Question 
                currentQuestion={currentQuestion}
                questionNum={questionNum}
            />
            <AnswersContainer
                correctAnswer={correctAnswer} 
                incorrectAnswers={incorrectAnswers}
                answers={randomizeAnswers(correctAnswer, incorrectAnswers)}
            />
        </div>
    )
};

export default Board;