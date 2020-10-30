export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const INCREMENT_SCORE = 'INCREMENT_SCORE';
export const RESTART_GAME = 'RESTART_GAME';

export const updateQuestion = () => {
    return ({
        type: UPDATE_QUESTION
    });
};

export const incrementScore = () => {
    return ({
        type: INCREMENT_SCORE
    });
};

export const restartGame = () => {
    return ({
        type: RESTART_GAME
    });
};

export const incrementScoreAndUpdate = () => (dispatch) => {
    dispatch(incrementScore())
    dispatch(updateQuestion())
};
