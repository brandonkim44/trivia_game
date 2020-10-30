import React from 'react';
import { connect } from 'react-redux';
import End from './end';
import { restartGame } from '../../actions/actions';

const mapStateToProps = ({ score }) => {
    return ({
        score
    })
};

const mapDispatchToProps = (dispatch) => {
    return ({
        restartGame: () => dispatch(restartGame())
    })
};

export default connect(mapStateToProps, mapDispatchToProps)(End);
