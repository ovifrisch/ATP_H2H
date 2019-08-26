import React from 'react';
import './App.css';
import Header from "./components/Header"
import AgeComparison from "./components/AgeComparison/AgeComparison"
import Head2Head from "./components/Head2Head/Head2Head"
import {
  BrowserRouter as Router,
  Link,
  Route // for later
} from 'react-router-dom'

function App() {
  return (
    <Router>
      <Header />
      <Route exact path="/" component={AgeComparison} />
      <Route path="/h2h" component={Head2Head} />
    </Router>

  );
}

export default App;
