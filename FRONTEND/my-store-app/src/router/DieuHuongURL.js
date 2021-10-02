import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home/Home";
import SearchPro from "../components/search/SearchPro";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Login from "../components/login/Login";
import UserInfo from "../components/SidenavContent/UserInfo";
import RouterS from "../components/layout/RouterS";
import RouterH from "../components/layout/RouterH";
import UpdateInfo from "../components/login/UpdateInfo";
import Search from "../components/home/Search";
import Nav from "../components/layout/Nav";
import Sidenav from "../components/layout/Sidenav";
import BookTable from "../components/search/BookTable";
import Users from "../components/SidenavContent/Users";
import Books from "../components/SidenavContent/Books";
import Error from "../components/SidenavContent/Error";

class DieuHuongURL extends Component {
  render() {
    return (
      <div>

        <Switch>
          {/* home */}
          <Route exact path="/" render={() => (
            <>
              <Header />
              <Nav />
              <Search />
              <Home />
              <RouterS />
              <Footer />
            </>
          )} />

          <Route exact path="/searchpro" render={() => (
            <>
              <Header />
              <Nav />
              <div style={{ padding: "10px 0" }}>
                <SearchPro />
              </div>
              <BookTable />
              <RouterS />
              <Footer />
            </>
          )} />

          {/* management system page */}

          <Route exact path="/smp" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "220px" }}>
                <UserInfo />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/users" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "220px" }}>
                <Users />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/books" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "220px" }}>
                <Books />
              </div>
              <RouterH />
            </>
          )} />



























          <Route exact path="/error" render={() => (
            <>
              <Error />
            </>
          )} />
          {/* login */}
          <Route exact path="/login" render={() => (
            <>
              <Login />
            </>
          )} />

          <Route exact path="/updateinfo" render={() => (
            <>
              <UpdateInfo />
            </>
          )} />

        </Switch>

      </div>
    );
  }
}

export default DieuHuongURL;
