import React from "react";
import ModalContainer from "./components/modal/modal_container";
import { Modal } from "./components/modal/modal";
import { Provider } from "react-redux";
import useModal from "./hooks/useModal";
import BoardContainer from './components/board/board_container';

const App = ({ store }) => {
  const { visible, toggle } = useModal();
  return (
      <Provider store={store}>
        <div className="App">
            <ModalContainer visible={visible} toggle={toggle} />
            <BoardContainer />
        </div>
    </Provider>
  );
};

export default App;
