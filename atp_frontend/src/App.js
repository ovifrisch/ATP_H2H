import React from 'react';
import './App.css';
import Header from "./components/Header"
import Footer from './components/Footer'
import AgeComparison from "./components/AgeComparison/AgeComparison"
import Head2Head from "./components/Head2Head/Head2Head"
import {
  BrowserRouter as Router,
  Link,
  Route // for later
} from 'react-router-dom'

function App() {
  return (
    <div id="the_app">
      <Header />
      <Router>
        <Route exact path="/" component={AgeComparison} />
        <Route path="/h2h" component={Head2Head} />
      </Router>
    </div>

  );
}

export default App;
