import React, { Component } from "react";
import { Link } from "react-router-dom";
import styles from "./css/router.module.css";
class RouterH extends Component {
  render() {
    return (
      <div className={`${styles.hotline}`}>
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="text-light">VỀ TRANG CHỦ</span>
        </Link>
      </div>
    );
  }
}

export default RouterH;
