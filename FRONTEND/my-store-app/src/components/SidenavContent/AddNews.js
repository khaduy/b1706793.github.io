import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./css/addnews.module.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import EditorToolbar, { modules, formats } from "./EditorToolbar";

function AddNews() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;

  const history = useHistory();
  const [file, setFile] = useState();
  const [tieuDe, setTieuDe] = useState();
  const [state, setState] = React.useState({ value: null });
  const handleChange = value => {
    setState({ value });
  };
  const send = (e) => {
    if (!file || !tieuDe || state.value===null) {
      alert("Vui lòng nhập đầy đủ thông tin");
    } else {
      console.log("test", state.value);
      var time = new Date().toLocaleString('en-ZA');
      const data = new FormData();
      data.append("file", file);
      data.append("tieuDe", tieuDe);
      data.append("noiDung", state.value);
      data.append("tacGia", userInfo.username);
      data.append("thoiGian", time);

      // console.log(data);
      axios.post("/addnews", data);
      alert("Thêm tin tức thành công");
      history.push("/listnews");
    }

  };
  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[6].check == true) {
      console.log("");
    } else {
      history.push("/error");
    }
  }, [userInfo]);
  return (
    <div className={`${styles.content}`}>
      <div className="container">
        <h3 className={`${styles.title}`}>Thêm tin tức</h3>
        <hr />
        <div>
          <div className="form-group">
            <label>Thêm ảnh thu nhỏ</label>
            <input
              type="file"
              className="form-control-file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <div className="form-group">
            <label>Tiêu đề tin tức</label>
            <textarea
              name="tieudetintuc"
              className="form-control w-100"
              onChange={(e) => setTieuDe(e.target.value)}
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
          <button
            type="submit"
            className="btn btn-primary mb-2"
            onClick={send}
          >
            Thêm tin tức
          </button>
        </div>
      </div>
    </div>
  );
}



export default AddNews;
