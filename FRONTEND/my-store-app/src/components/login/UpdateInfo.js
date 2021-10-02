import React, { useEffect, useState } from "react";
import styles from "./css/login.module.css";
import { capNhatUser } from "../../actions";
import { BrowserRouter as Router, Route, Switch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

function UpdateInfo(props) {
  const dispatch = useDispatch();
  const history = useHistory()
  const dangNhap = useSelector((state) => state.dangNhap);
  console.log('dangNhap', dangNhap)
  const { userInfo } = dangNhap;

  const [username, setUsername] = useState();
  const [hoten, setHoten] = useState();
  const [diachi, setDiachi] = useState();
  const [sdt, setSdt] = useState();
  const [email, setEmail] = useState();

  const handleSubmit = async (e) => {
    var un = userInfo?.usernames;
    var token = userInfo?.token;
    var check = true;
    e.preventDefault();
    const info = {
      check,
      token,
      un,
      hoten,
      diachi,
      sdt,
      email
    };
    dispatch(capNhatUser(info));
    history.push("/");
    var userCurrent = localStorage.getItem("userInfo")
    userCurrent = JSON.parse(userCurrent);
    localStorage.removeItem("userInfo");
    localStorage.setItem("userInfo", JSON.stringify({ userInfo: info }));
    
    
    // window.location.reload();
  };

  useEffect(() => {
    if (userInfo) {
      if (userInfo.check === true) {
        history.push("/");
        // window.location.reload();
      }
    } else {
      history.push("/login");
      // window.location.reload();
    }
  }, [userInfo]);

  return (
    <div>
      <div className={`${styles.overlay} overlay`} />
      <div className={`${styles.loginBox} login-box`}>
        <div className={`${styles.update} card`}>
          <div className={`${styles.cardBody} card-body login-card-body`}>
            <div className="login-logo">
              <img
                src="./images/logo.png"
                alt="icon login"
                className={`${styles.icon1} icon`}
              />
            </div>
            <h4 className="text-primary text-center">Cập nhật thông tin</h4>
            <form
              className="container-fluid"
              style={{ justifyContent: "center" }}
              onSubmit={handleSubmit}
            >
              <div className="row">
                <div className="form-group col-6">
                  <label
                    htmlFor="hoten"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập họ tên
                  </label>
                  <input
                    type="text"
                    id="hoten"
                    name="hoten"
                    className="form-control"
                    placeholder="nhập họ tên của bạn"
                    onChange={(e) => setHoten(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-6">
                  <label
                    htmlFor="diachi"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập địa chỉ của bạn
                  </label>
                  <input
                    type="text"
                    id="diachi"
                    name="diachi"
                    className="form-control"
                    placeholder="nhập địa chỉ hiện tại của bạn"
                    onChange={(e) => setDiachi(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-6">
                  <label
                    htmlFor="sdt"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập số điện thoại
                  </label>
                  <input
                    type="text"
                    id="sdt"
                    name="sdt"
                    className="form-control"
                    placeholder="nhập số điện thoại của bạn"
                    onChange={(e) => setSdt(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-6">
                  <label
                    htmlFor="email"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="nhập email của bạn"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div
                  className="col-md-12"
                  style={{ textAlign: "right" }}
                  id="btnedit"
                >
                  <button
                    style={{ maxHeight: "38px" }}
                    type="submit"
                    className="btn btn-primary"
                  >
                    Cập nhật thông tin
                  </button>
                </div>
              </div>
            </form>
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

export default UpdateInfo;
