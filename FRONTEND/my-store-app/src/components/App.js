import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import DieuHuongURL from "./../router/DieuHuongURL";


class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <DieuHuongURL />
        </div>
      </Router>
    );
  }
}

export default App;
