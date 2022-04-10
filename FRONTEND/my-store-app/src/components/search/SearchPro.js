import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./css/searchpro.module.css";

function SearchPro() {
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
  const history = useHistory();
  const [tieuDe, setTieuDe] = useState();
  const [tacGia, setTacGia] = useState();
  const [ngonNgu, setNgonNgu] = useState();
  const [namXbStart, setNamXbStart] = useState(1111);
  const [namXbEnd, setNamXbEnd] = useState(new Date().getFullYear());
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
    fetchBook();
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
    var namxbstart = 1111;
    var namxbstart1 = 1111;
    if (!namXbStart) {
      namxbstart = 1111;
    } else {
      namxbstart1 = namXbStart
      if (namxbstart1 === '') {
        namxbstart = 1112;
      } else {
        namxbstart = namxbstart1;
      }
    }
    var namxbend = new Date().getFullYear();;
    var namxbend1 = new Date().getFullYear();;
    if (!namXbEnd) {
      namxbend = new Date().getFullYear();;
    } else {
      namxbend1 = namXbEnd
      if (namxbend1 === "") {
        namxbend = new Date().getFullYear();;
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
    if (namxbstart > new Date().getFullYear()) {
      alert("Năm bắt đầu phải nhỏ hơn năm hiện tại");
      return;
    } else if (namxbend > new Date().getFullYear()) {
      alert("Năm kết thúc phải nhỏ hơn năm hiện tại");
      return;
    } else if(namxbstart > namxbend) {
      alert("Năm bắt đầu phải nhỏ hơn năm kết thúc");
      return;
    }
    setLoading(true);
    console.log("du lieu", tieude, tacgia, ngonngu, namxbstart, namxbend, nhaxb, mahp, chude, loaisach)
    const { data } = await axios.get(`/searchkd/tieude=${tieude}&&tacgia=${tacgia}&&ngonngu=${ngonngu}&&namxbstart=${namxbstart}&&namxbend=${namxbend}&&nhaxb=${nhaxb}&&mahp=${mahp}&&chude=${chude}&&loaisach=${loaisach}`);
    setLoading(false);
    setBook(data);
    totalPagesCalculate(data.length);
  };
  const fetchBook = async () => {
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
    var namxbstart = 1111;
    var namxbstart1 = 1111;
    if (!namXbStart) {
      namxbstart = 1111;
    } else {
      namxbstart1 = namXbStart
      if (namxbstart1 === '') {
        namxbstart = 1112;
      } else {
        namxbstart = namxbstart1;
      }
    }
    var namxbend = new Date().getFullYear();;
    var namxbend1 = new Date().getFullYear();;
    if (!namXbEnd) {
      namxbend = new Date().getFullYear();;
    } else {
      namxbend1 = namXbEnd
      if (namxbend1 === "") {
        namxbend = new Date().getFullYear();;
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
    if (namxbstart > new Date().getFullYear()) {
      alert("Năm bắt đầu phải nhỏ hơn năm hiện tại");
      return;
    } else if (namxbend > new Date().getFullYear()) {
      alert("Năm kết thúc phải nhỏ hơn năm hiện tại");
      return;
    } else if(namxbstart > namxbend) {
      alert("Năm bắt đầu phải nhỏ hơn năm kết thúc");
      return;
    }
    console.log(namxbstart, namxbend)
    setLoading(true);
    const { data } = await axios.get(`/searchpro/tieude=${tieude}&&tacgia=${tacgia}&&ngonngu=${ngonngu}&&namxbstart=${namxbstart}&&namxbend=${namxbend}&&nhaxb=${nhaxb}&&mahp=${mahp}&&chude=${chude}&&loaisach=${loaisach}`);
    setLoading(false);
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
  return (
    <>
      <div className={`${styles.d_container}`}>
        <form
          className="container-fluid"
        // style={{ display: "flex", justifyContent: "center" }}
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
                type="number"
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
                type="number"
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
      </div>

      <div className="container-fluid" style={{ display: "flex", justifyContent: "center" }}>
        {!book.length ? (

          <div className="col-10" style={{ padding: "0" }}>
            <div className="table-responsive" >
              <table className="table table-bordered my-3 text-nowrap" id="dataTable" width="100%" cellSpacing={0}>
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
                  <tr>
                    <td colSpan="12" className="align-middle text-center">Không có dữ liệu</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        ) : (

          <div className="col-10" style={{ padding: "0" }}>
            <br />
            <span>Tìm kiếm được {book.length} kết quả</span>
            <div className="table-responsive" >
              <table className="table table-bordered my-3 text-nowrap" id="dataTable" width="100%" cellSpacing={0}>
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
                  {filterBook(book).map((book) => (
                    <tr>
                      <td className="align-middle text-center">{book.sachid}</td>
                      <td className="align-middle text-center ">
                        <Link className="text-decoration-none" to={`/detailprt/${book.sachid}`} target="_blank">{book.tensach}</Link>
                      </td>
                      <td className="align-middle text-center">{book.tacgia}</td>
                      <td className="align-middle text-center">{book.nhaxb}</td>
                      <td className="align-middle text-center text-uppercase">{book.mahp}</td>
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
            <br />
            <div className="row">
              <div className="col-12" style={{ display: "flex", justifyContent: "center" }}>
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <Link to={`/searchpro/page/${prevPage(page)}`} className="page-link">Prev</Link>
                    </li>
                    {totalPages.map((item) => (
                      <li className={`${item === Number(page) ? "active" : ""} page-item`}>
                        <Link to={`/searchpro/page/${item}`} className="page-link">{item}</Link>
                      </li>
                    ))}
                    <li className="page-item">
                      <Link to={`/searchpro/page/${nextPage(page)}`} className="page-link">Next</Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default SearchPro;
