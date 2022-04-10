import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./css/books.module.css";
import { Modal, Button } from "react-bootstrap";
import { CSVLink, CSVDownload } from "react-csv";
import ReactToPrint from 'react-to-print';
// import { ComponentToPrint } from './ComponentToPrint';


function Books(ref) {
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
    const { data } = await axios.get(`/getbook`);
    setLoading(false);
    setBook(data);
    totalPagesCalculate(data.length);
    console.log(data)
  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[1].check == true) {
      fetchBook();
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  //=== Modal
  const [show, setShow] = useState(false);
  const [book1, setBook1] = useState([]);

  const handleShow = (e, index) => {
    setBook1(book[index].sachid);
    setShow(true);
    console.log("book", book1);
  };

  const handleClose = (e) => {
    setShow(false);
  };
  const deleteBook = (e) => {
    console.log(book1);
    const data = new FormData();
    data.append("sachid", book1);
    axios.post("/deletebook", data);
    fetchBook();
    setShow(false);
  };

  //=== Modal2
  const [show2, setShow2] = useState(false);
  const [book2, setBook2] = useState([]);
  const [status, setStatus] = useState([]);
  const [soLuong, setSoLuong] = useState([]);
  const [soLuongSach, setSoLuongSach] = useState([]);
  const handleShow2 = (e, index) => {
    setBook2(book[index].sachid);
    setSoLuongSach(book[index].soluong);
    setShow2(true);
    console.log("book", book2);
  };

  const handleClose2 = (e) => {
    setShow2(false);
  };
  const moveBook = (e) => {
    if (soLuong > soLuongSach) {
      alert("Bạn nhập quá số lượng sách!!!");
      return;
    }
    var time = new Date().toLocaleString('en-ZA');
    const data = new FormData();
    data.append("sachid", book2);
    data.append("soluong", soLuong);
    data.append("tinhtrang", status);
    data.append("time", time);
    setShow2(false);
    axios.post("/movebook", data);
    fetchBook();
  };

  //=== Bo loc
  const [tieuDe, setTieuDe] = useState();
  const [tacGia, setTacGia] = useState();
  const [ngonNgu, setNgonNgu] = useState();
  const [namXbStart, setNamXbStart] = useState();
  const [namXbEnd, setNamXbEnd] = useState();
  const [nhaXB, setNhaXB] = useState();
  const [maHP, setMaHP] = useState();
  const [chuDe, setChuDe] = useState();
  const [loaiSach, setLoaiSach] = useState();

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
  var ktln = (str) => {
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
  }
  const reset = async (e) => {
    setTieuDe("");
    setTacGia("");
    setNgonNgu("");
    setNamXbStart("");
    setNamXbEnd("");
    setNhaXB("");
    setMaHP("");
    setChuDe("");
    setLoaiSach("");
  };
  const search = async (e) => {
    e.preventDefault();
    fetchBook3();
  };
  const searchkhongdau = async (e) => {
    e.preventDefault();
    fetchBook1();
  };
  const fetchBook1 = async () => {
    var tieude = "";
    var tieude1 = "";
    if (!tieuDe) {
      tieude = "nbsp";
    } else {
      tieude1 = tvkd(tieuDe);
      if (tieude1 === "") {
        tieude = "nbsp";
      } else {
        tieude = tieude1;
      }
    }
    var tacgia = "";
    var tacgia1 = "";
    if (!tacGia) {
      tacgia = "nbsp";
    } else {
      tacgia1 = tvkd(tacGia);
      if (tacgia1 === "") {
        tacgia = "nbsp";
      } else {
        tacgia = tacgia1;
      }
    }
    var ngonngu = "";
    var ngonngu1 = "";
    if (!ngonNgu) {
      ngonngu = "nbsp";
    } else {
      ngonngu1 = tvkd(ngonNgu)
      if (ngonngu1 === "") {
        ngonngu = "nbsp";
      } else {
        ngonngu = ngonngu1;
      }
    }
    var namxbstart = "";
    var namxbstart1 = "";
    if (!namXbStart) {
      namxbstart = "nbsp";
    } else {
      namxbstart1 = tvkd(namXbStart)
      if (namxbstart1 === "") {
        namxbstart = "nbsp";
      } else {
        namxbstart = namxbstart1;
      }
    }
    var namxbend = "";
    var namxbend1 = "";
    if (!namXbEnd) {
      namxbend = "nbsp";
    } else {
      namxbend1 = tvkd(namXbEnd)
      if (namxbend1 === "") {
        namxbend = "nbsp";
      } else {
        namxbend = namxbend1;
      }
    }
    var nhaxb = "";
    var nhaxb1 = "";
    if (!nhaXB) {
      nhaxb = "nbsp";
    } else {
      nhaxb1 = tvkd(nhaXB)
      if (nhaxb1 === "") {
        nhaxb = "nbsp";
      } else {
        nhaxb = nhaxb1;
      }
    }
    var mahp = "";
    var mahp1 = "";
    if (!maHP) {
      mahp = "nbsp";
    } else {
      mahp1 = tvkd(maHP)
      if (mahp1 === "") {
        mahp = "nbsp";
      } else {
        mahp = mahp1;
      }
    }
    var chude = "";
    var chude1 = "";
    if (!chuDe) {
      chude = "nbsp";
    } else {
      chude1 = tvkd(chuDe)
      if (chude1 === "") {
        chude = "nbsp";
      } else {
        chude = chude1;
      }
    }
    var loaisach = "";
    var loaisach1 = "";
    if (!loaiSach) {
      loaisach = "nbsp";
    } else {
      loaisach1 = tvkd(loaiSach)
      if (loaisach1 === "") {
        loaisach = "nbsp";
      } else {
        loaisach = loaisach1;
      }
    }
    setLoading(true);
    console.log("du lieu", tieude, tacgia, ngonngu, namxbstart, namxbend, nhaxb, mahp, chude, loaisach)
    const { data } = await axios.get(`/searchkd/tieude=${tieude}&&tacgia=${tacgia}&&ngonngu=${ngonngu}&&namxbstart=${namxbstart}&&namxbend=${namxbend}&&nhaxb=${nhaxb}&&mahp=${mahp}&&chude=${chude}&&loaisach=${loaisach}`);
    setLoading(false);
    setBook(data);
    totalPagesCalculate(data.length);
  };
  const fetchBook3 = async () => {
    var tieude = "";
    var tieude1 = "";
    if (!tieuDe) {
      tieude = "nbsp";
    } else {
      tieude1 = ktln(tieuDe);
      if (tieude1 === "") {
        tieude = "nbsp";
      } else {
        tieude = tieude1;
      }
    }
    var tacgia = "";
    var tacgia1 = "";
    if (!tacGia) {
      tacgia = "nbsp";
    } else {
      tacgia1 = ktln(tacGia);
      if (tacgia1 === "") {
        tacgia = "nbsp";
      } else {
        tacgia = tacgia1;
      }
    }
    var ngonngu = "";
    var ngonngu1 = "";
    if (!ngonNgu) {
      ngonngu = "nbsp";
    } else {
      ngonngu1 = ktln(ngonNgu)
      if (ngonngu1 === "") {
        ngonngu = "nbsp";
      } else {
        ngonngu = ngonngu1;
      }
    }
    var namxbstart = "";
    var namxbstart1 = "";
    if (!namXbStart) {
      namxbstart = "nbsp";
    } else {
      namxbstart1 = ktln(namXbStart)
      if (namxbstart1 === "") {
        namxbstart = "nbsp";
      } else {
        namxbstart = namxbstart1;
      }
    }
    var namxbend = "";
    var namxbend1 = "";
    if (!namXbEnd) {
      namxbend = "nbsp";
    } else {
      namxbend1 = ktln(namXbEnd)
      if (namxbend1 === "") {
        namxbend = "nbsp";
      } else {
        namxbend = namxbend1;
      }
    }
    var nhaxb = "";
    var nhaxb1 = "";
    if (!nhaXB) {
      nhaxb = "nbsp";
    } else {
      nhaxb1 = ktln(nhaXB)
      if (nhaxb1 === "") {
        nhaxb = "nbsp";
      } else {
        nhaxb = nhaxb1;
      }
    }
    var mahp = "";
    var mahp1 = "";
    if (!maHP) {
      mahp = "nbsp";
    } else {
      mahp1 = ktln(maHP)
      if (mahp1 === "") {
        mahp = "nbsp";
      } else {
        mahp = mahp1;
      }
    }
    var chude = "";
    var chude1 = "";
    if (!chuDe) {
      chude = "nbsp";
    } else {
      chude1 = ktln(chuDe)
      if (chude1 === "") {
        chude = "nbsp";
      } else {
        chude = chude1;
      }
    }
    var loaisach = "";
    var loaisach1 = "";
    if (!loaiSach) {
      loaisach = "nbsp";
    } else {
      loaisach1 = ktln(loaiSach)
      if (loaisach1 === "") {
        loaisach = "nbsp";
      } else {
        loaisach = loaisach1;
      }
    }

    setLoading(true);
    // console.log("du lieu", tieude, tacgia, ngonngu, namxbstart, namxbend, nhaxb, mahp, chude, loaisach);
    const { data } = await axios.get(`/searchpro/tieude=${tieude}&&tacgia=${tacgia}&&ngonngu=${ngonngu}&&namxbstart=${namxbstart}&&namxbend=${namxbend}&&nhaxb=${nhaxb}&&mahp=${mahp}&&chude=${chude}&&loaisach=${loaisach}`);
    setLoading(false);
    setBook(data);
    totalPagesCalculate(data.length);

  };

  //=== export excel
  const headers = [
    { label: "Mã sách", key: "masach" },
    { label: "Tên sách", key: "tensach" },
    { label: "Tác giả", key: "tacgia" },
    { label: "Nhà xuất bản", key: "nhaxuatban" },
    { label: "Mã học phần", key: "mahocphan" },
    { label: "Vị trí", key: "vitri" },
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
    vitri: book.vitri,
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
              <th className="align-middle text-center">Vị trí</th>
              <th className="align-middle text-center">Số lượng</th>
              <th className="align-middle text-center">Năm xuất bản</th>
              <th className="align-middle text-center">Hình thức mượn</th>
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
                <td className="align-middle text-center">{book.vitri}</td>
                <td className="align-middle text-center">{book.soluong}</td>
                <td className="align-middle text-center">{book.namxb}</td>
                <td className="align-middle text-center">{book.hinhthuc}</td>
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

  return (
    <div className={`${styles.content}`}>
      <div className="container-fluid">
        <form
        >
          <div className="row">
            <div className="form-group col-4">
              <label
                htmlFor="tensach"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tiêu đề
              </label>
              <input
                type="text"
                id="tensach"
                name="tensach"
                className="form-control"
                placeholder="Nhập tiêu đề cần tìm kiếm"
                onChange={(e) => setTieuDe(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="tacgia"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tác giả
              </label>
              <input
                type="text"
                id="tacgia"
                name="tacgia"
                className="form-control"
                placeholder="Nhập tác giả cần tìm kiếm"
                onChange={(e) => setTacGia(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="ngonngu"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Chọn ngôn ngữ
              </label>
              <div>
                <select
                  id="ngonngu"
                  name="ngonngu"
                  className="form-control"
                  onChange={(e) => setNgonNgu(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="Tiếng Việt">Tiếng Việt</option>
                  <option value="Ngôn ngữ khác">Ngôn ngữ khác</option>
                </select>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-4">
              <label
                htmlFor="namxbstart"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập năm xuất bản: Từ năm
              </label>
              <input
                type="text"
                id="namxbstart"
                name="namxbstart"
                className="form-control"
                placeholder="Năm xuất bản: Từ năm"
                onChange={(e) => setNamXbStart(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="namxbend"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập năm xuất bản: Đến năm
              </label>
              <input
                type="text"
                id="namxbend"
                name="namxbend"
                className="form-control"
                placeholder="Năm xuất bản: đến năm"
                onChange={(e) => setNamXbEnd(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="nhaxb"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập nhà xuất bản
              </label>
              <input
                type="text"
                id="nhaxb"
                name="nhaxb"
                className="form-control"
                placeholder="Nhập nhà xuất bản cần tìm kiếm"
                onChange={(e) => setNhaXB(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-4">
              <label
                htmlFor="chude"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập chủ đề
              </label>
              <input
                type="text"
                id="chude"
                name="chude"
                className="form-control"
                placeholder="Nhập chủ đề cần tìm kiếm"
                onChange={(e) => setChuDe(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="loaisach"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập loại sách
              </label>
              <input
                type="text"
                id="loaisach"
                name="loaisach"
                className="form-control"
                placeholder="Nhập loại sách cần tìm kiếm"
                onChange={(e) => setLoaiSach(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="mahp"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập mã học phần
              </label>
              <input
                type="text"
                id="mahp"
                name="mahp"
                className="form-control"
                placeholder="Số mã học phần cần tìm kiếm"
                onChange={(e) => setMaHP(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12" style={{ textAlign: "right" }}>
              <button
                style={{ maxHeight: "38px", marginLeft: "10px" }}
                type="reset"
                className="btn btn-primary"
                onClick={reset}
              >
                Làm lại
              </button>

              <button
                style={{ maxHeight: "38px", marginLeft: "10px" }}
                type="button"
                className="btn btn-primary"
                onClick={searchkhongdau}
              >
                Tìm không dấu
              </button>
              <button
                style={{ maxHeight: "38px", marginLeft: "10px" }}
                type="button"
                className="btn btn-primary"
                onClick={search}
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </form>

        <div className="table-responsive" id="baocaoCV">
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
                  <th className="align-middle text-center">Mã sách</th>
                  <th className="align-middle text-center">Sửa</th>
                  <th className="align-middle text-center">Xóa</th>
                  <th className="align-middle text-center">Chuyển</th>
                  <th className="align-middle text-center">Tên sách</th>
                  <th className="align-middle text-center">Tác giả</th>
                  <th className="align-middle text-center">Nhà xuất bản</th>
                  <th className="align-middle text-center">Mã học phần</th>
                  <th className="align-middle text-center">Vị trí</th>
                  <th className="align-middle text-center">Số lượng</th>
                  <th className="align-middle text-center">Năm xuất bản</th>
                  <th className="align-middle text-center">Hình thức mượn</th>
                  <th className="align-middle text-center">Ngôn ngữ</th>
                  <th className="align-middle text-center">Loại sách</th>
                  <th className="align-middle text-center">Chủ đề</th>
                </tr>
                {!book.length ? (
                  <tr>
                    <td colSpan="15" className="align-middle text-center">Không có dữ liệu</td>
                  </tr>
                ) : (

                  filterBook(book).map((book, index) => (
                    <tr>
                      <td className="align-middle text-center">{book.sachid}</td>
                      <td className="align-middle text-center">
                        <div>
                          <Link to={`/editbook/${book.sachid}`}>
                            <span className="fas fa-edit text-success"></span>
                          </Link>
                        </div>
                      </td>
                      <td className="align-middle text-center">
                        <div onClick={(e) => handleShow(e, index)}>
                          <span className="far fa-trash-alt text-danger"></span>
                        </div>
                      </td>
                      <td className="align-middle text-center">
                        <div onClick={(e) => handleShow2(e, index)}>
                          <span className="fas fa-minus-square text-warning"></span>
                        </div>
                      </td>
                      <td className="align-middle text-center">{book.tensach}</td>
                      <td className="align-middle text-center">{book.tacgia}</td>
                      <td className="align-middle text-center">{book.nhaxb}</td>
                      <td className="align-middle text-center text-uppercase">
                        {book.mahp}
                      </td>
                      <td className="align-middle text-center">{book.vitri}</td>
                      <td className="align-middle text-center">{book.soluong}</td>
                      <td className="align-middle text-center">{book.namxb}</td>
                      <td className="align-middle text-center">{book.hinhthuc}</td>
                      <td className="align-middle text-center">{book.ngonngu}</td>
                      <td className="align-middle text-center">{book.tenloai}</td>
                      <td className="align-middle text-center">{book.tenchude}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
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

      <Modal
        show={show}
        onHide={(e) => handleClose(e)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">Xóa sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc muốn xóa sách này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={deleteBook}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={show2}
        onHide={(e) => handleClose2(e)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Chuyển đổi tình trạng sách
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="form-group">
              <label
                htmlFor="tinhtrangsach"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tình trạng sách
              </label>
              <input
                type="text"
                id="tinhtrangsach"
                name="tinhtrangsach"
                className="form-control"
                placeholder="nhập tình trạng sách"
                onChange={(e) => setStatus(e.target.value)}
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group">
              <label
                htmlFor="soluong"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập số lượng sách
              </label>
              <input
                type="number"
                id="soluong"
                name="soluong"
                className="form-control"
                placeholder="nhập số lượng sách"
                onChange={(e) => setSoLuong(e.target.value)}
                min="1"
                max="9999"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={moveBook}>
            Chuyển
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} />
      </div>


    </div >
  );
}

export default Books;
