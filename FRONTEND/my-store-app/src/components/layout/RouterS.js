import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./css/router.module.css";
class RouterS extends Component {
  render() {
    return (
      <div className={`${styles.hotline}`}>
        <Link to="/smp" style={{ textDecoration: "none" }}>
          <span className="text-light">QUẢN TRỊ HỆ THỐNG</span>
        </Link>
      </div>
    );
  }
}

export default RouterS;
