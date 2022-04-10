import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./css/photos.module.css";
import { Modal } from 'react-bootstrap';

function Photos() {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };

  const fetchImage = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getshowimage`);
    setLoading(false);
    setImage(data);
    totalPagesCalculate(data.length);
  };

  useEffect(() => {
    fetchImage();
  }, []);

  //=== Pagination
  const { page = 1 } = useParams();
  const filterImage = (imageList) => {
    const firstParam = (page || 1) * 8 - 8;
    const secondParam = (page || 1) * 8;
    return imageList.slice(firstParam, secondParam);
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

  //=== Modal Image
  const [show, setShow] = useState(false);
  const [link, setLink] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return loading ? (
    <div> Loading... </div>
  ) : (
    <div className="container">

      <div className="row" style={{ justifyContent: 'center' }}>
        {!image.length ? (
          <div className={`${styles.notify
          }`}>
            <h3>Chưa có ảnh nào được hiển thị</h3>
          </div>
        ) : (
          filterImage(image).map((image) => (
            <div className="col-3" style={{ paddingBottom: '16px' }} >
              <div className={`${styles.box}`} onClick={handleShow}>
                <img
                  src={`http://localhost:4000/${image.image}`}
                  className={`${styles.img}`}
                  onClick={() => setLink(`http://localhost:4000/${image.image}`)}
                  alt=""
                />
              </div>
            </div>
          )))}

      </div>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="modal-75w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Body className={`${styles.modalBody}`} >
          <img src={link} className={`${styles.imgModal}`} alt="" />
        </Modal.Body>
      </Modal>

      <br />
      <div className="row">
        <div className="col-12" style={{ display: "flex", justifyContent: "center" }}>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <Link to={`/photos/page/${prevPage(page)}`} className="page-link">Prev</Link>
              </li>
              {totalPages.map((item) => (
                <li className={`${item === Number(page) ? "active" : ""} page-item`}>
                  <Link to={`/photos/page/${item}`} className="page-link">{item}</Link>
                </li>
              ))}

              <li className="page-item">
                <Link to={`/photos/page/${nextPage(page)}`} className="page-link">Next</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

  )
}

export default Photos
