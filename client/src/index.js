import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import './index.css';
import App from './App';
import NotFound from './pages/not-found';
//import Header from './components/header'; // TODO: To add before the Switch if you want a header
//import Footer from './components/footer'; // To add after the Switch if you want a footer

import reportWebVitals from './reportWebVitals';

const routing = (
  <Router>
    <div>
      <Switch>
        <Route exact path="/" component={App} />
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));
reportWebVitals();