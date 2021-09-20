import React, { Component } from "react";

class Header extends Component {
  render() {
    return (
      /* Header*/
      <header className="bg-primary py-1">
        <div className="container-fluid text-white">
          <div className="row">
            <div className="col-1 align-self-center">
              <img
                src="./images/logo.png"
                className="img-fluid"
                alt="Responsive image"
              />
            </div>
            <div className="col-8" style={{ margin: "auto 0" }}>
              <h5>THƯ VIỆN KHOA</h5>
              <h4>CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG</h4>
            </div>
            <div className="col-3 text-right" style={{ margin: "auto 0" }}>
              <h5>Chào mừng đến với thư viện</h5>
              <h6>Xin chào: Kha Thiên Duy</h6>
              <div
                classname="text-light"
                style={{ cursor: "pointer" }}
                onclick="signout();"
              >
                <i className="fas fa-sign-out-alt"></i> <b>Đăng xuất</b>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
