import triviaData from '../data/Apprentice_TandemFor400_Data.json';
import { UPDATE_QUESTION, INCREMENT_SCORE, RESTART_GAME } from '../actions/actions';

const initialState = {
    currentQuestion: null,
    correctAnswer: null,
    incorrectAnswers: null,
    score: 0,
    questionNum: 0,
    questionBank: triviaData
}

const updateState = (state = initialState, action) => {
    Object.freeze(state);
    const stateCopy = Object.assign({}, state);
    switch(action.type) {
        case UPDATE_QUESTION:
            let { questionBank, questionNum } = stateCopy;
            const newQuestion = updateQuestion(questionBank);
            const { question, correct, incorrect } = newQuestion;
            const updatedQuestionData = {
                currentQuestion: question,
                correctAnswer: correct,
                incorrectAnswers: incorrect,
                questionNum: questionNum + 1
            };
            return Object.assign(stateCopy, updatedQuestionData);
        case INCREMENT_SCORE:
            let { score } = stateCopy;
            score++;
            return Object.assign(stateCopy, { score });
        case RESTART_GAME:
            let newQuestionBank = {
                questionBank: triviaData
            }
            return Object.assign(initialState, newQuestionBank);
        default:
            return state;
    }
}

const updateQuestion = (questionBank) => {
    let numOfQs = questionBank.length;
    let randomNum = Math.floor(Math.random() * numOfQs);
    let questionData = triviaData[randomNum];
    questionBank.splice(randomNum, 1);
    return questionData;
}

export default updateState;