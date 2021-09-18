import React, { Component } from 'react';

class Connect extends Component {
  render() {
    return (
      /* Connect */
      <div className="container-fluid">
        <div className="row" style={{ justifyContent: 'center' }}>
          <h3 style={{ color: '#007bff', fontWeight: 'bold' }}>LIÊN KẾT KHÁC</h3>
        </div> <br />
        <div className="row" style={{ justifyContent: 'center' }}>
          <div className="col-2">
            <h5 className="text-center">HỆ THỐNG</h5>
            <p className="text-center">E-LEARNING</p>
            <p className="text-center">HỆ THỐNG QUẢN LÝ</p>
            <p className="text-center">XÁC NHẬN ĐƠN</p>
          </div>
          <div className="col-2">
            <h5 className="text-center">VĂN BẢN</h5>
            <p className="text-center">CẤP TRUNG ƯƠNG</p>
            <p className="text-center">CẤP BỘ</p>
            <p className="text-center">CẤP TRƯỜNG</p>
          </div>
          <div className="col-2">
            <h5 className="text-center">LIÊN KẾT</h5>
            <p className="text-center">PHÒNG TỔ CHỨC CÁN BỘ</p>
            <p className="text-center">PHÒNG ĐÀO TẠO</p>
            <p className="text-center">PHÒNG CT SINH VIÊN</p>
            <p className="text-center">PHÒNG QL KHOA HỌC</p>
          </div>
          <div className="col-2">
            <h5 className="text-center">ĐOÀN THỂ</h5>
            <p className="text-center">VP ĐẢNG ỦY TRƯỜNG</p>
            <p className="text-center">CÔNG ĐOÀN TRƯỜNG</p>
            <p className="text-center">VP ĐOÀN TRƯỜNG</p>
            <p className="text-center">VP ĐOÀN KHOA</p>
          </div>
          <div className="col-2">
            <h5 className="text-center">HỌC THUẬT</h5>
            <p className="text-center">CHUYÊN ĐỀ</p>
            <p className="text-center">CLB TIN HỌC</p>
            <p className="text-center">OLYMPIC TIN HỌC</p>
          </div>
        </div>
      </div>

    );
  }
}

export default Connect;