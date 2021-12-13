import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from "react-router-dom";
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/CSS/kockabuilder.css';
import App from './App';
import rootReducer from './rootReducer';
import decode from 'jwt-decode';
import { userLoggedIn } from './actions/auth';


const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

//A teljes alkalmazásra vonatkozó globális tároló.
//Ebben az objektumban kerülnek eltráolásra a bejelentkjezett felhasználók adatai. 
if(localStorage.kockaJWT){
  const payload = decode(localStorage.kockaJWT);
  const user = {token: localStorage.kockaJWT, email: payload.email, username: payload.username, isAdmin: payload.isAdmin, isTrainer: payload.isTrainer};
  store.dispatch(userLoggedIn(user))
}

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <Route component={App} />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

