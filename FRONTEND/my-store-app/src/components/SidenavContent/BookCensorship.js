import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./css/books.module.css";
import { Modal, Button } from "react-bootstrap";

function BookCensorship() {
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
    const { data } = await axios.get(`/censorshipbook`);
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

  const censor = (e, index) => {
    const sachid = book[index].sachid;
    console.log(sachid);

    const data = new FormData();
    data.append("sachid", book[index].sachid);
    axios.post("/censorbook", data);
    fetchBook();
  };
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
        <h3 className={`${styles.title}`}>Duy???t s??ch</h3>
        <div className="table-responsive" id="baocaoCV">
          <table
            className="table table-bordered my-3 text-nowrap"
            id="dataTable"
            width="100%"
            cellSpacing={0}
          >
            <tbody className={`${styles.tbody}`}>
              <tr className="thead-light">
                <th className="align-middle text-center">STT</th>
                <th className="align-middle text-center">Duy???t</th>
                <th className="align-middle text-center">X??a</th>
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
                  <td colSpan="14" className="align-middle text-center">
                    Kh??ng c?? d??? li???u
                  </td>
                </tr>
              ) : (
                filterBook(book).map((book, index) => (
                  <tr>
                    <td className="align-middle text-center">{index + 1}</td>
                    <td className="align-middle text-center">
                      <div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={(e) => censor(e, index)}
                        >
                          Duy???t s??ch
                        </button>
                      </div>
                    </td>
                    <td className="align-middle text-center">
                      <div onClick={(e) => handleShow(e, index)}>
                        <span className="far fa-trash-alt text-danger"></span>
                      </div>
                    </td>
                    <td className="align-middle text-center">{book.tensach}</td>
                    <td className="align-middle text-center">{book.tacgia}</td>
                    <td className="align-middle text-center">{book.nhaxb}</td>
                    <td className="align-middle text-center">{book.mahp}</td>
                    <td className="align-middle text-center">{book.vitri}</td>
                    <td className="align-middle text-center">{book.soluong}</td>
                    <td className="align-middle text-center">{book.namxb}</td>
                    <td className="align-middle text-center">
                      {book.hinhthuc}
                    </td>
                    <td className="align-middle text-center">{book.ngonngu}</td>
                    <td className="align-middle text-center">{book.tenloai}</td>
                    <td className="align-middle text-center">
                      {book.tenchude}
                    </td>
                  </tr>
                ))
              )}
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
    </div>
  );
}

export default BookCensorship;
