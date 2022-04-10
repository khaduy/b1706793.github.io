import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./css/error.module.css";
function Error() {
  return (
    <div>
      <div className={`${styles.overlay} overlay`} />
      <div className={`${styles.loginBox} login-box`}>
        <div className={`${styles.update} card`}>
          <div className={`${styles.cardBody} card-body login-card-body`}>

            <div className="row">
              <div className={`${styles.col1} col-3 `}>
                <div className={`${styles.col1} row`}>
                  <div className={`${styles.icon}`}>
                    <i className={` fas fa-exclamation-triangle text-warning`} />
                  </div>
                </div>
              </div>
              <div className="col-9">
                <div className={`${styles.content} error-content`}>
                  <h3>
                    <b>Không có quyền truy cập.</b>
                  </h3>
                  <p>Bạn chưa được cấp quyền để truy cập vào chức năng này</p>
                  <Link to="/" className={`${styles.link}`}>Nhấn vào đây để về lại trang chủ</Link>
                </div>
              </div>
            </div>

            <hr />
          </div>
          <div id="loader" className="overlay dark d-none">
            <i className="fas fa-2x fa-spinner fa-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Error;
