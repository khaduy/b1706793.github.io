import React from 'react'

function BookTable() {
  return (
    <div className="table-responsive col-12" id="baocaoCV">
      <table className="table table-bordered my-3 text-nowrap" id="dataTable" width="100%" cellSpacing={0}>
        <thead className="thead-light">
          <tr>
            <th className="align-middle text-center">Tên sách</th>
            <th className="align-middle text-center">Tác giả</th>
            <th className="align-middle text-center">Vị trí</th>
            <th className="align-middle text-center">Loại sách</th>
          </tr>
        </thead>
        <tr>
            <th className="align-middle text-center">Cơ sở dữ liệu</th>
            <th className="align-middle text-center">Nguyễn Văn A</th>
            <th className="align-middle text-center">Giá 2 kệ 2</th>
            <th className="align-middle text-center">Giáo trình</th>
          </tr>
      </table>
    </div>

  )
}

export default BookTable
