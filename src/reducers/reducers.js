import triviaData from '../data/triviaData.json';
import { UPDATE_QUESTION, INCREMENT_SCORE, RESTART_GAME, START_GAME } from '../actions/actions';

const initialState = {
    currentQuestion: null,
    correctAnswer: null,
    incorrectAnswers: null,
    score: 0,
    questionNum: 0,
}

const updateState = (state = initialState, action) => {
    Object.freeze(state);
    const stateCopy = Object.assign({}, state);
    switch(action.type) {
        case START_GAME:
            let newInitialState = Object.assign({}, initialState);
            let triviaQuestions = action.triviaQuestions;
            return Object.assign(newInitialState, { questionBank: triviaQuestions });
        case UPDATE_QUESTION:
            let { questionBank, questionNum } = stateCopy;
            const newQuestion = updateQuestion(questionBank);
            const { question, correct, incorrect } = newQuestion;
            const updatedQuestionData = {
                currentQuestion: question,
                correctAnswer: correct,
                incorrectAnswers: incorrect,
                questionNum: questionNum + 1,
                questionBank
            };
            return Object.assign(stateCopy, updatedQuestionData);
        case INCREMENT_SCORE:
            let { score } = stateCopy;
            score++;
            return Object.assign(stateCopy, { score });
        default:
            return state;
    }
}

const updateQuestion = (questionBank) => {
    return randomizeArray(questionBank).pop();
}

const randomizeArray = (array) => {
    for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
        const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
        let temp = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temp;
    }
    return array;
}

export default updateState;