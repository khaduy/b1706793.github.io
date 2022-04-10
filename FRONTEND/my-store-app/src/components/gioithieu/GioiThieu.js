import React from "react";
import styles from "./gioithieu.module.css";
function GioiThieu() {
  return (
    <div className={`container`} style={{ paddingTop: "10px" }}>
      <div className="row" style={{ justifyContent: "center" }}>
        <div className={`${styles.wrap} col-8`}>
          <h4 className="text-center text-primary">
            TỔNG QUAN VỀ KHOA CÔNG NGHỆ THÔNG TIN VÀ TRUYỀN THÔNG
          </h4>{" "}
          <br />
          <h6>1. Lịch sử hình thành và phát triển Khoa</h6>
          <span>
            Khoa Công nghệ thông tin và truyền thông (CNTT&TT) được thành lập
            năm 1994 trên cơ sở nâng cấp từ Trung tâm Điện tử & Tin học (được
            thành lập năm 1990). Kể từ khi thành lập, Khoa đã trở thành một
            trong bảy khoa trọng điểm về lĩnh vực CNTT&TT của Việt Nam. Khoa có
            nhiệm vụ đào tạo nguồn nhân lực lượng cao, góp phần tích cực vào sự
            phát triển của nền công nghiệp công nghệ thông tin Việt Nam; đồng
            thời thực hiện nghiên cứu khoa học và chuyển giao công nghệ tiên
            tiến, góp phần đẩy mạnh nghiệp công nghiệp hóa, hiện đại hóa đất
            nước.
          </span>
          <br />
          <span>
            Trãi qua gần 30 năm xây dựng và phát triển, thương hiệu Khoa CNTT&TT
            của Trường ĐHCT đã trở thành địa chỉ uy tín trong đào tạo nguồn nhân
            lực đáp ứng nhu cầu phát triển kinh tế xã hội. Hiện, Khoa đang sở
            hữu cơ sở vật chất khang trang và đội ngũ giảng viên vững mạnh toàn
            diện. Đặc biệt, trong những năm gần đây, Khoa đã vinh dự nhận được
            nhiều danh hiệu cao quý, như Cờ thi đua và Bằng khen của Bộ Giáo dục
            và Đào tạo, Bằng khen của Thủ tướng và Huân chương lao động hạng ba
            của Chủ tịch nước.
          </span>{" "}
          <br /> <br />
          <h6>2. Thư viện khoa</h6>
          <span>
            Thư viện Khoa Công nghệ thông tin và truyền thông chính thức đi vào
            hoạt động vào ngày 20/11/2019. Cùng với sảnh Khoa CNTT&TT, thư viện
            Khoa cũng được trang bị bàn ghế và phòng máy lạnh giúp sinh viên có
            không gian học tập, học nhóm với nhau.
          </span>{" "}
          <br />
          <span>
            Thư viện Khoa với 3.431 đầu sách, tạp chí, ebook và cơ sở dữ liệu
            điện tử sẽ là nguồn tư liệu quí báu hỗ trợ đắc lực cho công tác học
            tập, giảng dạy và nghiên cứu khoa học.
          </span>
          <br />
          <span>
            Vị trí của thư viện: nằm giữa Văn phòng khoa và Văn phòng Đoàn khoa
            (cầu thang số 1).
          </span>
          <hr />
        </div>
      </div>
    </div>
  );
}

export default GioiThieu;
