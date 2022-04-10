import React, { useEffect, useState } from "react";
import styles from "./css/content.module.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Uploadbook(props) {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const [loadingLoai, setLoadingLoai] = useState(true);
  const [loai, setLoai] = useState();
  const [loadingCD, setLoadingCD] = useState(true);
  const [cd, setCd] = useState();
  const history = useHistory();

  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[7].check == true) {
      console.log("");
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  useEffect(() => {
    const fetchLoai = async () => {
      setLoadingLoai(true);
      const { data } = await axios.get(`/getloai`);
      setLoai(data);
      setLoadingLoai(false);
    };
    fetchLoai();
  }, []);

  useEffect(() => {
    const fetchCD = async () => {
      setLoadingCD(true);
      const { data } = await axios.get(`/getchude`);
      setCd(data);
      setLoadingCD(false);
    };
    fetchCD();
  }, []);

  const [file, setFile] = useState();
  const [tieuDe, setTieuDe] = useState();
  const [tacGia, setTacGia] = useState();
  const [nhaXB, setNhaXB] = useState();
  const [viTri, setViTri] = useState();
  const [maHP, setMaHP] = useState();
  const [soLuong, setSoLuong] = useState();
  const [ngayXB, setNgayXB] = useState();
  const [hinhThuc, setHinhThuc] = useState();
  const [ngonNgu, setNgonNgu] = useState();
  const [loaiSach, setLoaiSach] = useState();
  const [chuDe, setChuDe] = useState();
  const [mieuTa, setMieuTa] = useState();

  // const namXB = new Date(ngayXB).toLocaleDateString();

  const send = (e) => {
    if (!file || !tieuDe || !tacGia 
        || !nhaXB || !viTri || !soLuong 
        || !ngayXB || !hinhThuc || !ngonNgu 
        || !loaiSach || !chuDe || !mieuTa
        || tieuDe === "" || tacGia === "" || nhaXB === ""
        || viTri === "" || soLuong === "" || soLuong === 0
        || hinhThuc === "" || ngonNgu === "" || loaiSach === ""
        || chuDe === "" || mieuTa === ""
      ) {
      alert("Vui lòng nhập đầy đủ thông tin");
    } else {
      // console.log(ngayXB);
      var mahp = "";
      if (!maHP){
        mahp = ""
      } else {
        mahp = maHP;
      }
      const data = new FormData();
      data.append("file", file);
      data.append("tieuDe", tieuDe);
      data.append("tacGia", tacGia);
      data.append("nhaXB", nhaXB);
      data.append("maHP", mahp);
      data.append("viTri", viTri);
      data.append("soLuong", soLuong);
      data.append("ngayXB", ngayXB);
      data.append("hinhThuc", hinhThuc);
      data.append("ngonNgu", ngonNgu);
      data.append("loaiSach", loaiSach);
      data.append("chuDe", chuDe);
      data.append("mieuTa", mieuTa);

      axios.post("/uploadbook", data);
      alert("Upload sách thành công, vui lòng đợi chờ duyệt!!!");
      history.push("/uploadbook");
      window.location.reload();
    }

  };

  return (
    <div className={`${styles.content}`}>
      <div className="container">
        <h3 className={`${styles.title}`}>Upload sách</h3>
        <hr />
        <div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Thêm ảnh sách</label>
            <input
              type="file"
              className="form-control-file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Tiêu đề sách</label>
            <input
              type="text"
              name="tieude"
              className="form-control"
              placeholder="Nhập tiêu đề sách"
              onChange={(e) => setTieuDe(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Nhập tác giả</label>
            <input
              type="text"
              name="tacgia"
              className="form-control"
              placeholder="Nhập tác giả sách"
              onChange={(e) => setTacGia(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Nhập nhà xuất bản</label>
            <input
              type="text"
              name="nhaxb"
              className="form-control"
              placeholder="Nhập nhà xuất bản sách"
              onChange={(e) => setNhaXB(e.target.value)}
              required
            />
          </div>
          <div className="form-group row">
            <div className="col-4">
              <label>Nhập mã học phần</label>
              <input
                type="text"
                name="mahp"
                className="form-control"
                placeholder="Nhập mã học phần sách"
                onChange={(e) => setMaHP(e.target.value)}
              />
            </div>
            <div className="col-4">
              <label><span className="text-danger">*</span> Nhập vị trí</label>
              <input
                type="text"
                name="vitri"
                className="form-control"
                placeholder="Nhập vị trí sách"
                onChange={(e) => setViTri(e.target.value)}
                required
              />
            </div>
            <div className="col-4">
              <label><span className="text-danger">*</span> Nhập số lượng</label>
              <input
                type="number"
                name="soluong"
                className="form-control"
                placeholder="Nhập số lượng sách"
                onChange={(e) => setSoLuong(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-4">
              <label><span className="text-danger">*</span> Ngày xuất bản</label>
              <input
                type="date"
                name="ngayxb"
                className="form-control"
                onChange={(e) => setNgayXB(e.target.value)}
                required
              />
            </div>
            <div className="col-4">
              <label><span className="text-danger">*</span> Chọn hình thức</label>
              <select
                className="form-control"
                onChange={(e) => setHinhThuc(e.target.value)}
                required
              >
                <option value="">Chọn hình thức mượn sách</option>
                <option value="Mượn về nhà">Mượn về nhà</option>
                <option value="Mượn tại chỗ">Mượn tại chỗ</option>
              </select>
            </div>
            <div className="col-4">
              <label><span className="text-danger">*</span> Chọn ngôn ngữ</label>
              <select
                className="form-control"
                onChange={(e) => setNgonNgu(e.target.value)}
                required
              >
                <option value="">Chọn ngôn ngữ</option>
                <option value="Tiếng Việt">Tiếng Việt</option>
                <option value="Ngôn ngữ khác">Ngôn ngữ khác</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Chọn loại sách</label>
            {loadingLoai ? (
              <div>Loading...</div>
            ) : (
              <select
                className="form-control"
                onChange={(e) => setLoaiSach(e.target.value)}
                required
              >
                <option value="">Loại sách</option>
                {loai.map((loai) => (
                  <option value={loai.id}>{loai.tenloai}</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label><span className="text-danger">*</span> Chọn chủ đề</label>
            {loadingCD ? (
              <div>Loading...</div>
            ) : (
              <select
                className="form-control"
                onChange={(e) => setChuDe(e.target.value)}
                required
              >
                <option value="">Chủ đề</option>
                {cd.map((cd) => (
                  <option value={cd.id}>{cd.tenchude}</option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Nhập miêu tả sách</label>
            <textarea
              name="mieuta"
              className="form-control w-100"
              onChange={(e) => setMieuTa(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary mb-2" onClick={send}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
}

export default Uploadbook;
