import React, { Component } from 'react';
import styles from "./css/connect.module.css";
class Connect extends Component {
  render() {
    return (
      /* Connect */
      <div className="container-fluid">
        <div className="row" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#007bff', fontWeight: 'bold' }}>LIÊN KẾT KHÁC</h3>
        </div> <br />
        <div className="row" style={{ justifyContent: 'center' }}>
          <div className="col-2">
            <h5 className="text-center">HỆ THỐNG</h5>
            <a href="https://elcit.ctu.edu.vn/" target="_blank" className={`${styles.a}`}><p className="text-center">E-LEARNING</p></a>
            <a href="http://htql.ctu.edu.vn/" target="_blank" className={`${styles.a}`}><p className="text-center">HỆ THỐNG QUẢN LÝ</p></a>
            <a href="http://www.cit.ctu.edu.vn/vpk/login" target="_blank" className={`${styles.a}`}><p className="text-center">XÁC NHẬN ĐƠN</p></a>
          </div>
          <div className="col-2">
            <h5 className="text-center">VĂN BẢN</h5>
            <a href="http://www.ctu.edu.vn/vbctu.php" target="_blank" className={`${styles.a}`}><p className="text-center">CẤP TRUNG ƯƠNG</p></a>
            <a href="http://www.ctu.edu.vn/vbcb.php" target="_blank" className={`${styles.a}`}><p className="text-center">CẤP BỘ</p></a>
            <a href="http://www.ctu.edu.vn/vbct.php" target="_blank" className={`${styles.a}`}><p className="text-center">CẤP TRƯỜNG</p></a>
          </div>
          <div className="col-2">
            <h5 className="text-center">LIÊN KẾT</h5>
            <a href="https://dp.ctu.edu.vn/" target="_blank" className={`${styles.a}`}><p className="text-center">PHÒNG TỔ CHỨC CÁN BỘ</p></a>
            <a href="https://daa.ctu.edu.vn/" target="_blank" className={`${styles.a}`}><p className="text-center">PHÒNG ĐÀO TẠO</p></a>
            <a href="https://dsa.ctu.edu.vn/" target="_blank" className={`${styles.a}`}><p className="text-center">PHÒNG CT SINH VIÊN</p></a>
            <a href="https://dra.ctu.edu.vn/" target="_blank" className={`${styles.a}`}><p className="text-center">PHÒNG QL KHOA HỌC</p></a>
          </div>
          <div className="col-2">
            <h5 className="text-center">ĐOÀN THỂ</h5>
            <a href="http://cpv.ctu.edu.vn/" target="_blank" className={`${styles.a}`}><p className="text-center">VP ĐẢNG ỦY TRƯỜNG</p></a>
            <a href="http://tu.ctu.edu.vn/" target="_blank" className={`${styles.a}`}><p className="text-center">CÔNG ĐOÀN TRƯỜNG</p></a>
            <a href="http://yu.ctu.edu.vn/" target="_blank" className={`${styles.a}`}><p className="text-center">VP ĐOÀN TRƯỜNG</p></a>
            <a href="http://www.cit.ctu.edu.vn/doankhoa/en/" target="_blank" className={`${styles.a}`}><p className="text-center">VP ĐOÀN KHOA</p></a>
          </div>
          <div className="col-2">
            <h5 className="text-center">HỌC THUẬT</h5>
            <a href="http://www.cit.ctu.edu.vn/index.php/nghien-c-u/cac-chuyen-d" target="_blank" className={`${styles.a}`}><p className="text-center">CHUYÊN ĐỀ</p></a>
            <a href="https://elcit.ctu.edu.vn/course/view.php?id=418" target="_blank" className={`${styles.a}`}><p className="text-center">CLB TIN HỌC</p></a>
            <a href="https://elcit.ctu.edu.vn/enrol/index.php?id=340" target="_blank" className={`${styles.a}`}><p className="text-center">OLYMPIC TIN HỌC</p></a>
          </div>
        </div>
      </div>

    );
  }
}

export default Connect;