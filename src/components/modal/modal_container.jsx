import React from 'react';
import { connect } from 'react-redux';
import { Modal } from './modal';
import { updateQuestion, fetchTriviaQuestions } from "../../actions/actions";

const mapDispatchToProps = (dispatch) => {
    return({
        updateQuestion: () => dispatch(updateQuestion()),
        fetchTriviaQuestions: () => dispatch(fetchTriviaQuestions())
    });
};

export default connect(null, mapDispatchToProps)(Modal);