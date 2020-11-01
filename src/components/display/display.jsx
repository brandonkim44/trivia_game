import React from 'react';
import BoardContainer from '../board/board_container';
import end_container from '../end/end_container';
import EndContainer from '../end/end_container';

const Display = ({ questionNum}) => {

    if (questionNum > 10) {
        return (
            <EndContainer />
        )
    } else if (questionNum > 0 && questionNum <= 10){
        return (
            <BoardContainer />
        )
    } else {
        return null;
    }
};

export default Display;