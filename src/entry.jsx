import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.scss";
import App from './App';

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("root");
    ReactDOM.render(<App />, root);
});