import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import styles from "./css/userinfo.module.css";
import { Modal, Button } from "react-bootstrap";

function UserInfo() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [permit, setPermit] = useState([]);
  const fetchPermit = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getpermittrue/${userInfo.username}`);
    setLoading(false);
    setPermit(data);
  };
  const [loading1, setLoading1] = useState(false);
  const [diary, setDiary] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };
  const [user, setUser] = useState([]);
  const fetchUser = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getdetailuser/${userInfo.username}`);
    setLoading(false);
    console.log(data);
    setUser(data);

  };
  const fetchDiary = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getdiary/${userInfo.username}`);
    setLoading(false);
    setDiary(data);
    totalPagesCalculate(data.length);
  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[0].check == true) {
      fetchUser();
      fetchPermit();
      fetchDiary();
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  //=== Modal sua thong tin
  const [hoten, setHoten] = useState();
  const [diachi, setDiachi] = useState();
  const [sdt, setSdt] = useState();
  const [email, setEmail] = useState();
  const [show, setShow] = useState(false);
  const handleShow = (e, index) => {
    setHoten(user[index].hoten);
    setDiachi(user[index].diachi);
    setSdt(user[index].sdt);
    setEmail(user[index].email);
    setShow(true);
  };
  const handleClose = (e) => {
    setShow(false);
  };
  const edit = (e) => {
    const info = {
      check: "true",
      id: userInfo.id,
      username: userInfo.username,
      hoten: hoten,
      diachi: diachi,
      sdt: sdt,
      email: email
    };
    axios.put("/edituser", info);
    var userCurrent = localStorage.getItem("userInfo");
    userCurrent = JSON.parse(userCurrent);
    localStorage.removeItem("userInfo");
    localStorage.setItem("userInfo", JSON.stringify({ userInfo: info }));
    setShow(false);
    fetchUser();
    window.location.reload();
  };
  

  //=== Pagination
  const { page = 1 } = useParams();
  const filterDiary = (diaryList) => {
    const firstParam = (page || 1) * 8 - 8;
    const secondParam = (page || 1) * 8;
    return diaryList.slice(firstParam, secondParam);
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
  return (
    <div className={`${styles.content}`}>
      <div className="container">
        <h3 className={`${styles.title}`}>Thông tin cá nhân</h3>
        <div className="row justify-content-around">
          <div className={`col-6`}>
            <div className={`${styles.wrap1} col-12`}>
              {user.map((user, index) => (
                <ul className={`${styles.ul}`}>
                  <button
                    className= {`${styles.btn} btn buttons-excel buttons-html5 btn-success mr-4`}
                    tabIndex={0}
                    aria-controls="dataTable"
                    type="button"
                    onClick={(e) => handleShow(e, index)}
                  >
                    <span>
                      <div>
                        Sửa thông tin
                      </div>
                    </span>
                  </button>
                  <hr />
                  <li>
                    <label className={`${styles.label}`}>Mã người dùng:</label>
                    <label className={`${styles.label2}`}>
                      {user.usernames}
                    </label>
                  </li>
                  <li>
                    <label className={`${styles.label}`}>Họ tên:</label>
                    <label className={`${styles.label1}`}>{user.hoten}</label>
                  </li>
                  <li>
                    <label className={`${styles.label}`}>Số điện thoại:</label>
                    <label className={`${styles.label1}`}>{user.sdt}</label>
                  </li>
                  <li>
                    <label className={`${styles.label}`}>Email:</label>
                    <label className={`${styles.label1}`}>{user.email}</label>
                  </li>
                  <li>
                    <label className={`${styles.label}`}>Địa chỉ:</label>
                    <label className={`${styles.label1}`}>
                      {user.diachi}
                    </label>
                  </li>
                </ul>
              ))}
            </div>
          </div>
          <div className={`col-6`}>
            <div className={`${styles.wrap2} col-12`}>
              <h5 className={`${styles.h5}`}>Bảng phân quyền</h5>
              {loading ? (
                <div> Loading... </div>
              ) : (
                <ul>
                  {permit.map((permit) => (
                    <li>
                      <label className={`${styles.label3}`}>
                        {permit.tenquyen}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <br />
        <div className={`${styles.diary} `}>
          <h3 className={`${styles.title}`}>Lịch sử mượn sách</h3>
          {loading1 ? (
            <div> Loading... </div>
          ) : (
            <div className="table-responsive">
              <table
                className="table  table-bordered my-3 text-nowrap"
                id="dataTable"
                width="100%"
                cellSpacing={0}
              >
                <tbody className={`${styles.tbody}`}>
                  <tr className="thead-light">
                    <th className="align-middle text-center">Mã sách</th>
                    <th className="align-middle text-center">MSSV</th>
                    <th className="align-middle text-center">Tên người mượn</th>
                    <th className="align-middle text-center">
                      Tên sách được mượn
                    </th>
                    <th className="align-middle text-center">Mã học phần</th>
                    <th className="align-middle text-center">Ngày mượn</th>
                    <th className="align-middle text-center">Ngày trả</th>
                    <th className="align-middle text-center">Phải trả trước</th>
                    <th className="align-middle text-center">Trạng thái</th>
                    <th
                      className="align-middle text-center"
                      style={{ minWidth: "500px" }}
                    >
                      Ghi chú
                    </th>
                  </tr>
                  {!diary.length ? (
                    <tr>
                      <td colSpan="12" className="align-middle text-center">Không có dữ liệu</td>
                    </tr>
                  ) : (

                    filterDiary(diary).map((diary, index) => (
                      <tr>
                        {/* <td className="align-middle text-center">{index + 1}</td> */}
                        <td className="align-middle text-center">{diary.sachid}</td>
                        <td className="align-middle text-center text-uppercase">
                          {diary.username}
                        </td>
                        <td className="align-middle text-center">{diary.hoten}</td>
                        <td className="align-middle text-center">
                          {diary.tensach}
                        </td>
                        <td className="align-middle text-center text-uppercase">{diary.mahp}</td>
                        <td className="align-middle text-center">
                          {diary.ngaymuon}
                        </td>

                        <>
                          {(() => {
                            if (diary.ngaytra === "1/1/1999, 12:00:00 AM") {
                              return (
                                <td className="align-middle text-center">
                                  Chưa trả
                                </td>
                              );
                            } else {
                              return (
                                <td className="align-middle text-center">
                                  {diary.ngaytra}
                                </td>
                              );
                            }
                          })()}
                        </>

                        <td className="align-middle text-center">
                          {diary.thoigian}
                        </td>

                        {(() => {
                          const date1 = diary.ngaytra;
                          const date11 = date1.toLocaleString("en-US");
                          const date111 = new Date(date11);

                          const date2 = new Date("1/1/1999, 12:00:00 AM");
                          const date22 = date2.toLocaleString("en-US");
                          const date222 = new Date(date22);

                          const date3 = diary.thoigian;
                          const date33 = date3.toLocaleString("en-US");
                          // const date34 = date3.toLocaleString("en-GB");
                          const date333 = new Date(date33);

                          const date4 = new Date();
                          const date44 = date4.toLocaleString("en-US");
                          const date444 = new Date(date44);

                          // console.log("thoigian: ", date444);

                          if (date111.getTime() === date222.getTime()) {
                            if (date444.getTime() < date333.getTime()) {
                              return (
                                <td className="align-middle text-center">
                                  Còn hạn
                                </td>
                              );
                            } else if (date444.getTime() > date333.getTime()) {
                              return (
                                <td className="align-middle text-center">
                                  Hết hạn
                                </td>
                              );
                            }
                          } else if (date111.getTime() !== date222.getTime()) {
                            if (date111.getTime() <= date333.getTime()) {
                              return (
                                <td className="align-middle text-center">
                                  Đúng hạn
                                </td>
                              );
                            } else if (date111.getTime() > date333.getTime()) {
                              return (
                                <td className="align-middle text-center">
                                  Trễ hạn
                                </td>
                              );
                            }
                          }
                        })()}

                        <td
                          className="align-middle text-center"
                          style={{ maxWidth: "500px" }}
                        >
                          {diary.ghichu}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
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
                      to={`/diary/page/${prevPage(page)}`}
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
                      <Link to={`/diary/page/${item}`} className="page-link">
                        {item}
                      </Link>
                    </li>
                  ))}
                  <li className="page-item">
                    <Link
                      to={`/diary/page/${nextPage(page)}`}
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
      </div>

      <Modal
        show={show}
        onHide={(e) => handleClose(e)}
        aria-labelledby="example-modal-sizes-title-lg"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Chỉnh sửa thông tin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <form
              // className="container-fluid"
              style={{ justifyContent: "center" }}
            >
              <div className="row">
                <div className="form-group col-6">
                  <label
                    htmlFor="hoten"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập họ tên
                  </label>
                  <input
                    type="text"
                    id="hoten"
                    name="hoten"
                    className="form-control"
                    placeholder="nhập họ tên của bạn"
                    defaultValue={hoten}
                    onChange={(e) => setHoten(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-6">
                  <label
                    htmlFor="diachi"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập địa chỉ của bạn
                  </label>
                  <input
                    type="text"
                    id="diachi"
                    name="diachi"
                    className="form-control"
                    placeholder="nhập địa chỉ hiện tại của bạn"
                    defaultValue={diachi}
                    onChange={(e) => setDiachi(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-6">
                  <label
                    htmlFor="sdt"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập số điện thoại
                  </label>
                  <input
                    type="text"
                    id="sdt"
                    name="sdt"
                    className="form-control"
                    placeholder="nhập số điện thoại của bạn"
                    defaultValue={sdt}
                    onChange={(e) => setSdt(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-6">
                  <label
                    htmlFor="email"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập email
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className="form-control"
                    placeholder="nhập email của bạn"
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={edit}>
            Chỉnh sửa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default UserInfo;
