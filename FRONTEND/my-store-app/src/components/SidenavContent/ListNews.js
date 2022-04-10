import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./css/listnews.module.css";
import { Modal, Button } from "react-bootstrap";
import { CSVLink, CSVDownload } from "react-csv";
import ReactToPrint from "react-to-print";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
function ListNews() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };

  const fetchNews = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getnews`);
    console.log(data)
    setLoading(false);
    setNews(data);
    totalPagesCalculate(data.length);
  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[6].check == true) {
      fetchNews();
    } else {
      history.push("/error");
    }
  }, [userInfo]);
  //=== Modal
  const [show, setShow] = useState(false);
  const [news1, setNews1] = useState([]);

  const handleShow = (e, index) => {
    setNews1(news[index].tintucid);
    setShow(true);
  };
  const handleClose = (e) => {
    setShow(false);
  };
  const deleteNews = (e) => {
    console.log(news1);
    const data = new FormData();
    data.append("tintucid", news1);
    axios.post("/deletenews", data);
    fetchNews();
    setShow(false);
  };

  //=== export excel
  const headers = [
    { label: "STT", key: "stt" },
    { label: "Tựa đề", key: "tuade" },
    { label: "Tác giả", key: "tacgia" },
    { label: "Thời gian", key: "thoigian" },
  ];
  const excel = news.map((news, index) => ({
    stt: index + 1,
    tuade: news.title,
    tacgia: news.hoten,
    thoigian: news.thoigian,
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
              <th
                className="align-middle text-center"
                style={{ maxWidth: "500px" }}
              >
                Tiêu đề tin tức
              </th>
              <th className="align-middle text-center">Tác giả</th>
              <th className="align-middle text-center">Thời gian</th>
            </tr>
            {filterNews(news).map((news, index) => (
              <tr>
                <td className="align-middle text-center">{news.index + 1}</td>
                <td
                  className="align-middle text-center"
                  style={{
                    maxWidth: "500px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {news.title}
                </td>
                <td className="align-middle text-center">{news.hoten}</td>
                <td className="align-middle text-center">{news.thoigian}</td>
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
  const [tacGia, setTacGia] = useState();
  const [timeStart, setTimeStart] = useState();
  const [timeEnd, setTimeEnd] = useState();
  const handleClickSearch = async (e) => {
    e.preventDefault();
    fetchNews1();
  };
  const fetchNews1 = async () => {
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
    var tacgia = "";
    var tacgia1 = "";
    if (!tacGia) {
      tacgia = "nbsp";
    } else {
      tacgia1 = tacGia;
      if (tacgia1 === "") {
        tacgia = "nbsp";
      } else {
        tacgia = tacgia1;
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
      `/searchnews/tieude=${tieude}&&tacgia=${tacgia}&&timestart=${timestart}&&timeend=${timeend}`
    );
    console.log(data)
    // setLoading(false);
    setNews(data);
    totalPagesCalculate(data.length);
  };

  //=== Edit
  const [show2, setShow2] = useState(false);
  const [file, setFile] = useState();
  const [image1, setImage1] = useState();
  const [idnews, setIDNews] = useState();
  const [tieuDe1, setTieuDe1] = useState();
  const [state, setState] = React.useState({ value: null });
  const handleChange = value => {
    setState({ value });
  };
  // const [id2, setID2] = useState();
  const handleShow2 = (e, index) => {
    setTieuDe1(news[index].title)
    setImage1(news[index].image)
    setIDNews(news[index].tintucid);
    setState({ value: news[index].content });
    setShow2(true);
  };
  const handleClose2 = (e) => {
    setShow2(false);
  };
  const send1 = (e) => {
    if (!tieuDe1 || state.value === null) {
      alert("Vui lòng nhập đầy đủ thông tin");
    } else {
      console.log("test", state.value);
      const data = new FormData();
      data.append("file", file);
      data.append("id", idnews);
      data.append("tieuDe", tieuDe1);
      data.append("noiDung", state.value);
      axios.post("/editnews", data);
      alert("Sửa tin tức thành công");
      fetchNews();
      setShow2(false);
    }
  };
  //=== Modal Image
  const [show3, setShow3] = useState(false);
  const [link, setLink] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = () => setShow3(true);


  //=== Pagination
  const { page = 1 } = useParams();
  const filterNews = (newsList) => {
    newsList = newsList.map((item, index) => {
      return { ...item, index: index };
    });

    const firstParam = (page || 1) * 8 - 8;
    const secondParam = (page || 1) * 8;
    return newsList.slice(firstParam, secondParam);
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
                Nhập tiêu đề tin tức
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
                htmlFor="tacgia"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tên tác giả
              </label>
              <input
                type="text"
                id="tacgia"
                name="tacgia"
                className="form-control"
                placeholder="Nhập tên tác giả cần tìm kiếm"
                onChange={(e) => setTacGia(e.target.value)}
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

        <div className="table-responsive" id="baocaoCV">
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
                <th className="align-middle text-center">Xóa</th>
                <th
                  className="align-middle text-center"
                  style={{ maxWidth: "500px" }}
                >
                  Tiêu đề tin tức
                </th>
                <th className="align-middle text-center">Tác giả</th>
                <th className="align-middle text-center">Thời gian</th>
              </tr>
              {!news.length ? (
                <tr>
                  <td colSpan="11" className="align-middle text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              ) : (
                filterNews(news).map((news, index) => (
                  <tr>
                    <td className="align-middle text-center">{news.index + 1}</td>
                    <td className="align-middle text-center">
                      <div onClick={(e) => handleShow2(e, index)} >
                        <span className="fas fa-edit text-success"></span>
                      </div>
                    </td>
                    <td className="align-middle text-center">
                      <div onClick={(e) => handleShow(e, index)} >
                        <span className="far fa-trash-alt text-danger"></span>
                      </div>
                    </td>
                    <td
                      className="align-middle text-center"
                      style={{
                        maxWidth: "500px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Link to={`/detailnews/${news.tintucid}`} target="_blank" className="text-decoration-none">
                        {news.title}
                      </Link>
                    </td>
                    <td className="align-middle text-center">{news.hoten}</td>
                    <td className="align-middle text-center">{news.thoigian}</td>
                  </tr>
                )
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
                    to={`/listnews/page/${prevPage(page)}`}
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
                    <Link to={`/listnews/page/${item}`} className="page-link">
                      {item}
                    </Link>
                  </li>
                ))}
                <li className="page-item">
                  <Link
                    to={`/listnews/page/${nextPage(page)}`}
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
          <Modal.Title id="example-modal-sizes-title-lg">
            Xóa tin tức
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc muốn xóa tin tức này?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Đóng
          </Button>
          <Button variant="primary" onClick={deleteNews}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={show2}
        onHide={(e) => handleClose2(e)}
        aria-labelledby="example-modal-sizes-title-lg"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Chỉnh sửa tin tức
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <div className="row">
                <div className="col-5">
                  <div className="form-group">
                    <input
                      type="file"
                      className="form-control-file"
                      onChange={(e) => setFile(e.target.files[0])}
                      required
                    />
                  </div>
                </div>
                <div className="col-4" onClick={handleShow3}>
                  <Button
                    variant="primary"
                    onClick={() => setLink(`http://localhost:4000/${news.image}`)}
                  >
                    Xem ảnh cũ
                  </Button>
                </div>
              </div>

              <div className="form-group">
                <label>Tiêu đề tin tức</label>
                <textarea
                  name="tieudetintuc"
                  className="form-control w-100"
                  onChange={(e) => setTieuDe1(e.target.value)}
                  defaultValue={tieuDe1}
                  required
                ></textarea>
              </div>
              <div className="form-group">
                <label>Nhập nội dung tin tức</label>
                <EditorToolbar />
                <ReactQuill
                  theme="snow"
                  value={state.value}
                  onChange={handleChange}
                  placeholder={"nhập nội dung tin tức..."}
                  modules={modules}
                  formats={formats}
                />
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose2}>
            Đóng
          </Button>
          <Button variant="primary" onClick={send1}>
            Chỉnh sửa
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={show3}
        onHide={handleClose3}
        dialogClassName="modal-75w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body className={`${styles.modalBody}`}>
          <img
            src={image1}
            className={`${styles.imgModal}`}
            alt=""
          />
        </Modal.Body>
      </Modal>

      <div style={{ display: "none" }}>
        <ComponentToPrint ref={componentRef} />
      </div>
    </div>
  );
}

export default ListNews;
