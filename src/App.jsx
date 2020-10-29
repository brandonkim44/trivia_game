import React from "react";
import { Modal } from "./components/modal/modal";
import useModal from "./hooks/useModal";
import BoardContainer from './components/board/board_container';

const App = () => {
  const { visible, toggle } = useModal();
  return (
    <div className="App">
      <Modal visible={visible} toggle={toggle} />
      <BoardContainer />
    </div>
  );
};

export default App;
