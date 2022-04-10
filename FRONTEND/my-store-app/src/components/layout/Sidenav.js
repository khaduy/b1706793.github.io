import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./css/sidenav.module.css";

function Sidenav(props) {
  return (
    <div className={`${styles.sidebarWrapper} sidebar-wrapper`}>
      <div
        id="layoutSidenav"
        className={`${styles.sidebar} ${styles.left} sidebar`}
      >
        <div id="layoutSidenav_nav" className={`${styles.layoutSidenav}`}>
          <nav
            className="sb-sidenav accordion sb-sidenav-light"
            id="sidenavAccordion"
          >
            <div className="sb-sidenav-menu">
              <div className="nav">
                <NavLink className={`${styles.navLink} nav-link`} to="/smp">
                  Thông tin cá nhân
                </NavLink>

                <NavLink
                  className={`${styles.navLink} nav-link collapsed`}
                  to="#"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseLayouts"
                  aria-expanded="false"
                  aria-controls="collapseLayouts"
                >
                  Quản lý sách
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down" />
                  </div>
                </NavLink>
                <div
                  className="collapse"
                  id="collapseLayouts"
                  aria-labelledby="headingOne"
                  data-bs-parent="#sidenavAccordion"
                >
                  <nav className="sb-sidenav-menu-nested nav">
                    <NavLink className={`${styles.navLink2} nav-link`} to="/books">
                      <span className={`${styles.span}`}> Quản lý kho sách </span>
                    </NavLink>
                    <NavLink className={`${styles.navLink2} nav-link`} to="/addbooks">
                      <span className={`${styles.span}`}> Thêm sách </span>
                    </NavLink>
                    <NavLink className={`${styles.navLink2} nav-link`} to="/kinds">
                      <span className={`${styles.span}`}> Quản lý loại sách </span>
                    </NavLink>
                    <NavLink className={`${styles.navLink2} nav-link`} to="/themes">
                      <span className={`${styles.span}`}> Quản lý chủ đề </span>
                    </NavLink>
                    <NavLink className={`${styles.navLink2} nav-link`} to="/statusbook">
                      <span className={`${styles.span}`}> Trạng thái sách </span>
                    </NavLink>
                    <NavLink className={`${styles.navLink2} nav-link`} to="/bookcensorship">
                      <span className={`${styles.span}`}> Duyệt sách </span>
                    </NavLink>
                  </nav>
                </div>

                <NavLink className={`${styles.navLink} nav-link`} to="/borrowreturn">
                  Mượn sách - Trả sách
                </NavLink>
                <NavLink className={`${styles.navLink} nav-link`} to="/diary">
                  Nhật ký mượn sách
                </NavLink>
                <NavLink className={`${styles.navLink} nav-link`} to="/users">
                  Quản lý người dùng
                </NavLink>
                <NavLink className={`${styles.navLink} nav-link`} to="/images">
                  Quản lý hình ảnh
                </NavLink>

                <NavLink
                  className={`${styles.navLink} nav-link collapsed`}
                  to="#"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseLayouts1"
                  aria-expanded="false"
                  aria-controls="collapseLayouts1"
                >
                  Quản lý tin tức
                  <div className="sb-sidenav-collapse-arrow">
                    <i className="fas fa-angle-down" />
                  </div>
                </NavLink>
                <div
                  className="collapse"
                  id="collapseLayouts1"
                  aria-labelledby="headingOne"
                  data-bs-parent="#sidenavAccordion"
                >
                  <nav className="sb-sidenav-menu-nested nav">
                    <NavLink className={`${styles.navLink2} nav-link`} to="/listnews">
                      <span className={`${styles.span}`}> Danh sách tin tức </span>
                    </NavLink>
                    <NavLink className={`${styles.navLink2} nav-link`} to="/addnews">
                      <span className={`${styles.span}`}> Thêm tin tức </span>
                    </NavLink>
                   
                  </nav>
                </div>
                <NavLink className={`${styles.navLink} nav-link`} to="/uploadbook">
                  Upload sách
                </NavLink>
                <NavLink className={`${styles.navLink} nav-link`} to="/savedbooks">
                  Sách đã lưu
                </NavLink>
                <NavLink className={`${styles.navLink} nav-link`} to="/dashboard">
                  Thống kê
                </NavLink>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Sidenav;
