import React, { useEffect, useState } from "react";
import styles from "./css/login.module.css";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dangNhapUser } from "../../actions";

function Login(props) {
  const [usernames, setUsername] = useState("");
  const [passwords, setPassword] = useState("");
  const history = useHistory()
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(dangNhapUser(usernames, passwords));
  };
 
  useEffect(() => {
    if (userInfo){
      if ( userInfo.type === "pg" ) {
        history.push("/updateinfo"); 
        // window.location.reload();
      } else {
        history.push("/"); 
        // window.location.reload();
      }
    }
  }, [userInfo]);

  return (
    <div>
      <div className={`${styles.overlay} overlay`} />
      <div className={`${styles.loginBox} login-box`}>
        <div className={`${styles.card} card`}>
          <div className={`${styles.cardBody} card-body login-card-body`}>
            <div className="login-logo">
              <img
                src="./images/logo.png"
                alt="icon login"
                className={`${styles.icon} icon`}
              />
            </div>
            <h4 className="text-primary text-center">Đăng nhập</h4>
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-block"
              >
                Đăng nhập
              </button>
            </form>
            <hr />
          </div>
          <div id="loader" className="overlay dark d-none">
            <i className="fas fa-2x fa-spinner fa-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
