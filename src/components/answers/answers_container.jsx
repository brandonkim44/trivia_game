import React from 'react';
import { connect } from 'react-redux';
import Answers from './answers';
import { updateQuestion, incrementScoreAndUpdate } from "../../actions/actions";

// const mapStateToProps = ({ correctAnswer, incorrrectAnswers }) => {

//     return({
//         correctAnswer,
//         incorrrectAnswers
//     });
// };

const mapDispatchToProps = (dispatch) => {
    return({
        updateQuestion: () => dispatch(updateQuestion()),
        incrementScoreAndUpdate: () => dispatch(incrementScoreAndUpdate())
    });
};

export default connect(null, mapDispatchToProps)(Answers);