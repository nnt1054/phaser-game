import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from "react-dom";
import App from "./App";
import store from './store/store';

const app = document.getElementById("app");
ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
	app
);
