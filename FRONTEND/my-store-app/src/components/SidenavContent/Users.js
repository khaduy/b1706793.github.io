import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./css/users.module.css";
import { Modal, Button } from "react-bootstrap";
import { CSVLink, CSVDownload } from "react-csv";
import ReactToPrint from "react-to-print";

function Users() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [user1, setUser1] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };

  const [currentUser, setCurrentUser] = useState("");
  const [permit, setPermit] = useState([]);
  const [permit1, setPermit1] = useState([]);
  const [edit, setEdit] = useState([]);
  const [isBlocked, setIsBlocked] = useState([]);

  const fetchUser = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getuser`);
    console.log(data);
    var list = [];
    var listEdit = [];
    var listBlock = [];
    for (let i = 0; i < data.length; i++) {
      list.push({ usernames: data[i].usernames });
      listEdit.push({ value: false });
      listBlock.push({ check: data[i].check, usernames: data[i].usernames });
    }
    setEdit(listEdit);
    setPermit(list);
    setIsBlocked(listBlock);
    setUser(data);
    totalPagesCalculate(data.length);
    setLoading(false);
  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[4].check == true) {
      fetchUser();
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  const [isBlocked1, setIsBlocked1] = useState([]);
  //=== Modal 1
  const [show1, setShow1] = useState(false);
  const handleShow1 = (e, index) => {
    var data1 = isBlocked[index].usernames;
    var data2 = userInfo.username;
    console.log(data1, data2)
    if (data1 == data2) {
      alert("Không tự khóa được chính mình");
    } else {
      setIsBlocked1(isBlocked[index].usernames);
      setShow1(true);
    }
  };
  const handleClose1 = (e) => {
    setShow1(false);
  };
  const block = (e) => {
    const check = "false";
    const data = {
      "un": isBlocked1,
      "check": check
    }
    axios.put("/block", data);
    fetchUser();
    setShow1(false);
  };

  //=== Modal 2
  const [show2, setShow2] = useState(false);
  const handleShow2 = (e, index) => {
    var data1 = isBlocked[index].usernames;
    var data2 = userInfo.username;
    console.log(data1, data2)
    if (data1 == data2) {
      alert("Không tự mở khóa được chính mình");
    } else {
      setIsBlocked1(isBlocked[index].usernames);
      setShow2(true);
    }
  };
  const handleClose2 = (e) => {
    setShow2(false);
  };
  const unBlock = (e) => {
    const check = "true";
    const data = {
      "un": isBlocked1,
      "check": check
    }
    axios.put("/unblock", data);
    fetchUser();
    setShow2(false);
  };

  //=== Modal
  const [show, setShow] = useState(false);
  const [loading1, setLoading1] = useState(false);

  var usernames = "";
  const handleShow = async (e, index) => {
    var list = [...permit];
    list[index].value = true;
    var data1 = list[index].usernames;
    var data2 = userInfo.username;
    if (data1 == data2) {
      alert("Không tự phân quyền được chính mình");
      return;
    } else {
      setEdit(list);
      setShow(true);
      usernames = list[index].usernames;
      console.log(list[index].usernames);
      fetchPermit();
    }
  };
  const fetchPermit = async (e, index) => {
    setLoading1(true);
    const { data } = await axios.get(`/getpermit/${usernames}`);
    setPermit1(data);
    setLoading1(false);
  };
  const handleClose = (e) => {
    var list = [...permit];
    for (let i = 0; i < list.length; i++) {
      if (list[i].value) {
        list[i].value = false;
      }
    }
    setEdit(list);
    // console.log(list);
    setShow(false);
  };
  const handleCheckChange = async (permit, index) => {
    const data = {
      checked: !permit.check,
      index: index + 1,
      usernames: permit.usernames,
    };

    axios.put(`/editpermit/${permit.usernames}`, data);
    await fetchPermit1(permit.usernames);
  };
  const fetchPermit1 = async (userName) => {
    setLoading1(true);
    const { data } = await axios.get(`/getpermit/${userName}`);
    setPermit1(data);
    setLoading1(false);
  };

  //=== bo loc
  var tvkd = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    return str;
  };
  const [MA0, setMa0] = useState();
  const [TEN0, setTen0] = useState();
  const handleClickSearch = async (e) => {
    e.preventDefault();
    fetchUser1();
  };
  const fetchUser1 = async () => {
    var ma0 = "";
    var ma00 = "";
    if (!MA0) {
      ma0 = "nbsp";
    } else {
      ma00 = tvkd(MA0);
      if (ma00 === "") {
        ma0 = "nbsp";
      } else {
        ma0 = ma00;
      }
    }
    var ten0 = "";
    var ten00 = "";
    if (!TEN0) {
      ten0 = "nbsp";
    } else {
      ten00 = tvkd(TEN0);
      if (ten00 === "") {
        ten0 = "nbsp";
      } else {
        ten0 = ten00;
      }
    }
    setLoading(true);
    const { data } = await axios.get(`/searchuser/ma0=${ma0}&&ten0=${ten0}`);
    console.log(data);
    var list = [];
    var listEdit = [];
    var listBlock = [];
    for (let i = 0; i < data.length; i++) {
      list.push({ usernames: data[i].usernames });
      listEdit.push({ value: false });
      listBlock.push({ check: data[i].check, usernames: data[i].usernames });
    }
    setEdit(listEdit);
    setPermit(list);
    setIsBlocked(listBlock);
    setUser(data);
    totalPagesCalculate(data.length);
    setLoading(false);
  };

  //=== export excel
  const headers = [
    { label: "STT", key: "stt" },
    { label: "Mã người dùng", key: "manguoidung" },
    { label: "Tên người dùng", key: "tennguoidung" },
    { label: "Địa chỉ", key: "diachi" },
    { label: "Số điện thoại", key: "sdt" },
    { label: "Email", key: "email" },
  ];
  const excel = user.map((user, index) => ({
    stt: index + 1,
    manguoidung: user.usernames,
    tennguoidung: user.hoten,
    diachi: user.diachi,
    sdt: user.sdt,
    email: user.email
  }));

  //=== export pdf
  const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
      <div ref={ref}>
        <table
          className="table table-bordered my-3 text-nowrap"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <tbody className={`${styles.tbody}`}>
            <tr className="thead-light">
              <th className="align-middle text-center">STT</th>
              <th className="align-middle text-center">Mã người dùng</th>
              <th className="align-middle text-center">Họ và tên</th>
              <th className="align-middle text-center">Địa chỉ</th>
              <th className="align-middle text-center">Số điện thoại</th>
              <th className="align-middle text-center">Email</th>

            </tr>
            {!loading && filterUser(user).map((user, index) => (
              <tr>
                <td className="align-middle text-center">{index + 1}</td>
                <td className="align-middle text-center text-uppercase">
                  {user.usernames}
                </td>
                <td className="align-middle text-center">{user.hoten}</td>
                <td className="align-middle text-center">{user.diachi}</td>
                <td className="align-middle text-center">{user.sdt}</td>
                <td className="align-middle text-center">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
  const componentRef = useRef();

  //=== Modal sua thong tin
  const [hoten4, setHoten4] = useState();
  const [username4, setUsername4] = useState();
  const [diachi4, setDiachi4] = useState();
  const [sdt4, setSdt4] = useState();
  const [email4, setEmail4] = useState();
  const [show4, setShow4] = useState(false);
  const handleShow4 = (e, index) => {
    var data1 = user[index].usernames;
    var data2 = userInfo.username
    if (data1 == data2) {
      alert("Không tự chỉnh sửa được chính mình");
      return;
    } else {
      setUsername4(user[index].usernames);
      setHoten4(user[index].hoten);
      setDiachi4(user[index].diachi);
      setSdt4(user[index].sdt);
      setEmail4(user[index].email);
      setShow4(true);
    }
  };
  const handleClose4 = (e) => {
    setShow4(false);
  };
  const edit4 = (e) => {
    const info = {
      username: username4,
      hoten: hoten4,
      diachi: diachi4,
      sdt: sdt4,
      email: email4
    };
    axios.put("/edituser", info);
    setShow4(false);
    fetchUser();
    window.location.reload();
  };

  //=== Pagination
  const { page = 1 } = useParams();
  const filterUser = (userList) => {
    const firstParam = (page || 1) * 8 - 8;
    const secondParam = (page || 1) * 8;
    return userList.slice(firstParam, secondParam);
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
    <div className={`${styles.content} `}>
      <form className="col-12" >
        <div className="row">
          <div className="form-group col">
            <label
              htmlFor="ma"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Nhập mã người dùng
            </label>
            <input
              type="text"
              id="ma"
              name="ma"
              className="form-control"
              placeholder="Nhập mã người dùng cần tìm kiếm"
              onChange={(e) => setMa0(e.target.value)}
            />
          </div>
          <div className="form-group col">
            <label
              htmlFor="tennguoidung"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Nhập tên người dùng
            </label>
            <input
              type="text"
              id="tennguoidung"
              name="tennguoidung"
              className="form-control"
              placeholder="Nhập tên người dùng cần tìm kiếm"
              onChange={(e) => setTen0(e.target.value)}
            />
          </div>
          <div className="form-group col-1">
            <label
              htmlFor="tennguoidung"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              &nbsp;
            </label>
            <div className="w-100">
              <button
                style={{ maxHeight: "38px" }}
                type="button"
                className="btn btn-primary w-100"
                onClick={handleClickSearch}
              >
                Lọc
              </button>
            </div>
          </div>
        </div>
      </form>
      <div className="table-responsive col-12" id="baocaoCV">
        <button
          className="btn buttons-excel buttons-html5 btn-success mr-4"
          tabIndex={0}
          aria-controls="dataTable"
          type="button"
        >
          <span>
            <div>
              <CSVLink
                className="text-decoration-none text-white"
                headers={headers}
                data={excel}
              >
                <i className="far fa-file-excel" /> Excel
              </CSVLink>
            </div>
          </span>
        </button>
        <ReactToPrint
          trigger={() => (
            <button
              className={` btn buttons-excel buttons-html5 btn-danger mr-4`}
              tabIndex={0}
              aria-controls="dataTable"
              type="button"
            >
              <span>
                <div>
                  <i className="fas fa-file-pdf" /> PDF
                </div>
              </span>
            </button>
          )}
          content={() => componentRef.current}
        />
        {loading ? (
          <div> Loading... </div>
        ) : (
          <table
            className="table table-bordered my-3 text-nowrap"
            id="dataTable"
            width="100%"
            cellSpacing={0}
          >
            <tbody className={`${styles.tbody}`}>
              <tr className="thead-light">
                <th className="align-middle text-center">STT</th>
                <th className="align-middle text-center">Sửa</th>
                <th className="align-middle text-center">Khóa</th>
                <th className="align-middle text-center">Phân quyền</th>
                <th className="align-middle text-center">Mã người dùng</th>
                <th className="align-middle text-center">Họ và tên</th>
                <th className="align-middle text-center">Địa chỉ</th>
                <th className="align-middle text-center">Số điện thoại</th>
                <th className="align-middle text-center">Email</th>

              </tr>
              {filterUser(user).map((user, index) => (
                <tr>
                  <td className="align-middle text-center">{index + 1}</td>
                  <td className="align-middle text-center">
                    <div onClick={(e) => handleShow4(e, index)}>
                      <span className="fas fa-edit text-success"></span>
                    </div>
                  </td>

                  {(() => {

                    if (isBlocked[index].check === "true") {
                      return (
                        <td className="align-middle text-center" onClick={(e) => handleShow1(e, index)}>
                          <div>
                            <span className="fa fa-unlock text-warning"></span>
                          </div>
                        </td>
                      );
                    } else {
                      return (
                        <td className="align-middle text-center" onClick={(e) => handleShow2(e, index)}>
                          <div>
                            <span className="fa fa-lock text-danger"></span>
                          </div>
                        </td>
                      );
                    }
                  })()}
                  <td className="align-middle text-center">
                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        onClick={(e) => handleShow(e, index)}
                      >
                        Phân quyền
                      </button>
                    </div>
                  </td>
                  <td className="align-middle text-center text-uppercase">
                    {user.usernames}
                  </td>
                  <td className="align-middle text-center">{user.hoten}</td>
                  <td className="align-middle text-center">{user.diachi}</td>
                  <td className="align-middle text-center">{user.sdt}</td>
                  <td className="align-middle text-center">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="row">
          <div
            className="col-12"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item">
                  <Link
                    to={`/users/page/${prevPage(page)}`}
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
                    <Link to={`/users/page/${item}`} className="page-link">
                      {item}
                    </Link>
                  </li>
                ))}

                <li className="page-item">
                  <Link
                    to={`/users/page/${nextPage(page)}`}
                    className="page-link"
                  >
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <Modal
          show={show}
          onHide={(e) => handleClose(e)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Phân quyền người dùng
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loading1 ? (
              <div>Loading</div>
            ) : (
              <div>
                {permit1 &&
                  permit1.map((permit, index) => (
                    <div className={`${styles.formCheck} form-check`}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="defaultCheck1"
                        checked={permit.check}
                        onChange={(e) => handleCheckChange(permit, index)}
                      />
                      <label
                        className={`${styles.label} form-check-label`}
                        htmlFor="defaultCheck1"
                      >
                        {permit.tenquyen}
                      </label>
                    </div>
                  ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={show1}
          onHide={(e) => handleClose1(e)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">Khoá người dùng</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có muốn khoá người này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose1}>
              Đóng
            </Button>
            <Button variant="primary" onClick={block}>
              Khoá
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={show2}
          onHide={(e) => handleClose2(e)}
          aria-labelledby="example-modal-sizes-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">Mở khoá người dùng</Modal.Title>
          </Modal.Header>
          <Modal.Body>Bạn có muốn mở khoá người này không?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose2}>
              Đóng
            </Button>
            <Button variant="primary" onClick={unBlock}>
              Mở khoá
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={show4}
          onHide={(e) => handleClose4(e)}
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
                    defaultValue={hoten4}
                    onChange={(e) => setHoten4(e.target.value)}
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
                    defaultValue={diachi4}
                    onChange={(e) => setDiachi4(e.target.value)}
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
                    defaultValue={sdt4}
                    onChange={(e) => setSdt4(e.target.value)}
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
                    defaultValue={email4}
                    onChange={(e) => setEmail4(e.target.value)}
                    required
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose4}>
              Đóng
            </Button>
            <Button variant="primary" onClick={edit4}>
              Chỉnh sửa
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} />
      </div>
    </div>
  );
}

export default Users;
