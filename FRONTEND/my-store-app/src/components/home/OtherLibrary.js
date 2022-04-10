import React, { Component } from 'react';

class Other_library extends Component {
  render() {
    return (
      /* other library */
      <div className="container-fluid">
        <div className="row" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#007bff', fontWeight: 'bold' }}>LIÊN KẾT THƯ VIỆN</h3>
        </div> <br />
        <div className="row" style={{ justifyContent: 'center' }}>
          <div className="col-2">
            <a href="http://www.thuvienbinhduong.org.vn" target="_blank"><img src="./images/binhduong.png" alt="" className="w-100" /></a>
          </div>
          <div className="col-2">
            <a href="http://www.vnulib.edu.vn" target="_blank"><img src="./images/HCM.png" alt="" className="w-100" /></a>
          </div>
          <div className="col-2">
            <a href="http://thuvien.ftu.edu.vn/sites/default.aspx" target="_blank"><img src="./images/ngoaithuong.png" alt="" className="w-100" /></a>
          </div>
          <div className="col-2">
            <a href="http://thuviendanang.vn" target="_blank"><img src="./images/danang.png" alt="" className="w-100" /></a>
          </div>
          <div className="col-2">
            <a href="http://nlv.gov.vn" target="_blank"><img src="./images/quocgia.png" alt="" className="w-100" /></a>
          </div>
        </div> <br /> <br />
      </div>

    );
  }
}

export default Other_library;