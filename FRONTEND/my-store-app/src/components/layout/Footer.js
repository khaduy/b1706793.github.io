import React, { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      /* footer */
      <div className="container-fluid bg-secondary">
        <div className="row" style={{ justifyContent: 'center' }}>
          <div className="col-0.5 align-self-center">
            <a href="#" className="logo-header"><img alt="" src="./images/logo.png" style={{ height: '60px' }} /></a>
          </div>
          <div className="col-9">
            <br />
            <address><strong>THƯ VIỆN KHOA CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG TRƯỜNG ĐẠI HỌC CẦN THƠ</strong><br />
              Khu 2 - Đường 3/2 - Q.Ninh Kiều - TP.Cần Thơ<br />
              ĐT: 0292 3 831565 - Email: office@cit.ctu.edu.vn<br />
            </address>
          </div>
          <div className="col-md-3">
          </div>
        </div>
      </div>

    );
  }
}

export default Footer;