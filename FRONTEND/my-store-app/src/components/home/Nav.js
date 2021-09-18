import React, { Component } from 'react';

class Nav extends Component {
  render() {
    return (
      /* Navigation*/
      <nav className="navbar navbar-expand-lg navbar-light bg-secondary">
        <div className="container-fluid col-10" style={{ paddingLeft: 0 }}>
          <div className="navbar-collapse float-left">
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link text-white" href="#" style={{ textTransform: 'uppercase', fontWeight: 600, paddingRight: '30px' }}>Trang chủ</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="#" style={{ textTransform: 'uppercase', fontWeight: 600, paddingRight: '30px' }}>Tìm kiếm tài liệu</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="#" style={{ textTransform: 'uppercase', fontWeight: 600, paddingRight: '30px' }}>Giới thiệu</a></li>
              <li className="nav-item"><a className="nav-link text-white" href="#" style={{ textTransform: 'uppercase', fontWeight: 600, paddingRight: '30px' }}>Ảnh</a></li>
              {/*<li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle text-white" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown"
                  aria-expanded="false">Shop</a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a class="dropdown-item" href="#!">All Products</a></li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li><a class="dropdown-item" href="#!">Popular Items</a></li>
                  <li><a class="dropdown-item" href="#!">New Arrivals</a></li>
                </ul>
              </li>*/}
            </ul>
          </div>
        </div>
      </nav>

    );
  }
}

export default Nav;