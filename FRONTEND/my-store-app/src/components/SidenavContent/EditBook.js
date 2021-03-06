import React, { useEffect, useState } from "react";
import styles from "./css/editbook.module.css";
import { useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";

function EditBook(props) {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  const { id } = useParams();

  const [loadingLoai, setLoadingLoai] = useState(true);
  const [loai, setLoai] = useState();
  const [loadingCD, setLoadingCD] = useState(true);
  const [cd, setCd] = useState();

  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState([]);
  const fetchBook = async () => {
    setLoading(true);
    const { data } = await axios.get(`/editbook1/${id}`);
    setLoading(false);
    setBook(data);
  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[1].check == true) {
      fetchBook();
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
    if (
      tieuDe === "" ||
      tacGia === "" || nhaXB === "" ||
      viTri === "" || soLuong === "" ||
      soLuong === 0 || hinhThuc === "" ||
      ngonNgu === "" || loaiSach === "" ||
      chuDe === "" || mieuTa === ""
    ) {
      alert("Vui l??ng nh???p ?????y ????? th??ng tin");
    } else {
      var tieude = "";
      if (!tieuDe) {
        tieude = book[0].tensach;
      } else {
        tieude = tieuDe;
      }
      var tacgia = "";
      if (!tacGia) {
        tacgia = book[0].tacgia;
      } else {
        tacgia = tacGia;
      }
      var nhaxb = "";
      if (!nhaXB) {
        nhaxb = book[0].nhaxb;
      } else {
        nhaxb = nhaXB;
      }
      var mahp = "";
      if (!maHP) {
        mahp = book[0].mahp;
      } else {
        mahp = maHP;
      }
      var vitri = "";
      if (!viTri) {
        vitri = book[0].vitri;
      } else {
        vitri = viTri;
      }
      var soluong = "";
      if (!soLuong) {
        soluong = book[0].soluong;
      } else {
        soluong = soLuong;
      }
      var ngayxb = "";
      if (!ngayXB) {
        ngayxb = book[0].namxb;
      } else {
        ngayxb = ngayXB;
      }
      var hinhthuc = "";
      if (!hinhThuc) {
        hinhthuc = book[0].hinhthuc;
      } else {
        hinhthuc = hinhThuc;
      }
      var ngonngu = "";
      if (!ngonNgu) {
        ngonngu = book[0].ngonngu;
      } else {
        ngonngu = ngonNgu;
      }
      var loaisach = "";
      if (!loaiSach) {
        loaisach = book[0].loaisachid;
      } else {
        loaisach = loaiSach;
      }
      var chude = "";
      if (!chuDe) {
        chude = book[0].chudeid;
      } else {
        chude = chuDe;
      }
      var mieuta = "";
      if (!mieuTa) {
        mieuta = book[0].mieuta;
      } else {
        mieuta = mieuTa;
      }
      if (!file) {
        const data = new FormData();
        data.append("tieuDe", tieude);
        data.append("tacGia", tacgia);
        data.append("nhaXB", nhaxb);
        data.append("maHP", mahp);
        data.append("viTri", vitri);
        data.append("soLuong", soluong);
        data.append("ngayXB", ngayxb);
        data.append("hinhThuc", hinhthuc);
        data.append("ngonNgu", ngonngu);
        data.append("loaiSach", loaisach);
        data.append("chuDe", chude);
        data.append("mieuTa", mieuta);
        data.append("sachid", id);

        console.log(mahp);
        axios.post("/editbook", data);
        alert("Ch???nh s???a s??ch th??nh c??ng");
        history.push("/books");
      } else {
        const data = new FormData();
        data.append("file", file);
        data.append("tieuDe", tieude);
        data.append("tacGia", tacgia);
        data.append("nhaXB", nhaxb);
        data.append("maHP", mahp);
        data.append("viTri", vitri);
        data.append("soLuong", soluong);
        data.append("ngayXB", ngayxb);
        data.append("hinhThuc", hinhthuc);
        data.append("ngonNgu", ngonngu);
        data.append("loaiSach", loaisach);
        data.append("chuDe", chude);
        data.append("mieuTa", mieuta);
        data.append("sachid", id);

        // console.log(file);
        axios.post("/editbook", data);
        alert("Ch???nh s???a s??ch th??nh c??ng");
        history.push("/books");
      }
    }
  };

  //=== Modal Image
  const [show, setShow] = useState(false);
  const [link, setLink] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div className={`${styles.content}`}>
      {book.map((book) => (
        <div className="container">
          <h3 className={`${styles.title}`}>Ch???nh s???a s??ch</h3>
          <hr />
          <div>
            <label>Ch???nh s???a ???nh s??ch</label>
            <div className="row">
              <div className="col-3">
                <div className="form-group">
                  <input
                    type="file"
                    className="form-control-file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                  />
                </div>
              </div>
              <div className="col-4" onClick={handleShow}>
                <Button
                  variant="primary"
                  onClick={() => setLink(`http://localhost:4000/${book.hinhanh}`)}
                >
                  Xem ???nh c??
                </Button>
              </div>
            </div>

            <div className="form-group">
              <label>Ti??u ????? s??ch</label>
              <input
                type="text"
                name="tieude"
                className="form-control"
                placeholder="Nh???p ti??u ????? s??ch"
                onChange={(e) => setTieuDe(e.target.value)}
                defaultValue={book.tensach}
                required
              />
            </div>
            <div className="form-group">
              <label>Nh???p t??c gi???</label>
              <input
                type="text"
                name="tacgia"
                className="form-control"
                placeholder="Nh???p t??c gi??? s??ch"
                onChange={(e) => setTacGia(e.target.value)}
                defaultValue={book.tacgia}
                required
              />
            </div>
            <div className="form-group">
              <label>Nh???p nh?? xu???t b???n</label>
              <input
                type="text"
                name="nhaxb"
                className="form-control"
                placeholder="Nh???p nh?? xu???t b???n s??ch"
                onChange={(e) => setNhaXB(e.target.value)}
                defaultValue={book.nhaxb}
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
                  defaultValue={book.mahp}
                />
              </div>
              <div className="col-4">
                <label>Nh???p v??? tr??</label>
                <input
                  type="text"
                  name="vitri"
                  className="form-control"
                  placeholder="Nh???p v??? tr?? s??ch"
                  onChange={(e) => setViTri(e.target.value)}
                  defaultValue={book.vitri}
                  required
                />
              </div>
              <div className="col-4">
                <label>Nh???p s??? l?????ng</label>
                <input
                  type="number"
                  name="soluong"
                  className="form-control"
                  placeholder="Nh???p s??? l?????ng s??ch"
                  onChange={(e) => setSoLuong(e.target.value)}
                  defaultValue={book.soluong}
                  required
                />
              </div>
            </div>
            <div className="form-group row">
              <div className="col-4">
                <label>Ng??y xu???t b???n</label>
                <input
                  type="date"
                  name="ngayxb"
                  className="form-control"
                  onChange={(e) => setNgayXB(e.target.value)}
                  defaultValue={book.namxb}
                  required
                />
              </div>
              <div className="col-4">
                <label>Ch???n h??nh th???c</label>
                <select
                  className="form-control"
                  onChange={(e) => setHinhThuc(e.target.value)}
                  defaultValue={book.hinhthuc}
                  required
                >
                  <option value="">Ch???n h??nh th???c m?????n s??ch</option>
                  <option value="M?????n v??? nh??">M?????n v??? nh??</option>
                  <option value="M?????n t???i ch???">M?????n t???i ch???</option>
                </select>
              </div>
              <div className="col-4">
                <label>Ch???n ng??n ng???</label>
                <select
                  className="form-control"
                  onChange={(e) => setNgonNgu(e.target.value)}
                  defaultValue={book.ngonngu}
                  required
                >
                  <option value="">Ch???n ng??n ng???</option>
                  <option value="Ti???ng Vi???t">Ti???ng Vi???t</option>
                  <option value="Ng??n ng??? kh??c">Ng??n ng??? kh??c</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Ch???n lo???i s??ch</label>
              {loadingLoai ? (
                <div>Loading...</div>
              ) : (
                <select
                  className="form-control"
                  onChange={(e) => setLoaiSach(e.target.value)}
                  defaultValue={book.loaisachid}
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
              <label>Ch???n ch??? ?????</label>
              {loadingCD ? (
                <div>Loading...</div>
              ) : (
                <select
                  className="form-control"
                  onChange={(e) => setChuDe(e.target.value)}
                  defaultValue={book.chudeid}
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
              <label>Nh???p mi??u t??? s??ch</label>
              <textarea
                name="mieuta"
                className="form-control w-100"
                onChange={(e) => setMieuTa(e.target.value)}
                defaultValue={book.mieuta}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={send}
            >
              Ch???nh s???a s??ch
            </button>
          </div>
        </div>
      ))}
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-75w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body className={`${styles.modalBody}`}>
          <img
            src={link}
            className={`${styles.imgModal}`}
            alt=""
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default EditBook;
