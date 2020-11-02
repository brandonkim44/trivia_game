import React from "react";
import ReactDOM from 'react-dom';

const handleClick = (toggle, fetchTriviaQuestions) => {
    fetchTriviaQuestions();
    toggle();
};

export const Modal = ({visible, toggle, fetchTriviaQuestions}) => visible ? ReactDOM.createPortal(
    <>
        <div className="modal-overlay">
            <div className="modal-wrapper">
                <div className="modal">
                    <div className="modal-container">
                        <h1>Brandon's Tandem Trivia</h1>
                        <span>10 questions.</span>
                        <span>30 seconds each.</span>
                        <span>ready?</span>
                        <button onClick={() => handleClick(toggle, fetchTriviaQuestions)}>Start</button>
                    </div>
                </div>
            </div>
        </div>
    </>, document.body
) : null;