import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./css/borrowreturn.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function BorrowReturn() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[2].check == true) {
      console.log("ok");
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  // MUON SACH
  const [inputList, setInputList] = useState([{ masach: "" }]);
  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, { masach: "" }]);
  };
  const [mssv, setMssv] = useState("");
  const borrow = async (e) => {
    e.preventDefault();

    if (!mssv || mssv === "") {
      alert("Vui lòng nhập mã người dùng");
      return false;
    } else {
      for (let i = 0; i < inputList.length; i++) {
        if (!inputList[i].masach || inputList[i].masach === ""
        ) {
          alert("Vui lòng nhập mã sách");
          return;
        } else {
          var timeborrow = new Date().toLocaleString('en-ZA');
          const data1 = {
            time: timeborrow,
            mssv: mssv.toLowerCase(),
            maSach: inputList[i].masach,
            ids: userInfo.username,
            hoten: userInfo.hoten
          };
          // console.log("time", timeborrow);
          const { data } = await axios.post("/borrowbook", data1);
          if (data === "Sai ms") {
            alert("Không tìm thấy người dùng có mã " + mssv);
            return;
          } else if (data === "block") {
            alert("Người dùng này đã bị khoá, không được mượn sách!!!");
            return;
          } else if (data === "sai ma sach") {
            alert("Không tìm thấy sách có mã " + inputList[i].masach)
          } else if (data === "Hết sách") {
            alert("Sách có mã " + inputList[i].masach + " đã hết sách!!!");
          } else if (data === "Hãy trả sách") {
            alert("Sách có mã " + inputList[i].masach + " đã mượn rồi, hãy trả trước khi mượn lại!!!");
          }
          fetchDiary();
        }
      }
    }

  };

  // TRA SACH
  const [inputList1, setInputList1] = useState([{ masach: "" }]);
  // handle input change
  const handleInputChange1 = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList1];
    list[index][name] = value;
    setInputList1(list);
  };

  // handle click event of the Remove button
  const handleRemoveClick1 = (index) => {
    const list = [...inputList1];
    list.splice(index, 1);
    setInputList1(list);
  };

  // handle click event of the Add button
  const handleAddClick1 = () => {
    setInputList1([...inputList1, { masach: "" }]);
  };
  const [mssv1, setMssv1] = useState("");
  const return1 = async (e) => {
    e.preventDefault();
    if (!mssv1 || mssv1 === "") {
      alert("Vui lòng nhập mã người dùng");
      return;
    } else {
      for (let i = 0; i < inputList1.length; i++) {
        if (!inputList1[i].masach || inputList1[i].masach === ""
        ) {
          alert("Vui lòng nhập mã sách");
          return;
        } else {
          var timeborrow1 = new Date().toLocaleString('en-ZA');
          const data2 = {
            time: timeborrow1,
            mssv: mssv1.toLowerCase(),
            maSach: inputList1[i].masach,
            ids: userInfo.username,
            hoten: userInfo.hoten
          };
          const { data } = await axios.post("/returnbook", data2);
          if (data === "Sai ms") {
            alert("Không tìm thấy người dùng có mã " + mssv1);
            return;
          } else if (data === "sai ma sach") {
            alert("Không tìm thấy sách có mã " + inputList1[i].masach);
          } else if (data === "chưa mượn") {
            alert("Sách có mã " + inputList1[i].masach + " chưa được mượn");
          }
          fetchDiary(mssv1);
        }
      }
    }
  };

  // Table
  const [diary, setDiary] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const [loading, setLoading] = useState(false);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };
  const [note, setNote] = useState([]);
  const [edit, setEdit] = useState([]);
  const fetchDiary = async (idtra) => {
    setLoading(true);
    var temp = [];
    if (!idtra) {
      const { data } = await axios.get(`/getdiary/${mssv}`);
      temp = data
      console.log("muon")
    } else {
      const { data } = await axios.get(`/getdiary/${idtra}`);
      temp = data
      console.log("tra")
    }
    var list = [];
    var listEdit = [];
    for (let i = 0; i < temp.length; i++) {
      list.push({ id: temp[i].id, ghichu: temp[i].ghichu });
      listEdit.push({ value: false });
    }
    setEdit(listEdit);
    setNote(list);
    setLoading(false);
    setDiary(temp);
    totalPagesCalculate(temp.length);
  };
  //=== Edit noted
  const editNote = (e, index) => {
    var list = [...note];
    list[index].ghichu = e.target.value;
    setNote(list);
  };

  const handleClickEdit = (e, index) => {
    var list = [...note];
    list[index].value = !list[index].value;
    setEdit(list);
  };

  const handleClickCheck = (e, index) => {
    var list = [...note];
    list[index].value = !list[index].value;
    setEdit(list);
    for (let i = 0; i < list.length; i++) {
      if (list[i].value === false) {
        const data = new FormData();
        data.append("id", list[i].id);
        data.append("ghichu", list[i].ghichu);
        axios.post("/editnote", data);
        fetchDiary();
      }
    }
  };

  //=== Pagination
  const { page = 1 } = useParams();
  const filterDiary = (diaryList) => {
    diaryList = diaryList.map((item, index) => {
      return { ...item, index: index };
    });
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
        <div className="row justify-content-around">
          {/* Mượn sách */}
          <div className={`${styles.wrap1} col-5`}>
            <h5 className={`${styles.h5}`}>Mượn sách</h5>
            {/* <form onSubmit={handleSubmit} > */}
            <form>
              <div className="row">
                <div className="form-group">
                  <label
                    htmlFor="mssv"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập mã người dùng
                  </label>
                  <input
                    type="text"
                    id="mssv"
                    name="mssv"
                    className="form-control"
                    placeholder="nhập mã người dùng"
                    onChange={(e) => setMssv(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label
                    htmlFor="masach"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập mã sách
                  </label>
                  {inputList.map((x, i) => {
                    return (
                      <div className={`${styles.row} row`}>
                        <div className="col-6">
                          <input
                            type="number"
                            id="masach"
                            name="masach"
                            className="form-control"
                            placeholder="nhập mã sách muốn mượn"
                            value={x.masach}
                            onChange={(e) => handleInputChange(e, i)}
                          // onChange={(e) => setHoten(e.target.value)}
                          />
                        </div>
                        <div
                          className="col-3"
                          style={{ textAlign: "center" }}
                          id="btnedit"
                        >
                          {inputList.length !== 1 && (
                            <button
                              type="button"
                              className={`${styles.btnplus} btn btn-outline-light w-100`}
                              onClick={() => handleRemoveClick(i)}
                            >
                              <i className="fa fa-minus" />
                            </button>
                          )}
                        </div>
                        <div
                          className="col-3"
                          style={{ textAlign: "center" }}
                          id="btnedit"
                        >
                          {inputList.length - 1 === i && (
                            <button
                              type="button"
                              className={`${styles.btnplus} btn btn-outline-light w-100`}
                              onClick={handleAddClick}
                            >
                              <i className="fa fa-plus" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`${styles.button} row`}>
                <div
                  className="col-12"
                  style={{ textAlign: "center" }}
                  id="btnedit"
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={borrow}
                  >
                    Mượn sách
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Trả sách */}
          <div className={`${styles.wrap1} col-5`}>
            <h5 className={`${styles.h5}`}>Trả sách</h5>
            {/* <form onSubmit={handleSubmit} > */}
            <form>
              <div className="row">
                <div className="form-group">
                  <label
                    htmlFor="mssv"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập mã người dùng
                  </label>
                  <input
                    type="text"
                    id="mssv"
                    name="mssv"
                    className="form-control"
                    placeholder="nhập mã người dùng"
                    onChange={(e) => setMssv1(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group">
                  <label
                    htmlFor="masach"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập mã sách
                  </label>
                  {inputList1.map((x, i) => {
                    return (
                      <div className={`${styles.row} row`}>
                        <div className="col-6">
                          <input
                            type="number"
                            id="masach"
                            name="masach"
                            className="form-control"
                            placeholder="nhập mã sách muốn trả"
                            value={x.masach}
                            onChange={(e) => handleInputChange1(e, i)}
                          // onChange={(e) => setHoten(e.target.value)}
                          />
                        </div>
                        <div
                          className="col-3"
                          style={{ textAlign: "center" }}
                          id="btnedit"
                        >
                          {inputList1.length !== 1 && (
                            <button
                              type="button"
                              className={`${styles.btnplus} btn btn-outline-light w-100`}
                              onClick={() => handleRemoveClick1(i)}
                            >
                              <i className="fa fa-minus" />
                            </button>
                          )}
                        </div>
                        <div
                          className="col-3"
                          style={{ textAlign: "center" }}
                          id="btnedit"
                        >
                          {inputList1.length - 1 === i && (
                            <button
                              type="button"
                              className={`${styles.btnplus} btn btn-outline-light w-100`}
                              onClick={handleAddClick1}
                            >
                              <i className="fa fa-plus" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className={`${styles.button} row`}>
                <div
                  className="col-12"
                  style={{ textAlign: "center" }}
                  id="btnedit"
                >
                  <button
                    type="submit"
                    className="btn btn-primary"
                    onClick={return1}
                  >
                    Trả sách
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Bảng */}
          <div className="table-responsive col-12">
            {loading ? (
              <div> Loading... </div>
            ) : (
              <table
                className="table table-responsive table-bordered my-3 text-nowrap"
                id="dataTable"
                width="100%"
                cellSpacing={0}
              >
                <tbody className={`${styles.tbody}`}>
                  <tr className="thead-light">
                    <th className="align-middle text-center">STT</th>
                    <th className="align-middle text-center">Mã sách</th>
                    <th className="align-middle text-center">
                      Tên sách được mượn
                    </th>
                    <th className="align-middle text-center">Mã người mượn</th>
                    <th className="align-middle text-center">Tên người mượn</th>
                    <th className="align-middle text-center">
                      Mã người cho mượn
                    </th>
                    <th className="align-middle text-center">
                      Tên người cho mượn
                    </th>
                    <th className="align-middle text-center">Mã người cho trả</th>
                    <th className="align-middle text-center">
                      Tên người cho trả
                    </th>
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
                    <th className="align-middle text-center">Sửa ghi chú</th>
                  </tr>

                  {!diary.length ? (
                    <tr>
                      <td colSpan="11" className="align-middle text-center">Không có dữ liệu</td>
                    </tr>
                  ) : (
                    filterDiary(diary).map((diary, index) => (
                      <tr>
                        <td className="align-middle text-center">
                          {diary.index + 1}
                        </td>
                        <td className="align-middle text-center">
                          {diary.sachid}
                        </td>
                        <td className="align-middle text-center">
                          {diary.tensach}
                        </td>
                        <td className="align-middle text-center text-uppercase">
                          {diary.username}
                        </td>
                        <td className="align-middle text-center">{diary.hoten}</td>
                        <td className="align-middle text-center text-uppercase">
                          {diary.username1}
                        </td>
                        <td className="align-middle text-center">
                          {diary.hoten1}
                        </td>
                        <td className="align-middle text-center text-uppercase">
                          {diary.username2}
                        </td>
                        <td className="align-middle text-center">
                          {diary.hoten2}
                        </td>
                        <td className="align-middle text-center">{diary.ngaymuon}</td>

                        <>
                          {(() => {
                            if (diary.ngaytra === "1/1/1999, 12:00:00 AM") {
                              return (
                                <td className="align-middle text-center">Chưa trả</td>
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

                        <td className="align-middle text-center">{diary.thoigian}</td>

                        {(() => {
                          // Ngay tra
                          const date1 = diary.ngaytra;
                          const date11 = date1.toLocaleString("en-US");
                          const date111 = new Date(date11);
                          // Chua tra
                          const date2 = new Date("1/1/1999, 12:00:00 AM");
                          const date22 = date2.toLocaleString("en-US");
                          const date222 = new Date(date22);
                          // Phai tra truoc
                          const date3 = diary.thoigian;
                          const date33 = date3.toLocaleString("en-US");
                          // const date34 = date3.toLocaleString("en-GB");
                          const date333 = new Date(date33);
                          // Ngay hien tai
                          const date4 = new Date();
                          const date44 = date4.toLocaleString("en-US");
                          const date444 = new Date(date44);

                          // console.log("thoigian: ", date444);

                          if (date111.getTime() === date222.getTime()) {
                            if (date444.getTime() < date333.getTime()) {
                              return (
                                <td className="align-middle text-center">Còn hạn</td>
                              );
                            } else if (date444.getTime() > date333.getTime()) {
                              return (
                                <td className="align-middle text-center">Hết hạn</td>
                              );
                            }
                          } else if (date111.getTime() !== date222.getTime()) {
                            if (date111.getTime() <= date333.getTime()) {
                              return (
                                <td className="align-middle text-center">Đúng hạn</td>
                              );
                            } else if (date111.getTime() > date333.getTime()) {
                              return (
                                <td className="align-middle text-center">Trễ hạn</td>
                              );
                            }
                          }
                        })()}

                        {(() => {
                          if (edit[index].value === true) {
                            return (
                              <>
                                <td
                                  className="align-middle text-center"
                                  style={{ minWidth: "500px" }}
                                >
                                  <input
                                    type="text"
                                    name="note"
                                    className="form-control"
                                    defaultValue={diary.ghichu}
                                    onChange={(e) => editNote(e, index)}
                                    required
                                  />
                                </td>

                                <td className="align-middle text-center">
                                  <div
                                    className="text-success"
                                    onClick={(e) => handleClickCheck(e, index)}
                                  >
                                    <FontAwesomeIcon icon={["fas", "check"]} />
                                  </div>
                                </td>
                              </>
                            );
                          } else {
                            return (
                              <>
                                <td
                                  className="align-middle text-center"
                                  style={{ minWidth: "500px" }}
                                >
                                  {diary.ghichu}
                                </td>

                                <td className="align-middle text-center">
                                  <div
                                    className="text-success"
                                    onClick={(e) => handleClickEdit(e, index)}
                                  >
                                    <FontAwesomeIcon icon={["fas", "edit"]} />
                                  </div>
                                </td>
                              </>
                            );
                          }
                        })()}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
                        to={`/borrowreturn/page/${prevPage(page)}`}
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
                        <Link to={`/borrowreturn/page/${item}`} className="page-link">
                          {item}
                        </Link>
                      </li>
                    ))}
                    <li className="page-item">
                      <Link
                        to={`/borrowreturn/page/${nextPage(page)}`}
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
      </div>
    </div>
  );
}

export default BorrowReturn;
