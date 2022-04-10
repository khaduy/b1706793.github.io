import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import styles from "./css/nav.module.css";

function Nav() {
  return (
    /* Navigation*/
    <nav className={`${styles.nav} navbar navbar-expand-lg navbar-light`} >
      <div className={`${styles.container} container-fluid col-10`}>
        <div className="navbar-collapse float-left">
          <ul className="navbar-nav">
            <li className={`${styles.li} nav-item`}>
              <Link
                className={`${styles.link} nav-link text-white`}
                to="/"
              >
                Trang chủ
              </Link>
            </li>
            <li className={`${styles.li} nav-item`}>
              <Link
                className={`${styles.link} nav-link text-white`}
                to="/searchpro"
              >
                Tìm kiếm tài liệu
              </Link>
            </li>
            <li className={`${styles.li} nav-item`}>
              <Link
                className={`${styles.link} nav-link text-white`}
                to="/introduce"
              >
                Giới thiệu
              </Link>
            </li>
            <li className={`${styles.li} nav-item`}>
              <Link
                className={`${styles.link} nav-link text-white`}
                to="/photos"
              >
                Ảnh
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Nav;
