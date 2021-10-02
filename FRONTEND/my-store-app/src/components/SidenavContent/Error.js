import React from 'react'

function Error() {
  return (
    <div>
      <div className="error-page">
        <h2 className="headline text-warning"><i className="fas fa-exclamation-triangle text-warning" /></h2>
        <div className="error-content">
          <h3><b>Không có quyền truy cập.</b></h3>
          <p>Bạn chưa được cấp quyền để truy cập vào chức năng này</p>
          <a href="/">Nhấn vào đây để về lại trang chủ</a>
        </div>
      </div>
    </div>
  )
}

export default Error
