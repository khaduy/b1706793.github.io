import React, { useEffect, useState } from "react";
// import styles from "./css/content.module.css";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { useSpeechRecognition } from "./useSpeechRecognition";

function Search() {
  const speech = useSpeechRecognition();
  const history = useHistory();
  const [danhMuc, setDanhMuc] = useState();
  const [keyWord, setKeyWord] = useState();
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
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    return str;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    var dM = "";
    if (!danhMuc) {
      dM = "tensach";
    } else {
      dM = danhMuc;
    }
    console.log(speech.transcript);
    console.log(keyWord)
    if ( (speech.transcript === "" && !keyWord) || (speech.transcript === "" && keyWord === "")) {
      alert("Vui lòng nhập từ khoá!!!");
    } else {
      if (speech.transcript === "") {
        var kW = tvkd(keyWord);
        history.push(`/search/danhmuc=${dM}&&keyword=${kW}`);
      } else {
        var kW = tvkd(speech.transcript);
        history.push(`/search/danhmuc=${dM}&&keyword=${kW}`);
      }
    }
  };
  const handleChange = async (e) => {
    e.preventDefault();
    setKeyWord(e.target.value);
  };

  return (
    <form
      className="container-fluid"
      style={{ display: "flex", justifyContent: "center" }}
      onSubmit={handleSubmit}
    >
      <div className="form-group col-4" style={{ paddingLeft: 0 }}>
        <label
          htmlFor="danhmuc"
          className="col-form-label"
          style={{ fontWeight: "bold" }}
        >
          Chọn danh mục:
        </label>
        <div>
          <select
            id="danhmuc"
            name="danhmuc"
            className="form-control"
            onChange={(e) => setDanhMuc(e.target.value)}
          >
            <option value="tensach">Tiêu đề</option>
            <option value="tacgia">Tác giả</option>
            <option value="mahp">Mã học phần</option>
            <option value="nhaxb">Nhà xuất bản</option>
          </select>
        </div>
      </div>
      <div
        className="form-group"
        style={{
          flex: "0 0 auto",
          width: "40.5%",
          position: "relative",
          paddingRight: "15px",
        }}
      >
        <label
          htmlFor="keyWord"
          className="col-form-label"
          style={{ fontWeight: "bold" }}
        >
          Nhập từ khóa
        </label>
        <input
          type="text"
          id="keyWord"
          name="keyWord"
          className="form-control"
          placeholder="Nhập từ khóa cần tìm kiếm"
          defaultValue={speech.transcript}
          onChange={handleChange}
          // required
        />
      </div>
      <div
        className="form-group col-0"
        style={{ padding: 0, textAlign: "center" }}
      >
        <label htmlFor="staticEmail" className="col-form-label">
          &nbsp;
        </label>
        <div
          style={{ fontSize: 25 }}
        // onClick={speech.startListening}
        // onChange={(e) => handleSubmit1(speech.transcript)}
        >
          <span>
            {speech.listening ? (
              <span style={{ fontWeight: 500 }} className="text-success">
                <i className="fas fa-microphone" />
              </span>
            ) : (
              <span
                style={{ color: "#dc3545", fontWeight: 500 }}
                className="text-danger"
                onClick={speech.startListening}
              >
                <i className="fas fa-microphone" />
              </span>
            )}
          </span>
        </div>
      </div>
      <div
        className="form-group col-1"
        style={{ paddingRight: 0, textAlign: "right" }}
      >
        <label htmlFor="staticEmail" className="col-form-label">
          &nbsp;
        </label>
        <div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            style={{ maxHeight: "38px" }}
          // onClick={handleSubmit}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </form>
  );
}

export default Search;
