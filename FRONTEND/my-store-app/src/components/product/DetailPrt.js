import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./css/detailprt.module.css";
import { useSelector } from "react-redux";
function DetailPrt(props) {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const [loading, setLoading] = useState(false);
  const [detailBook, setDetailBook] = useState([]);
  const { id } = useParams();
  const fetchDetailBook = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getdetailbook/${id}`);
    setLoading(false);
    setDetailBook(data);
  };
  const [gallery, setGallery] = useState(2);
  const fetchGallery = async () => {
    const { data } = await axios.get(`/getgallery/sachid=${id}&&userms=${userInfo.username}`);
    if(data.length===0){
      setGallery(1);
    } else {
      setGallery(2);
    }
  };
  useEffect(() => {
    fetchDetailBook();
    fetchGallery();
  }, [id]);

  const addGallery = (e, index) => {
    console.log("add")
    setGallery(2);
    const data = {
      "sachid": id,
      "userms": userInfo.username
    }
    axios.post("/addgallery", data);
  };
  const removeGallery = (e, index) => {
    console.log("remove")
    setGallery(1);
    const data = {
      "sachid": id,
      "userms": userInfo.username
    }
    axios.post("/removegallery", data);
  };

  return loading ? (
    <div> Loading... </div>
  ) : (
    <>
      {detailBook.map((book, index) => (
        <div key={index} className={`${styles.container} container`}>
          <div className="row">
            <div className="col-9">
              <h3>{book.tensach}</h3>
            </div>


            {(() => {
              if (gallery === 1) {
                return (
                  <div className={`${styles.note} col-3`} onClick={(e) => addGallery(e)} >
                    <Link to="#">
                      <label className={`${styles.note1}`}>
                        <i className="fas fa-save" />
                      </label>
                    </Link>
                  </div>
                );
              } else {
                return (
                  <div className={`${styles.note2} col-3`} onClick={(e) => removeGallery(e)}>
                    <Link to="#" >
                      <label className={`${styles.note4}`}>
                        <i className="fas fa-save" />
                      </label>
                    </Link>
                  </div>
                );
              }
            })()}



          </div>
          <div className={`${styles.wrap}`}>
            <div className="row">
              <div className={`${styles.boximage} col-2`}>
                <img
                  src={`http://localhost:4000/${book.hinhanh}`}
                  className={`${styles.img} `}
                  alt=""
                />
              </div>
              <div className="col-4">
                <ul className={`${styles.ul}`}>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label}`}>Tác giả:</label>
                    <label className={`${styles.label1}`}>{book.tacgia}</label>
                  </li>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label}`}>Nhà xuất bản:</label>
                    <label className={`${styles.label1}`}>{book.nhaxb}</label>
                  </li>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label}`}>Vị trí:</label>
                    <label className={`${styles.label1}`}>{book.vitri}</label>
                  </li>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label}`}>Mã học phần:</label>
                    <label className={`${styles.label1} text-uppercase`}>{book.mahp}</label>
                  </li>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label}`}>Số lượng:</label>
                    <label className={`${styles.label1}`}>{book.soluong}</label>
                  </li>
                </ul>
              </div>
              <div className="col-3">
                <ul className={`${styles.ul}`}>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label2}`}>Năm xuất bản:</label>
                    <label className={`${styles.label3}`}>{book.namxb}</label>
                  </li>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label2}`}>
                      Hình thức mượn:
                    </label>
                    <label className={`${styles.label3}`}>
                      {book.hinhthuc}
                    </label>
                  </li>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label2}`}>Ngôn ngữ:</label>
                    <label className={`${styles.label3}`}>{book.ngonngu}</label>
                  </li>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label2}`}>Loại sách:</label>
                    <label className={`${styles.label3}`}>{book.tenloai}</label>
                  </li>
                  <li className={`${styles.li}`}>
                    <label className={`${styles.label2}`}>Chủ đề:</label>
                    <label className={`${styles.label3}`}>
                      {book.tenchude}
                    </label>
                  </li>
                </ul>
              </div>
              <div className="col-3">
                <ul className={`${styles.ul}`}>
                  <li className={`${styles.li1}`}>
                    <label className={`${styles.label4}`}>Miêu tả:</label>
                    <label className={`${styles.label5}`}>{book.mieuta}</label>
                  </li>
                </ul>
              </div>
            </div>

            {/* <br />
        <div className="row">
          <p className={`${styles.p}`}>Miêu tả sách: test abc</p>
        </div> */}
          </div>
        </div>
      ))}
    </>
  );
}

export default DetailPrt;
