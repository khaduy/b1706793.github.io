import React from 'react'
import { NavLink } from 'react-router-dom';
import styles from "./css/sidenav.module.css";

function Sidenav() {
  return (
    <div className={`${styles.sidebarWrapper} sidebar-wrapper`}>
      <div className={`${styles.sidebar} ${styles.left} sidebar left `}>
        <ul className={`${styles.navul} list-sidebar`}>
          <li className={`${styles.navli}`}>
            <NavLink to="/smp" className={`${styles.nava} nav-link`} >
              Thông tin cá nhân
            </NavLink>
          </li>
          <li className={`${styles.navli}`}>
            <NavLink to="/users" className={`${styles.nava} nav-link`}>
              Quản lý người dùng
            </NavLink>
          </li>
          <li className={`${styles.navli}`}>
            <NavLink to="books" className={`${styles.nava} nav-link`}>
              <span className={`${styles.navLabel}`}>Quản lý sách</span>
            </NavLink>
          </li>
          <li className={`${styles.navli}`}>
            <NavLink to="#" className={`${styles.nava} nav-link`}>
              <span className={`${styles.navLabel}`}>Quản lý tin tức</span>
            </NavLink>
          </li>
          <li className={`${styles.navli}`}>
            <NavLink to="#" className={`${styles.nava} nav-link`}>
              <span className={`${styles.navLabel}`}>Nhật ký mượn sách</span>
            </NavLink>
          </li>
          <li className={`${styles.navli}`}>
            <NavLink to="#" className={`${styles.nava} nav-link`}>
              <span className={`${styles.navLabel}`}>Upload sách</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidenav
