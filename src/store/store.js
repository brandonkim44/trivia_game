import { createStore, applyMiddleware } from "redux";
import { thunk } from "../middleware/thunk";
import updateState from "../reducers/reducers";
import { logger } from "redux-logger";

//remove logger when deploying to production

const configureStore = (preloadedState = {}) =>
  createStore(updateState, preloadedState, applyMiddleware(thunk, logger));

export default configureStore;