import triviaData from '../data/Apprentice_TandemFor400_Data.json';
import { UPDATE_QUESTION } from '../actions/actions';

const initialState = {
    currentQuestion: null,
    answerChoices: null,
    correctAnswer: null,
    incorrectAnswers: null,
    score: 0,
    questionBank: triviaData
}

const updateState = (state = initialState, action) => {
    Object.freeze(state);
    switch(action.type) {
        case UPDATE_QUESTION:
            return Object.assign({}, initialState);
        default:
            return state;
    }
}

export default updateState;