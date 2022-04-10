import React, { useEffect, useState } from "react";
import styles from "./css/themes.module.css";
import { Link, useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";

function Themes() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [chuDe, setChuDe] = useState([]);
  const [chuDe1, setChuDe1] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 5); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };

  const fetchChuDe = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getchude`);
    setLoading(false);
    setChuDe(data);
    setChuDe1(data);
    totalPagesCalculate(data.length);
  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[1].check == true) {
      fetchChuDe();
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  //=== Pagination
  const { page = 1 } = useParams();
  const filterChuDe = (chuDeList) => {
    chuDeList = chuDeList.map((item, index) => {
      return { ...item, index: index };
    });
    const firstParam = (page || 1) * 5 - 5;
    const secondParam = (page || 1) * 5;
    return chuDeList.slice(firstParam, secondParam);
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
  //=== them chu de
  const [cdSach, setCdSach] = useState();
  const send = (e) => {
    const data = new FormData();
    data.append("cdSach", cdSach);
    axios.post("/addtheme", data);
    fetchChuDe();
  };

  //=== tim kiem chu de
  const [cdSach2, setCdSach2] = useState();
  const search = () => {
    if (!cdSach2) {
      alert("Vui lòng thông tin cần tìm kiếm!!!");
    } else {
      // console.log(loaiSach2, ngayMuon2);
      setChuDe(chuDe1.filter((item) =>
        item.tenchude.includes(cdSach2)
      ));
    }
  };

  //=== sua chu de
  const [show, setShow] = useState(false);
  const [id1, setID1] = useState();
  const [cdSach1, setCdSach1] = useState();
  const handleShow = (e, index) => {
    setID1(chuDe[index].id);
    setCdSach1(chuDe[index].tenchude);
    setShow(true);
  };
  const handleClose = (e) => {
    setShow(false);
  };
  const send1 = (e) => {
    const data = {
      id1: id1,
      cdSach1: cdSach1,
    };
    axios.post("/updatetheme", data);
    setShow(false);
    fetchChuDe();
  };

  //=== xoa chu de
  const [show2, setShow2] = useState(false);
  const [id2, setID2] = useState();
  const handleShow2 = (e, index) => {
    setID2(chuDe[index].id);
    setShow2(true);
  };
  const handleClose2 = (e) => {
    setShow2(false);
  };
  const deleteTheme = (e) => {
    const data = {
      id2: id2,
    };
    axios.post("/deletetheme", data);
    setShow2(false);
    fetchChuDe();
  };

  return (
    <div className={`${styles.content}`}>
      <div className="container">
        <h3 className={`${styles.title}`}>Quản lý chủ đề sách</h3>
        <div className="row">
          <div className={`col-6`}>
            <div className={`${styles.wrap} col-12`}>
              <h5 className={`${styles.h5}`}>Thêm chủ đề</h5>
              <div>
                <div className="form-group">
                  <label>Chủ đề sách</label>
                  <input
                    type="text"
                    name="chude"
                    className="form-control"
                    placeholder="Nhập chủ đề sách"
                    onChange={(e) => setCdSach(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mb-2"
                  onClick={send}
                >
                  Thêm chủ đề sách
                </button>
              </div>
            </div>
          </div>
          <div className={`col-6`}>
            <div className={`${styles.wrap} col-12`}>
              <h5 className={`${styles.h5}`}>Tìm kiếm</h5>
              <div>
                <div className="form-group">
                  <label>Chủ đề sách</label>
                  <input
                    type="text"
                    name="cd"
                    className="form-control"
                    placeholder="Nhập chủ đề sách"
                    onChange={(e) => setCdSach2(e.target.value)}
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
                  <th className="align-middle text-center">Tên chủ đề sách</th>
                </tr>
                {filterChuDe(chuDe).map((chuDe, index) => (
                  <tr>
                    <td className="align-middle text-center">{chuDe.index + 1}</td>
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
                    <td className="align-middle text-center">{chuDe.tenchude}</td>
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
                        to={`/themes/page/${prevPage(page)}`}
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
                        <Link to={`/themes/page/${item}`} className="page-link">
                          {item}
                        </Link>
                      </li>
                    ))}
                    <li className="page-item">
                      <Link
                        to={`/themes/page/${nextPage(page)}`}
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
            Chỉnh sửa chủ đề
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="form-group">
              <label>Tên chủ đề</label>
              <input
                type="text"
                name="chude"
                className="form-control"
                placeholder="Nhập chủ đề sách"
                onChange={(e) => setCdSach1(e.target.value)}
                defaultValue={cdSach1}
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
          <Modal.Title id="example-modal-sizes-title-lg">Xóa chủ đề</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn xóa chủ đề này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={deleteTheme}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Themes;
