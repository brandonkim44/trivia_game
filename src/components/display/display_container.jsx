import React from 'react';
import { connect } from 'react-redux';
import Display from './display';

const mapStateToProps = ({ questionNum }) => {
    return ({
        questionNum
    })
}

const mapDispatchToProps = (dispatch) => {
    return({

    })
}

export default connect(mapStateToProps, mapDispatchToProps)(Display);