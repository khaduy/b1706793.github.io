import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function BookTable(props) {
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState([]);
  const [totalPages, setTotalPages] = useState([]);
  const { dM, kW } = useParams();
  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };
  // console.log(dM);
  // console.log(kW);
  const fetchBook = async () => {
    setLoading(true);
    const info = new FormData();
    info.append("dM", dM);
    info.append("kW", kW);
    const { data } = await axios.get(`/search/danhmuc=${dM}&&keyWord=${kW}`);
    setLoading(false);
    setBook(data);
    totalPagesCalculate(data.length);
  };
  useEffect(() => {
    fetchBook();
  }, [dM, kW]);
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
    <div className="container-fluid" style={{ display: "flex", justifyContent: "center" }}>
      <div className="col-10" style={{ padding: "0", paddingBottom: "27px" }}>
        <div>
          <table className="table table-responsive table-bordered my-3 text-nowrap" id="dataTable" width="100%" cellSpacing={0}>
            <tbody>
              <tr className="thead-light">
                <th className="align-middle text-center" style={{ minWidth: "52px" }}>Mã sách</th>
                <th className="align-middle text-center" style={{ minWidth: "94px" }}>Tên sách</th>
                <th className="align-middle text-center" style={{ minWidth: "80px" }}>Tác giả</th>
                <th className="align-middle text-center" style={{ minWidth: "137px" }}>Nhà xuất bản</th>
                <th className="align-middle text-center" style={{ minWidth: "133.7px" }}>Mã học phần</th>
                <th className="align-middle text-center" style={{ minWidth: "62.7px" }}>Vị trí</th>
                <th className="align-middle text-center" style={{ minWidth: "99.2px" }}>Số lượng</th>
                <th className="align-middle text-center" style={{ minWidth: "143.7px" }}>Năm xuất bản</th>
                <th className="align-middle text-center" style={{ minWidth: "164.7px" }}>Hình thức mượn</th>
                <th className="align-middle text-center" style={{ minWidth: "109.2px" }}>Ngôn ngữ</th>
                <th className="align-middle text-center" style={{ minWidth: "99.7px" }}>Loại sách</th>
                <th className="align-middle text-center" style={{ minWidth: "81.1px" }}>Chủ đề</th>
              </tr>
              <tr>
                <td colSpan="12" className="align-middle text-center">Không có dữ liệu</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
      </div>
    </div>
  ) : (
    <div className="container-fluid" style={{ display: "flex", justifyContent: "center" }}>
      <div className="col-10" style={{ padding: "0", paddingBottom: "30px" }}>
        {/* <div className="table-responsive" > */}
        <table className="table table-responsive table-bordered my-3 text-nowrap" id="dataTable" width="100%" cellSpacing={0}>
          <tbody>
            <tr className="thead-light">
              <th className="align-middle text-center" style={{ minWidth: "52px" }}>Mã sách</th>
              <th className="align-middle text-center" style={{ minWidth: "94px" }}>Tên sách</th>
              <th className="align-middle text-center" style={{ minWidth: "80px" }}>Tác giả</th>
              <th className="align-middle text-center" style={{ minWidth: "137px" }}>Nhà xuất bản</th>
              <th className="align-middle text-center" style={{ minWidth: "133.7px" }}>Mã học phần</th>
              <th className="align-middle text-center" style={{ minWidth: "62.7px" }}>Vị trí</th>
              <th className="align-middle text-center" style={{ minWidth: "99.2px" }}>Số lượng</th>
              <th className="align-middle text-center" style={{ minWidth: "143.7px" }}>Năm xuất bản</th>
              <th className="align-middle text-center" style={{ minWidth: "164.7px" }}>Hình thức mượn</th>
              <th className="align-middle text-center" style={{ minWidth: "109.2px" }}>Ngôn ngữ</th>
              <th className="align-middle text-center" style={{ minWidth: "99.7px" }}>Loại sách</th>
              <th className="align-middle text-center" style={{ minWidth: "81.1px" }}>Chủ đề</th>
            </tr>
            {!book.length ? (
              <tr>
                <td colSpan="12" className="align-middle text-center">Không có dữ liệu</td>
              </tr>
            ) : (
              filterBook(book).map((book) => (
                <tr>
                  <td className="align-middle text-center">{book.sachid}</td>
                  <td className="align-middle text-center">
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
              ))
            )}
          </tbody>
        </table>
        {/* </div> */}
        <br />
        <div className="row">
          <div className="col-12" style={{ display: "flex", justifyContent: "center" }}>
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className="page-item">
                  <Link to={`/search/page/${prevPage(page)}`} className="page-link">Prev</Link>
                </li>
                {totalPages.map((item) => (
                  <li className={`${item === Number(page) ? "active" : ""} page-item`}>
                    <Link to={`/search/page/${item}`} className="page-link">{item}</Link>
                  </li>
                ))}
                <li className="page-item">
                  <Link to={`/search/page/${nextPage(page)}`} className="page-link">Next</Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}


export default BookTable
