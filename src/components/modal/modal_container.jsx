import React from 'react';
import { connect } from 'react-redux';
import { Modal } from './modal';
import { updateQuestion } from "../../actions/actions";

const mapDispatchToProps = (dispatch) => {
    return({
        updateQuestion: () => dispatch(updateQuestion())
    });
};

export default connect(null, mapDispatchToProps)(Modal);