import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./css/image.module.css";
// import "./css/imagepicker.css";
// import "react-image-picker/dist/index.css";
// import ImagePicker from "react-image-picker";

function Images() {
  const history = useHistory();
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;

  const [file, setFile] = useState();
  const username = userInfo?.username;
  const [loading, setLoading] = useState(false);

  const [sourceImages, setSourceImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const onPick = (data) => {
    // console.log(data);
    let ids = selectedImages;
    if (!ids.includes(data.id)) {
      ids.push(data.id);
    } else {
      ids.splice(ids.indexOf(data.id), 1);
    }
    console.log("ids", ids);
    setSelectedImages(ids);
  };
  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 12); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };
  const fetchImage = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getimage`);
    setLoading(false);
    setSourceImages(data);
    totalPagesCalculate(data.length);
  };

  useEffect(() => {
    setSourceImages([]);
    setSelectedImages([]);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(file);
    if (!file) {
      alert("Vui lòng chọn tệp trước khi thêm ảnh!!!");
      return;
    } else {
      const data = new FormData();
      data.append("username", username);
      data.append("file", file);
      axios.post("/addimage", data);
      alert("Thêm ảnh thành công!!!");
      fetchImage();
    }
  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[5].check == true) {
      fetchImage();
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  const deleteSubmit = async () => {
    console.log(selectedImages);
    for (let i = 0; i < selectedImages.length; i++) {
      const data = {
        id: selectedImages[i],
      };
      await axios.post("/dropimage", data);
    }
    alert("Xoá ảnh thành công!!!");
    setSelectedImages([]);
    fetchImage();
  };

  const onSubmit = async () => {
    console.log(selectedImages);
    for (let i = 0; i < selectedImages.length; i++) {
      const data = {
        id: selectedImages[i],
      };
      await axios.put("/showimage", data);
    }
    alert("Hiển thị ảnh thành công!!!");
    setSelectedImages([]);
    fetchImage();
  };
  const offSubmit = async () => {
    console.log(selectedImages);
    for (let i = 0; i < selectedImages.length; i++) {
      const data = {
        id: selectedImages[i],
      };
      await axios.put("/offshowimage", data);
    }
    alert("Ẩn ảnh thành công!!!");
    setSelectedImages([]);
    fetchImage();
  };

  const ImageItem = ({ item, index }) => {
    return (
      <img
        key={index}
        id={item.id}
        className={`${item.check > 1 ? styles.img2 : styles.img1}`}
        src={`http://localhost:4000/${item.image}`}
      ></img>
    );
  };

  //=== Pagination
  const { page = 1 } = useParams();
  const filterImage = (imageList) => {
    const firstParam = (page || 1) * 12 - 12;
    const secondParam = (page || 1) * 12;
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

  return (
    <div className={`${styles.content}`}>
      <div className="container">
        <div className="row" style={{ justifyContent: "left" }}>
          <div className="col-5">
            <div className="form-group">
              <label>Thêm ảnh vào album</label>
              <input
                multiple
                type="file"
                className="form-control-file"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={handleSubmit}
            >
              Thêm ảnh
            </button>
            &nbsp;
            <button
              type="button"
              className="btn btn-danger mb-2"
              onClick={() => deleteSubmit()}
            >
              Xoá ảnh
            </button>
            &nbsp;
            <button
              type="button"
              className="btn btn-success mb-2"
              onClick={() => onSubmit()}
            >
              Hiển thị ảnh
            </button>
            &nbsp;
            <button
              type="button"
              className={`${styles.btnInfo} btn btn-info mb-2`}
              onClick={() => offSubmit()}
            >
              Ẩn ảnh
            </button>
          </div>
        </div>
        <br />
        {loading ? (
          <div> Loading... </div>
        ) : (
          <div>
            <div className="row" style={{ justifyContent: "center" }}>
              {filterImage(sourceImages).map((item, index) => (
                <div className="col-2" style={{ paddingBottom: "16px" }}>
                  {/* <div className={`${styles.box}`}> */}
                  <input
                    className={`${styles.checked} form-check-input`}
                    type="checkbox"
                    id={item.id}
                    onClick={() => onPick(item)}
                  />
                  <label htmlFor={item.id} className={`${styles.box}`}>
                    <ImageItem item={item} index={index}></ImageItem>
                  </label>
                  {/* </div> */}
                </div>
              ))}
            </div>

            <br />

            <div className="row" style={{ justifyContent: "center" }}>
              <div
                className="col-12"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <Link
                        to={`/image/page/${prevPage(page)}`}
                        className="page-link"
                      >
                        Prev
                      </Link>
                    </li>
                    {totalPages.map((item, i) => (
                      <li
                        key={i}
                        className={`${item === Number(page) ? "active" : ""
                          } page-item`}
                      >
                        <Link to={`/image/page/${item}`} className="page-link">
                          {item}
                        </Link>
                      </li>
                    ))}

                    <li className="page-item">
                      <Link
                        to={`/image/page/${nextPage(page)}`}
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
        )}
      </div>
    </div>
  );
}

export default Images;
