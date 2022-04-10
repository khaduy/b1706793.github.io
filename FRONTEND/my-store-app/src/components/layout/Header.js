import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { DANG_XUAT } from "../../constants";

function Header() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory()
  const dispatch = useDispatch();
  const dangXuat = () => {
    dispatch({ type: DANG_XUAT });
  };
  useEffect(() => {
    if (userInfo) {
      if (userInfo.check === false) {
        history.push("/updateinfo");
        window.location.reload();
      }
    } else {
      history.push("/login");
      window.location.reload();
    }
  }, [userInfo]);

  return (
    /* Header*/
    <header className="bg-primary py-1" >
      <div className="container-fluid text-white">
        <div className="row">
          <div className="col-1 align-self-center">
            <Link to="/">
              <img
                src="/images/logo.png"
                className="img-fluid"
                alt="Responsive image"
              />
            </Link>

          </div>
          <div className="col-8" style={{ margin: "auto 0" }}>
            <h5>THƯ VIỆN KHOA</h5>
            <h4>CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG</h4>
          </div>
          <div className="col-3 text-right" style={{ margin: "auto 0" }}>

            <h5>Chào mừng đến với thư viện</h5>
            {userInfo ? (
              <>
                <h6 style={{ textTransform: "capitalize" }}>Xin chào: {userInfo.hoten}</h6>
              </>
            ) : (
              <div> test </div>
            )}
            <div>
              <Link to="/login"
                onClick={dangXuat}
                style={{ textDecoration: "none", color: "#FFF", }}
              ><i className="fas fa-sign-out-alt"></i> <b>Đăng xuất</b></Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
