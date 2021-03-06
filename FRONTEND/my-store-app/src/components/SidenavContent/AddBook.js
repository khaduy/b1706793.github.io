import React, { useEffect, useState } from "react";
import styles from "./css/content.module.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function AddBook(props) {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const [loadingLoai, setLoadingLoai] = useState(true);
  const [loai, setLoai] = useState();
  const [loadingCD, setLoadingCD] = useState(true);
  const [cd, setCd] = useState();
  const history = useHistory();

  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[1].check == true) {
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
      alert("Vui l??ng nh???p ?????y ????? th??ng tin");
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

      // console.log(hinhThuc);
      axios.post("/addbook", data);
      alert("Th??m s??ch th??nh c??ng");
      history.push("/books");
    }

  };
 
  return (
    <div className={`${styles.content}`}>
      <div className="container">
        <h3 className={`${styles.title}`}>Th??m s??ch</h3>
        <hr />
        <div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Th??m ???nh s??ch</label>
            <input
              type="file"
              className="form-control-file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Ti??u ????? s??ch</label>
            <input
              type="text"
              name="tieude"
              className="form-control"
              placeholder="Nh???p ti??u ????? s??ch"
              onChange={(e) => setTieuDe(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Nh???p t??c gi???</label>
            <input
              type="text"
              name="tacgia"
              className="form-control"
              placeholder="Nh???p t??c gi??? s??ch"
              onChange={(e) => setTacGia(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Nh???p nh?? xu???t b???n</label>
            <input
              type="text"
              name="nhaxb"
              className="form-control"
              placeholder="Nh???p nh?? xu???t b???n s??ch"
              onChange={(e) => setNhaXB(e.target.value)}
              required
            />
          </div>
          <div className="form-group row">
            <div className="col-4">
              <label>Nh???p m?? h???c ph???n</label>
              <input
                type="text"
                name="mahp"
                className="form-control"
                placeholder="Nh???p m?? h???c ph???n"
                onChange={(e) => setMaHP(e.target.value)}
              />
            </div>
            <div className="col-4">
              <label><span className="text-danger">*</span> Nh???p v??? tr??</label>
              <input
                type="text"
                name="vitri"
                className="form-control"
                placeholder="Nh???p v??? tr?? s??ch"
                onChange={(e) => setViTri(e.target.value)}
                required
              />
            </div>
            <div className="col-4">
              <label><span className="text-danger">*</span> Nh???p s??? l?????ng</label>
              <input
                type="number"
                name="soluong"
                className="form-control"
                placeholder="Nh???p s??? l?????ng s??ch"
                onChange={(e) => setSoLuong(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-group row">
            <div className="col-4">
              <label><span className="text-danger">*</span> Ng??y xu???t b???n</label>
              <input
                type="date"
                name="ngayxb"
                className="form-control"
                onChange={(e) => setNgayXB(e.target.value)}
                required
              />
            </div>
            <div className="col-4">
              <label><span className="text-danger">*</span> Ch???n h??nh th???c</label>
              <select
                className="form-control"
                onChange={(e) => setHinhThuc(e.target.value)}
                required
              >
                <option value="">Ch???n h??nh th???c m?????n s??ch</option>
                <option value="M?????n v??? nh??">M?????n v??? nh??</option>
                <option value="M?????n t???i ch???">M?????n t???i ch???</option>
              </select>
            </div>
            <div className="col-4">
              <label><span className="text-danger">*</span >Ch???n ng??n ng???</label>
              <select
                className="form-control"
                onChange={(e) => setNgonNgu(e.target.value)}
                required
              >
                <option value="">Ch???n ng??n ng???</option>
                <option value="Ti???ng Vi???t">Ti???ng Vi???t</option>
                <option value="Ng??n ng??? kh??c">Ng??n ng??? kh??c</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Ch???n lo???i s??ch</label>
            {loadingLoai ? (
              <div>Loading...</div>
            ) : (
              <select
                className="form-control"
                onChange={(e) => setLoaiSach(e.target.value)}
                required
              >
                <option value="">Lo???i s??ch</option>
                {loai.map((loai) => (
                  <option value={loai.id}>{loai.tenloai}</option>
                ))}
              </select>
            )}
          </div>

          <div className="form-group">
            <label><span className="text-danger">*</span> Ch???n ch??? ?????</label>
            {loadingCD ? (
              <div>Loading...</div>
            ) : (
              <select
                className="form-control"
                onChange={(e) => setChuDe(e.target.value)}
                required
              >
                <option value="">Ch??? ?????</option>
                {cd.map((cd) => (
                  <option value={cd.id}>{cd.tenchude}</option>
                ))}
              </select>
            )}
          </div>
          <div className="form-group">
            <label><span className="text-danger">*</span> Nh???p mi??u t??? s??ch</label>
            <textarea
              name="mieuta"
              className="form-control w-100"
              onChange={(e) => setMieuTa(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary mb-2" onClick={send}>
            Th??m s??ch
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddBook;
