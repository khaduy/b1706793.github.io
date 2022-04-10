import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./css/books.module.css";
import { Modal, Button } from "react-bootstrap";
import { CSVLink, CSVDownload } from "react-csv";
import ReactToPrint from 'react-to-print';
// import { ComponentToPrint } from './Compo

function StatusBook() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };

  const fetchBook = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getstatusbook`);
    console.log(data)
    setLoading(false);
    setBook(data);
    totalPagesCalculate(data.length);
  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[1].check == true) {
      fetchBook();
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  //=== export excel
  const headers = [
    { label: "Mã sách", key: "masach" },
    { label: "Tên sách", key: "tensach" },
    { label: "Tác giả", key: "tacgia" },
    { label: "Nhà xuất bản", key: "nhaxuatban" },
    { label: "Mã học phần", key: "mahocphan" },
    { label: "Thời gian chuyển", key: "thoigianchuyen" },
    { label: "Tình trạng", key: "tinhtrang" },
    { label: "Số lượng", key: "soluong" },
    { label: "Năm xuất bản", key: "namxuatban" },
    { label: "Hình thức mượn", key: "hinhthucmuon" },
    { label: "Ngôn ngữ", key: "ngonngu" },
    { label: "Loại sách", key: "loaisach" },
    { label: "Chủ đề", key: "chude" }
  ];
  const excel = book.map((book) => ({
    masach: book.sachid,
    tensach: book.tensach,
    tacgia: book.tacgia,
    nhaxuatban: book.nhaxb,
    mahocphan: book.mahp,
    thoigianchuyen: book.thoigian,
    tinhtrang: book.tinhtrang,
    soluong: book.soluong,
    namxuatban: book.namxb,
    hinhthucmuon: book.hinhthuc,
    ngonngu: book.ngonngu,
    loaisach: book.tenloai,
    chude: book.tenchude
  })
  );

  //=== export pdf
  const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
      <div ref={ref} >
        <table
          className="table table-bordered my-3 text-nowrap"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <tbody className={`${styles.tbody}`}>
            <tr className="thead-light">
              <th className="align-middle text-center">Mã sách</th>
              <th className="align-middle text-center">Tên sách</th>
              <th className="align-middle text-center">Tác giả</th>
              <th className="align-middle text-center">Nhà xuất bản</th>
              <th className="align-middle text-center">Mã học phần</th>
              <th className="align-middle text-center">Số lượng</th>
              <th className="align-middle text-center">Năm xuất bản</th>
              <th className="align-middle text-center">Tình trạng</th>
              <th className="align-middle text-center">Thời gian chuyển</th>
              <th className="align-middle text-center">Ngôn ngữ</th>
              <th className="align-middle text-center">Loại sách</th>
              <th className="align-middle text-center">Chủ đề</th>
            </tr>
            {filterBook(book).map((book, index) => (
              <tr>
                <td className="align-middle text-center">{book.sachid}</td>
                <td className="align-middle text-center">{book.tensach}</td>
                <td className="align-middle text-center">{book.tacgia}</td>
                <td className="align-middle text-center">{book.nhaxb}</td>
                <td className="align-middle text-center text-uppercase">
                  {book.mahp}
                </td>
                <td className="align-middle text-center">{book.soluong}</td>
                <td className="align-middle text-center">{book.namxb}</td>
                <td className="align-middle text-center">{book.tinhtrang}</td>
                <td className="align-middle text-center">{book.thoigian}</td>
                <td className="align-middle text-center">{book.ngonngu}</td>
                <td className="align-middle text-center">{book.tenloai}</td>
                <td className="align-middle text-center">{book.tenchude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
  const componentRef = useRef();

  //=== Bộ lọc
  const [tieuDe, setTieuDe] = useState();
  const [tinhTrang, setTinhTrang] = useState();
  const [timeStart, setTimeStart] = useState();
  const [timeEnd, setTimeEnd] = useState();
  const handleClickSearch = async (e) => {
    e.preventDefault();
    fetchBooks1();
  };
  const fetchBooks1 = async () => {
    // setLoading(true);
    var tieude = "";
    var tieude1 = "";
    if (!tieuDe) {
      tieude = "nbsp";
    } else {
      tieude1 = tieuDe;
      if (tieude1 === "") {
        tieude = "nbsp";
      } else {
        tieude = tieude1;
      }
    }
    var tinhtrang = "";
    var tinhtrang1 = "";
    if (!tinhTrang) {
      tinhtrang = "nbsp";
    } else {
      tinhtrang1 = tinhTrang;
      if (tinhtrang1 === "") {
        tinhtrang = "nbsp";
      } else {
        tinhtrang = tinhtrang1;
      }
    }
    var timestart = "";
    var timestart1 = "";
    if (!timeStart) {
      timestart = "nbsp";
    } else {
      timestart1 = timeStart + " 00:00:00";
      if (timestart1 === "") {
        timestart = "nbsp";
      } else {
        timestart = timestart1;
      }
    }
    var timeend = "";
    var timeend1 = "";
    if (!timeEnd) {
      timeend = "nbsp";
    } else {
      timeend1 = timeEnd + " 23:59:59";
      if (timeend1 === "") {
        timeend = "nbsp";
      } else {
        timeend = timeend1;
      }
    }
    console.log("data", tieude);
    const { data } = await axios.get(
      `/searchstatusbook/tieude=${tieude}&&tinhtrang=${tinhtrang}&&timestart=${timestart}&&timeend=${timeend}`
    );
    console.log(data)
    // setLoading(false);
    setBook(data);
    totalPagesCalculate(data.length);
  };

  //=== Pagination
  const { page = 1 } = useParams();
  const filterBook = (bookList) => {
    const firstParam = (page || 1) * 8 - 8;
    const secondParam = (page || 1) * 8;
    return bookList.slice(firstParam, secondParam);
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
  return loading ? (
    <div> Loading... </div>
  ) : (
    <div className={`${styles.content}`}>
      <div className="container-fluid">
      <form>
          <div className="row">
            <div className="form-group col">
              <label
                htmlFor="tieude"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tiêu đề sách
              </label>
              <input
                type="text"
                id="tieude"
                name="tieude"
                className="form-control"
                placeholder="Nhập tiêu đề cần tìm kiếm"
                onChange={(e) => setTieuDe(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="tinhtrang"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tình trạng sách
              </label>
              <input
                type="text"
                id="tinhtrang"
                name="tinhtrang"
                className="form-control"
                placeholder="Nhập tình trạng cần tìm kiếm"
                onChange={(e) => setTinhTrang(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col">
              <label
                htmlFor="timestart"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Chọn thời gian bắt đầu
              </label>
              <input
                type="date"
                id="timestart"
                name="timestart"
                className="form-control"
                onChange={(e) => setTimeStart(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="timeend"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Chọn thời gian kết thúc
              </label>
              <input
                type="date"
                id="timeend"
                name="timeend"
                className="form-control"
                onChange={(e) => setTimeEnd(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12" style={{ textAlign: "right" }}>
              <button
                style={{ maxHeight: "38px", marginLeft: "10px" }}
                type="button"
                className="btn btn-primary"
                onClick={handleClickSearch}
              >
                Lọc
              </button>
            </div>
          </div>
        </form>
        <div id="baocaoCV">
          <button
            className="btn buttons-excel buttons-html5 btn-success mr-4"
            tabIndex={0}
            aria-controls="dataTable"
            type="button"
          >
            <span>
              <div>
                <CSVLink className="text-decoration-none text-white" headers={headers} data={excel}>
                  <i className="far fa-file-excel" /> Excel
                </CSVLink>
              </div>
            </span>
          </button>
          <ReactToPrint
            trigger={() =>
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
            }
            content={() => componentRef.current}
          />
          <table
            className="table table-responsive table-bordered my-3 text-nowrap"
            id="dataTable"
            width="100%"
            cellSpacing={0}
          >
            <tbody className={`${styles.tbody}`}>
              <tr className="thead-light">
                <th className="align-middle text-center">Mã sách</th>
                <th className="align-middle text-center">Tên sách</th>
                <th className="align-middle text-center">Tác giả</th>
                <th className="align-middle text-center">Nhà xuất bản</th>
                <th className="align-middle text-center">Mã học phần</th>
                <th className="align-middle text-center">Số lượng</th>
                <th className="align-middle text-center">Năm xuất bản</th>
                <th className="align-middle text-center">Tình trạng</th>
                <th className="align-middle text-center">Thời gian chuyển</th>
                <th className="align-middle text-center">Ngôn ngữ</th>
                <th className="align-middle text-center">Loại sách</th>
                <th className="align-middle text-center">Chủ đề</th>
              </tr>
              {filterBook(book).map((book, index) => (
                <tr>
                  <td className="align-middle text-center">{book.sachid}</td>
                  <td className="align-middle text-center">{book.tensach}</td>
                  <td className="align-middle text-center">{book.tacgia}</td>
                  <td className="align-middle text-center">{book.nhaxb}</td>
                  <td className="align-middle text-center text-uppercase">
                    {book.mahp}
                  </td>
                  <td className="align-middle text-center">{book.soluong}</td>
                  <td className="align-middle text-center">{book.namxb}</td>
                  <td className="align-middle text-center">{book.tinhtrang}</td>
                  <td className="align-middle text-center">{book.thoigian}</td>
                  <td className="align-middle text-center">{book.ngonngu}</td>
                  <td className="align-middle text-center">{book.tenloai}</td>
                  <td className="align-middle text-center">{book.tenchude}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                    to={`/books/page/${prevPage(page)}`}
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
                    <Link to={`/books/page/${item}`} className="page-link">
                      {item}
                    </Link>
                  </li>
                ))}
                <li className="page-item">
                  <Link
                    to={`/books/page/${nextPage(page)}`}
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

      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} />
      </div>

    </div>
  );
}

export default StatusBook;
