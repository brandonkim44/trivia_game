import React from 'react';
import Board from './board';
import { connect } from 'react-redux';
import { updateQuestion, incrementScoreAndUpdate } from "../../actions/actions";

const mapStateToProps = ({ currentQuestion, correctAnswer, incorrectAnswers, score, questionNum}) => {
    return({
        currentQuestion,
        correctAnswer,
        incorrectAnswers, 
        score,
        questionNum
    });
};

const mapDispatchToProps = (dispatch) => {
    return({
        updateQuestion: () => dispatch(updateQuestion())
    });
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);