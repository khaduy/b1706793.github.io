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
      alert("B???n nh???p qu?? s??? l?????ng s??ch!!!");
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
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
    str = str.replace(/??|??|???|???|??/g, "I");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
    str = str.replace(/???|??|???|???|???/g, "Y");
    str = str.replace(/??/g, "D");
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
    // B??? c??c kho???ng tr???ng li???n nhau
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
    { label: "M?? s??ch", key: "masach" },
    { label: "T??n s??ch", key: "tensach" },
    { label: "T??c gi???", key: "tacgia" },
    { label: "Nh?? xu???t b???n", key: "nhaxuatban" },
    { label: "M?? h???c ph???n", key: "mahocphan" },
    { label: "V??? tr??", key: "vitri" },
    { label: "S??? l?????ng", key: "soluong" },
    { label: "N??m xu???t b???n", key: "namxuatban" },
    { label: "H??nh th???c m?????n", key: "hinhthucmuon" },
    { label: "Ng??n ng???", key: "ngonngu" },
    { label: "Lo???i s??ch", key: "loaisach" },
    { label: "Ch??? ?????", key: "chude" }
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
              <th className="align-middle text-center">M?? s??ch</th>
              <th className="align-middle text-center">T??n s??ch</th>
              <th className="align-middle text-center">T??c gi???</th>
              <th className="align-middle text-center">Nh?? xu???t b???n</th>
              <th className="align-middle text-center">M?? h???c ph???n</th>
              <th className="align-middle text-center">V??? tr??</th>
              <th className="align-middle text-center">S??? l?????ng</th>
              <th className="align-middle text-center">N??m xu???t b???n</th>
              <th className="align-middle text-center">H??nh th???c m?????n</th>
              <th className="align-middle text-center">Ng??n ng???</th>
              <th className="align-middle text-center">Lo???i s??ch</th>
              <th className="align-middle text-center">Ch??? ?????</th>
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
                Nh???p ti??u ?????
              </label>
              <input
                type="text"
                id="tensach"
                name="tensach"
                className="form-control"
                placeholder="Nh???p ti??u ????? c???n t??m ki???m"
                onChange={(e) => setTieuDe(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="tacgia"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nh???p t??c gi???
              </label>
              <input
                type="text"
                id="tacgia"
                name="tacgia"
                className="form-control"
                placeholder="Nh???p t??c gi??? c???n t??m ki???m"
                onChange={(e) => setTacGia(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="ngonngu"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Ch???n ng??n ng???
              </label>
              <div>
                <select
                  id="ngonngu"
                  name="ngonngu"
                  className="form-control"
                  onChange={(e) => setNgonNgu(e.target.value)}
                >
                  <option value="">T???t c???</option>
                  <option value="Ti???ng Vi???t">Ti???ng Vi???t</option>
                  <option value="Ng??n ng??? kh??c">Ng??n ng??? kh??c</option>
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
                Nh???p n??m xu???t b???n: T??? n??m
              </label>
              <input
                type="text"
                id="namxbstart"
                name="namxbstart"
                className="form-control"
                placeholder="N??m xu???t b???n: T??? n??m"
                onChange={(e) => setNamXbStart(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="namxbend"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nh???p n??m xu???t b???n: ?????n n??m
              </label>
              <input
                type="text"
                id="namxbend"
                name="namxbend"
                className="form-control"
                placeholder="N??m xu???t b???n: ?????n n??m"
                onChange={(e) => setNamXbEnd(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="nhaxb"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nh???p nh?? xu???t b???n
              </label>
              <input
                type="text"
                id="nhaxb"
                name="nhaxb"
                className="form-control"
                placeholder="Nh???p nh?? xu???t b???n c???n t??m ki???m"
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
                Nh???p ch??? ?????
              </label>
              <input
                type="text"
                id="chude"
                name="chude"
                className="form-control"
                placeholder="Nh???p ch??? ????? c???n t??m ki???m"
                onChange={(e) => setChuDe(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="loaisach"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nh???p lo???i s??ch
              </label>
              <input
                type="text"
                id="loaisach"
                name="loaisach"
                className="form-control"
                placeholder="Nh???p lo???i s??ch c???n t??m ki???m"
                onChange={(e) => setLoaiSach(e.target.value)}
              />
            </div>
            <div className="form-group col-4">
              <label
                htmlFor="mahp"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nh???p m?? h???c ph???n
              </label>
              <input
                type="text"
                id="mahp"
                name="mahp"
                className="form-control"
                placeholder="S??? m?? h???c ph???n c???n t??m ki???m"
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
                L??m l???i
              </button>

              <button
                style={{ maxHeight: "38px", marginLeft: "10px" }}
                type="button"
                className="btn btn-primary"
                onClick={searchkhongdau}
              >
                T??m kh??ng d???u
              </button>
              <button
                style={{ maxHeight: "38px", marginLeft: "10px" }}
                type="button"
                className="btn btn-primary"
                onClick={search}
              >
                T??m ki???m
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
                  <th className="align-middle text-center">M?? s??ch</th>
                  <th className="align-middle text-center">S???a</th>
                  <th className="align-middle text-center">X??a</th>
                  <th className="align-middle text-center">Chuy???n</th>
                  <th className="align-middle text-center">T??n s??ch</th>
                  <th className="align-middle text-center">T??c gi???</th>
                  <th className="align-middle text-center">Nh?? xu???t b???n</th>
                  <th className="align-middle text-center">M?? h???c ph???n</th>
                  <th className="align-middle text-center">V??? tr??</th>
                  <th className="align-middle text-center">S??? l?????ng</th>
                  <th className="align-middle text-center">N??m xu???t b???n</th>
                  <th className="align-middle text-center">H??nh th???c m?????n</th>
                  <th className="align-middle text-center">Ng??n ng???</th>
                  <th className="align-middle text-center">Lo???i s??ch</th>
                  <th className="align-middle text-center">Ch??? ?????</th>
                </tr>
                {!book.length ? (
                  <tr>
                    <td colSpan="15" className="align-middle text-center">Kh??ng c?? d??? li???u</td>
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
          <Modal.Title id="example-modal-sizes-title-lg">X??a s??ch</Modal.Title>
        </Modal.Header>
        <Modal.Body>B???n c?? ch???c mu???n x??a s??ch n??y?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            ????ng
          </Button>
          <Button variant="primary" onClick={deleteBook}>
            X??a
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
            Chuy???n ?????i t??nh tr???ng s??ch
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
                Nh???p t??nh tr???ng s??ch
              </label>
              <input
                type="text"
                id="tinhtrangsach"
                name="tinhtrangsach"
                className="form-control"
                placeholder="nh???p t??nh tr???ng s??ch"
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
                Nh???p s??? l?????ng s??ch
              </label>
              <input
                type="number"
                id="soluong"
                name="soluong"
                className="form-control"
                placeholder="nh???p s??? l?????ng s??ch"
                onChange={(e) => setSoLuong(e.target.value)}
                min="1"
                max="9999"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            ????ng
          </Button>
          <Button variant="primary" onClick={moveBook}>
            Chuy???n
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
