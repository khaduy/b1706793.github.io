import React, { Component } from "react";
import Banner from "./Banner";
import News from "./News";
import OtherLibrary from "./OtherLibrary";
import Connect from "./Connect";

class Home extends Component {
  render() {
    return (
      <>
        <Banner />
        <News />
        <OtherLibrary />
        <Connect />
      </>
    );
  }
}

export default Home;
