import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import DieuHuongURL from "./../router/DieuHuongURL";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import Login from "./login/Login";
import UserInfo from "./SidenavContent/UserInfo";
import RouterS from "./layout/RouterS";
import RouterH from "./layout/RouterH";
import UpdateInfo from "./login/UpdateInfo";

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
