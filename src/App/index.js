import React, { Component } from 'react';
import './style.css';
import Tweets from "../Tweets";

class App extends Component {

  render() {
    return (
      <div
          className="app-container"
      >
        <p className="tweets-analysis-service">Tweets Analysis Service </p>
        <Tweets />
      </div>
    );
  }
}

export default App;
