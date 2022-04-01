// Libraries
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

// Components
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store/store'

// CSS
import './index.css';
import 'react-notifications/lib/notifications.css';
import '@influxdata/clockface/dist/index.css';
import './style/SignInForm.scss';
import './style/SignUpForm.scss';
import './style/ImportOverlay.scss';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
