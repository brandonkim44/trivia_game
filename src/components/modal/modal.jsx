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
                        <span>Brandon-Tandem Trivia!</span>
                        <button onClick={() => handleClick(toggle, fetchTriviaQuestions)}>Start</button>
                    </div>
                </div>
            </div>
        </div>
    </>, document.body
) : null;