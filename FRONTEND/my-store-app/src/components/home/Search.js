import React, { Component } from 'react';

class Search extends Component {
  render() {
    return (
      /* Search*/
      <div className="container-fluid" style={{ display: 'flex', justifyContent: 'center' }}>
        <div className="form-group col-4" style={{ paddingLeft: 0 }}>
          <label htmlFor="staticEmail" className="col-form-label" style={{ fontWeight: 'bold' }}>Chọn danh mục:</label>
          <div>
            <select id="msbophan" name="msbophan" onchange="onchange_bophan();" className="form-control">
              <option value={0} selected="selected">Tất cả
              </option><option>Nhan đề</option>
              <option>Tác giả</option>
              <option>Chủ đề</option>
            </select>
          </div>
        </div>
        <div className="form-group col-5">
          <label htmlFor="txtLoaiSim" className="col-form-label" style={{ fontWeight: 'bold' }}>Nhập từ khóa</label>
          <input type="text" id="txtLoaiSim" name="txtLoaiSim" className="form-control" placeholder="Nhập từ khóa cần tìm kiếm" />
        </div>
        <div className="form-group col-1" style={{ paddingRight: 0, textAlign: 'right' }}>
          <label htmlFor="staticEmail" className="col-form-label"> &nbsp; </label>
          <div>
            <button className="btn btn-primary w-100" style={{ maxHeight: '38px' }} onclick="Export()">
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

    );
  }
}

export default Search;