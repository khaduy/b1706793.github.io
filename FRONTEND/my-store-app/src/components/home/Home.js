import React, { Component } from "react";
import Header from "../layout/Header";
import Nav from "./Nav";
import Search from "./Search";
import Banner from "./Banner";
import News from "./News";
import Other_library from "./Other_library";
import Connect from "./Connect";
import Footer from "../layout/Footer";

class Home extends Component {
  render() {
    return (
      <div>
        <Header />
        <Nav />
        <Search />
        <Banner />
        <News />
        <Other_library />
        <Connect />
        <Footer />
      </div>
    );
  }
}

export default Home;
