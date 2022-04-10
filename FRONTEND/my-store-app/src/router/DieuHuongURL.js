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
import Photos from "../components/album/Photos";
import Images from "../components/SidenavContent/Images";
import AddBook from "../components/SidenavContent/AddBook";
import DetailPrt from "../components/product/DetailPrt";
import BorrowReturn from "../components/SidenavContent/BorrowReturn";
import Kinds from "../components/SidenavContent/Kinds";
import Themes from "../components/SidenavContent/Themes";
import Diary from "../components/SidenavContent/Diary";
import DetailNews from "../components/news/DetailNews";
import AddNews from "../components/SidenavContent/AddNews";
import ListNews from "../components/SidenavContent/ListNews";
import Uploadbook from "../components/SidenavContent/Uploadbook";
import Savedbooks from "../components/SidenavContent/Savedbooks";
import Dashboard from "../components/SidenavContent/Dashboard";
import BookCensorship from "../components/SidenavContent/BookCensorship";
import GioiThieu from "../components/gioithieu/GioiThieu";
import EditBook from "../components/SidenavContent/EditBook";
import StatusBook from "../components/SidenavContent/StatusBook";

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
          <Route exact path="/home" render={() => (
            <>
              <Header />
              <Nav />
              <Search />
              <Home />
              <RouterS />
              <Footer />
            </>
          )} />
          <Route exact path="/home/page/:page" render={() => (
            <>
              <Header />
              <Nav />
              <Search />
              <Home />
              <RouterS />
              <Footer />
            </>
          )} />

          <Route exact path="/search" render={() => (
            <>
              <Header />
              <Nav />
              <Search />
              <div style={{ paddingBottom: "195px" }}>
                <BookTable />
              </div>
              <RouterS />
              <Footer />
            </>
          )} />
          <Route exact path="/search/danhmuc=:dM&&keyword=:kW" render={() => (
            <>
              <Header />
              <Nav />
              <Search />
              <div style={{ paddingBottom: "144px" }}>
                <BookTable />
              </div>
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
              <RouterS />
              <Footer />
            </>
          )} />
          <Route exact path="/searchpro/page/:page" render={() => (
            <>
              <Header />
              <Nav />
              <div style={{ padding: "10px 0" }}>
                <SearchPro />
              </div>
              <RouterS />
              <Footer />
            </>
          )} />

          <Route exact path="/detailprt/:id" render={() => (
            <>
              <Header />
              <Nav />
              <div style={{ padding: "10px 0" }}>
                <DetailPrt />
              </div>
              <RouterS />
              <Footer />
            </>
          )} />

          <Route exact path="/detailnews/:id" render={() => (
            <>
              <Header />
              <Nav />
              <div style={{ padding: "10px 0" }}>
                <DetailNews />
              </div>
              <RouterS />
              <Footer />
            </>
          )} />

          <Route exact path="/introduce" render={() => (
            <>
              <Header />
              <Nav />
              <div style={{ padding: "10px 0" }}>
                <GioiThieu />
              </div>
              <RouterS />
              <Footer />
            </>
          )} />

          <Route exact path="/photos" render={() => (
            <>
              <Header />
              <Nav />
              <div style={{ padding: "10px 0" }}>
                <Photos />
              </div>
              <RouterS />
              <Footer />
            </>
          )} />
          <Route exact path="/photos/page/:page" render={() => (
            <>
              <Header />
              <Nav />
              <div style={{ padding: "10px 0" }}>
                <Photos />
              </div>
              <RouterS />
              <Footer />
            </>
          )} />

          {/* management system page */}

          <Route exact path="/smp" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <UserInfo />
              </div>
              <RouterH />
            </>
          )} />

          <Route exact path="/books" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Books />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/books/page/:page" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Books />
              </div>
              <RouterH />
            </>
          )} />

          <Route exact path="/addbooks" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px", paddingBottom: "30px" }}>
                <AddBook />
              </div>
              <RouterH />
            </>
          )} />

          <Route exact path="/editbook/:id" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px", paddingBottom: "30px" }}>
                <EditBook />
              </div>
              <RouterH />
            </>
          )} />

          <Route exact path="/kinds" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px", paddingBottom: "20px" }}>
                <Kinds />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/kinds/page/:page" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px", paddingBottom: "30px" }}>
                <Kinds />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/themes" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px", paddingBottom: "30px" }}>
                <Themes />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/themes/page/:page" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px", paddingBottom: "30px" }}>
                <Themes />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/statusbook" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px", paddingBottom: "30px" }}>
                <StatusBook />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/bookcensorship" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px", paddingBottom: "30px" }}>
                <BookCensorship />
              </div>
              <RouterH />
            </>
          )} />

          <Route exact path="/borrowreturn" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <BorrowReturn />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/borrowreturn/page/:page" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <BorrowReturn />
              </div>
              <RouterH />
            </>
          )} />

          <Route exact path="/diary" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Diary />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/diary/page/:page" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Diary />
              </div>
              <RouterH />
            </>
          )} />

          <Route exact path="/users" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Users />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/users/page/:page" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Users />
              </div>
              <RouterH />
            </>
          )} />

          <Route exact path="/images" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Images />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/image/page/:page" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Images />
              </div>
              <RouterH />
            </>
          )} />

          <Route exact path="/listnews" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <ListNews />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/listnews/page/:page" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <ListNews />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/addnews" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <AddNews />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/uploadbook" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Uploadbook />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/savedbooks" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Savedbooks />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/dashboard" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Dashboard />
              </div>
              <RouterH />
            </>
          )} />
          <Route exact path="/dashboard/page/:page" render={() => (
            <>
              <Header />
              <Sidenav />
              <div style={{ marginLeft: "250px", marginRight: "10px" }}>
                <Dashboard />
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
