import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from "react-dom";
import App, { store } from "./App";

const app = document.getElementById("app");
ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
	app
);
