import React, { useEffect, useState } from "react";
import styles from "./css/kinds.module.css";
import { Link, useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function Kinds() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [loai, setLoai] = useState([]);
  const [loai1, setLoai1] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 5); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };

  const fetchLoai = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getloai`);
    setLoading(false);
    setLoai(data);
    setLoai1(data);
    console.log(data);
    totalPagesCalculate(data.length);
  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[1].check == true) {
      fetchLoai();
    } else {
      history.push("/error");
    }
  }, [userInfo]);
  //=== Pagination
  const { page = 1 } = useParams();
  const filterLoai = (loaiList) => {
    loaiList = loaiList.map((item, index) => {
      return { ...item, index: index };
    });
    const firstParam = (page || 1) * 5 - 5;
    const secondParam = (page || 1) * 5;
    return loaiList.slice(firstParam, secondParam);
  };

  const prevPage = (num) => {
    let myNum = Number(num);
    if (myNum === 1) {
      return "1";
    } else if (myNum > 1 && myNum <= totalPages.length) {
      return (myNum = myNum - 1);
    }
  };

  const nextPage = (num) => {
    let myNum = Number(num);
    if (myNum === totalPages.length) {
      return totalPages.length;
    } else if (myNum < totalPages.length) {
      return (myNum = myNum + 1);
    }
  };
  //=== them loai sach
  const [loaiSach, setLoaiSach] = useState();
  const [ngayMuon, setNgayMuon] = useState([]);
  const send = (e) => {
    const data = new FormData();
    data.append("loaiSach", loaiSach);
    data.append("ngayMuon", ngayMuon);
    axios.post("/addkind", data);
    fetchLoai();
  };

  //=== tim kiem loai sach
  const [loaiSach2, setLoaiSach2] = useState();
  const [ngayMuon2, setNgayMuon2] = useState(0);
  const search = () => {
    if (!loaiSach2 && !ngayMuon2) {
      alert("Vui lòng thông tin cần tìm kiếm!!!");
    } else {
      console.log(loaiSach2, ngayMuon2);
      setLoai(loai1.filter((item) =>
        item.tenloai.includes(loaiSach2)
        || item.ngaymuon == ngayMuon2
      ));
    }
  };

  //== sua loai sach
  const [show, setShow] = useState(false);
  const [id1, setID1] = useState();
  const [loaiSach1, setLoaiSach1] = useState();
  const [ngayMuon1, setNgayMuon1] = useState([]);
  const handleShow = (e, index) => {
    setID1(loai[index].id);
    setLoaiSach1(loai[index].tenloai);
    setNgayMuon1(loai[index].ngaymuon);
    setShow(true);
  };
  const handleClose = (e) => {
    setShow(false);
  };
  const send1 = (e) => {
    const data = {
      id1: id1,
      loaiSach1: loaiSach1,
      ngayMuon1: ngayMuon1,
    };
    axios.post("/updatekind", data);
    setShow(false);
    fetchLoai();
  };

  //=== xoa sach
  const [show2, setShow2] = useState(false);
  const [id2, setID2] = useState();
  const handleShow2 = (e, index) => {
    setID2(loai[index].id);
    setShow2(true);
  };
  const handleClose2 = (e) => {
    setShow2(false);
  };
  const deleteKind = (e) => {
    const data = {
      id2: id2,
    };
    axios.post("/deletekind", data);
    setShow2(false);
    fetchLoai();
  };

  return (
    <div className={`${styles.content}`}>
      <div className="container">
        <h3 className={`${styles.title}`}>Quản lý loại sách</h3>
        <div className="row">
          <div className={`col-6`}>
            <div className={`${styles.wrap} col-12`}>
              <h5 className={`${styles.h5}`}>Thêm loại sách</h5>
              <div>
                <div className="form-group">
                  <label>Loại sách</label>
                  <input
                    type="text"
                    name="loai"
                    className="form-control"
                    placeholder="Nhập loại sách"
                    onChange={(e) => setLoaiSach(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ngày mượn</label>
                  <input
                    type="text"
                    name="ngay"
                    className="form-control"
                    placeholder="Nhập số ngày được mượn của loại sách"
                    onChange={(e) => setNgayMuon(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mb-2"
                  onClick={send}
                >
                  Thêm loại sách
                </button>
              </div>
            </div>
          </div>
          <div className={`col-6`}>
            <div className={`${styles.wrap} col-12`}>
              <h5 className={`${styles.h5}`}>Tìm kiếm</h5>
              <div>
                <div className="form-group">
                  <label>Nhập tên loại sách</label>
                  <input
                    type="text"
                    name="loai"
                    className="form-control"
                    placeholder="Nhập loại sách cần tìm kiếm"
                    onChange={(e) => setLoaiSach2(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Ngày mượn</label>
                  <input
                    type="number"
                    name="ngay"
                    className="form-control"
                    placeholder="Nhập số ngày được mượn của loại sách"
                    onChange={(e) => setNgayMuon2(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mb-2"
                  onClick={search}
                >
                  Tìm kiếm
                </button>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <div> Loading... </div>
        ) : (

          <div>
            <table
              className="table table-bordered my-3 text-nowrap"
              id="dataTable"
              width="100%"
              cellSpacing={0}
            >
              <tbody>
                <tr className="thead-light">
                  <th className="align-middle text-center">STT</th>
                  <th className="align-middle text-center">Sửa</th>
                  <th className="align-middle text-center">Xoá</th>
                  <th className="align-middle text-center">Tên loại sách</th>
                  <th className="align-middle text-center">Số ngày mượn</th>
                </tr>
                {filterLoai(loai).map((loai, index) => (
                  <tr>
                    <td className="align-middle text-center">{loai.index+1}</td>
                    <td
                      className="align-middle text-center"
                      onClick={(e) => handleShow(e, index)}
                    >
                      <span>
                        <i className="fas fa-edit text-success"></i>
                      </span>
                    </td>
                    <td
                      className="align-middle text-center"
                      onClick={(e) => handleShow2(e, index)}
                    >
                      <span>
                        <i className="far fa-trash-alt text-danger"></i>
                      </span>
                    </td>
                    <td className="align-middle text-center">{loai.tenloai}</td>
                    <td className="align-middle text-center">{loai.ngaymuon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <br />
            <div className="row">
              <div
                className="col-12"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <Link
                        to={`/kinds/page/${prevPage(page)}`}
                        className="page-link"
                      >
                        Prev
                      </Link>
                    </li>
                    {totalPages.map((item) => (
                      <li
                        className={`${item === Number(page) ? "active" : ""
                          } page-item`}
                      >
                        <Link to={`/kinds/page/${item}`} className="page-link">
                          {item}
                        </Link>
                      </li>
                    ))}
                    <li className="page-item">
                      <Link
                        to={`/kinds/page/${nextPage(page)}`}
                        className="page-link"
                      >
                        Next
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

        )}
      </div>
      <Modal
        show={show}
        onHide={(e) => handleClose(e)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Chỉnh sửa sách
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="form-group">
              <label>Loại sách</label>
              <input
                type="text"
                name="loai"
                className="form-control"
                placeholder="Nhập loại sách"
                onChange={(e) => setLoaiSach1(e.target.value)}
                defaultValue={loaiSach1}
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày mượn</label>
              <input
                type="number"
                name="ngay"
                className="form-control"
                placeholder="Nhập số ngày được mượn của loại sách"
                onChange={(e) => setNgayMuon1(e.target.value)}
                defaultValue={ngayMuon1}
                required
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={send1}>
            Chỉnh sửa
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={show2}
        onHide={(e) => handleClose2(e)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Xóa loại sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn xóa loại sách này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={deleteKind}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Kinds;
