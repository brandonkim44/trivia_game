import React from "react";
import ModalContainer from "./components/modal/modal_container";
import { Provider } from "react-redux";
import useModal from "./hooks/useModal";
// import BoardContainer from './components/board/board_container';
import DisplayContainer from './components/display/display_container';

const App = ({ store }) => {
  const { visible, toggle } = useModal();
  const state = store.getState();

  return (
      <Provider store={store}>
        <div className="App">
            <ModalContainer visible={visible} toggle={toggle} />
            <DisplayContainer />
        </div>
    </Provider>
  );
};

export default App;
