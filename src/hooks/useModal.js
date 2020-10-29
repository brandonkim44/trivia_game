import { useState } from "react";

const useModal = () => {
  const [visible, setVisibility] = useState(true);
  function toggle() {
    setVisibility(!visible);
  }
  return {
    visible,
    toggle,
  };
};

export default useModal;