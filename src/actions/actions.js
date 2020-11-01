import * as APIUtil from '../utils/utils';

export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const INCREMENT_SCORE = 'INCREMENT_SCORE';
export const RESTART_GAME = 'RESTART_GAME';
export const START_GAME = 'START_GAME';

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

export const startGame = (triviaQuestions) => {
    return({
        type: START_GAME,
        triviaQuestions
    });
};

export const incrementScoreAndUpdate = () => (dispatch) => {
    dispatch(incrementScore())
    dispatch(updateQuestion())
};

export const fetchTriviaQuestions = () => (dispatch) => {
    APIUtil.fetchTriviaQuestions()
        .then(triviaQuestions => {
            dispatch(startGame(triviaQuestions))
            dispatch(updateQuestion())
        });
};
