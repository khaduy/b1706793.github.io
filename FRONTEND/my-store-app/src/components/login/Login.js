import React, { Component } from "react";
import styles from './login.module.css';

class Login extends Component {
  render() {
    return (
      <div>
        <div>
          <div className={`${styles.overlay} overlay`} />
          <div className={`${styles.loginBox} login-box`}>
            <div className={`${styles.card} card`}>
              <div className={`${styles.cardBody} card-body login-card-body`}>
                <div className="login-logo">
                  <img src="./images/logo.png" alt="icon login" className={`${styles.icon} icon`} />
                </div>
                <h4 className="text-primary text-center">Đăng nhập</h4>
                <form>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      id="pUsername"
                      required
                    />
                  </div>
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      id="pPassword"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    onclick
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
      </div>
    );
  }
}

export default Login;
