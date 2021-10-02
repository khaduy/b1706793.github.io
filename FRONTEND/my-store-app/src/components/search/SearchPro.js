import React from "react";
import styles from "./css/searchpro.module.css";

function SearchPro() {
  return (
    /* Search*/
    <div className={`${styles.d_container}`}>
      <div
        className="container-fluid"
      // style={{ display: "flex", justifyContent: "center" }}
      >
        <div className="row">
          <div className="form-group col-4">
            <label
              htmlFor="txtLoaiSim"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Nhập nhan đề
            </label>
            <input
              type="text"
              id="txtLoaiSim"
              name="txtLoaiSim"
              className="form-control"
              placeholder="Nhập nhan đề cần tìm kiếm"
            />
          </div>
          <div className="form-group col-4">
            <label
              htmlFor="txtLoaiSim"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Nhập tác giả
            </label>
            <input
              type="text"
              id="txtLoaiSim"
              name="txtLoaiSim"
              className="form-control"
              placeholder="Nhập tác giả cần tìm kiếm"
            />
          </div>
          <div className="form-group col-4">
            <label
              htmlFor="txtLoaiSim"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Chọn ngôn ngữ
            </label>
            <div>
              <select id="msbophan" name="msbophan" onchange="onchange_bophan();" className="form-control">
                <option value={0} selected="selected" className="select2-results">Tất cả</option>
                <option>Tiếng Việt</option>
                <option>Ngôn ngữ khác</option>
              </select>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="form-group col-4">
            <label
              htmlFor="txtLoaiSim"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Nhập năm xuất bản: Từ năm
            </label>
            <input
              type="text"
              id="txtLoaiSim"
              name="txtLoaiSim"
              className="form-control"
              placeholder="Năm xuất bản: Từ năm"
            />
          </div>
          <div className="form-group col-4">
            <label
              htmlFor="txtLoaiSim"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Nhập năm xuất bản: Đến năm
            </label>
            <input
              type="text"
              id="txtLoaiSim"
              name="txtLoaiSim"
              className="form-control"
              placeholder="Năm xuất bản: đến năm"
            />
          </div>
          <div className="form-group col-4">
            <label
              htmlFor="txtLoaiSim"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Nhập số ISBN
            </label>
            <input
              type="text"
              id="txtLoaiSim"
              name="txtLoaiSim"
              className="form-control"
              placeholder="Số ISBN cần tìm kiếm"
            />
          </div>
        </div>
        <div className="row">
          <div className="form-group col-4">
            <label
              htmlFor="txtLoaiSim"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Nhập chủ đề
            </label>
            <input
              type="text"
              id="txtLoaiSim"
              name="txtLoaiSim"
              className="form-control"
              placeholder="Nhập chủ đề cần tìm kiếm"
            />
          </div>
          <div className="form-group col-4">
            <label
              htmlFor="txtLoaiSim"
              className="col-form-label"
              style={{ fontWeight: "bold" }}
            >
              Nhập loại sách
            </label>
            <input
              type="text"
              id="txtLoaiSim"
              name="txtLoaiSim"
              className="form-control"
              placeholder="Nhập loại sách cần tìm kiếm"
            />
          </div>
        </div>
        <div className="row">
          <div
            className="col-md-12"
            style={{ textAlign: "right" }}
            id="btnedit"
          >
            <button
              style={{ maxHeight: "38px" }}
              type="button"
              className="btn btn-primary"
              onclick="edit()"
            >
              Làm lại
            </button>
            <button
              style={{ maxHeight: "38px", marginLeft: "10px" }}
              type="button"
              className="btn btn-primary"
              onclick="edit()"
            >
              Tìm không dấu
            </button>
            <button
              style={{ maxHeight: "38px", marginLeft: "10px" }}
              type="button"
              className="btn btn-primary"
              onclick="edit()"
            >
              Tìm kiếm
            </button>
          </div>
        </div>

      </div>
    </div>

  );
}

export default SearchPro;
