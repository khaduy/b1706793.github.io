import React, { Component } from "react";

class Banner extends Component {
  render() {
    return (
      /* Banner */
      <div className="container-fluid" style={{ paddingBottom: "16px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="col-6" style={{ paddingLeft: 0 }}>
            <a href="https://www.ctu.edu.vn" target="_blank">
              <img
                className="image_main"
                src="https://lrc.ctu.edu.vn/images/slideshow/CTU55nam.png"
                style={{
                  width: "720px",
                  display: "inline",
                  height: "260.034px",
                }}
              />
            </a>
          </div>
          <div
            className="module-style col-4"
            style={{ display: "inline", height: "260.034px" }}
          >
            <div className="module-title">
              <h5
                className="box-title lrc-open-icon align-bottom"
                style={{ marginTop: "10px" }}
              >
                <strong>HOẠT ĐỘNG</strong>
              </h5>
            </div>
            <div className="module-body">
              <p>
                <span
                  style={{
                    fontSize: "12pt",
                    color: "#6e6e6e",
                    fontFamily: "verdana, geneva, sans-serif",
                  }}
                >
                  <strong>Phục vụ từ Thứ Hai đến Thứ Bảy</strong>
                </span>
              </p>
              <p>
                <span
                  style={{
                    fontFamily: "verdana, geneva, sans-serif",
                    fontSize: "1.2em",
                    color: "#554e44",
                  }}
                >
                  &nbsp;
                  <img src="./images/pc-icon.png" width={20} height={20} />
                  &nbsp;&nbsp;Phục vụ máy tính:&nbsp;
                  <span style={{ color: "#0073bc" }}>7:00 – 21:00</span>
                </span>
              </p>

              <p>
                <span
                  style={{
                    fontFamily: "verdana, geneva, sans-serif",
                    fontSize: "1.2em",
                    color: "#554e44",
                  }}
                >
                  &nbsp;
                  <img src="./images/book.png" width={20} height={20} />
                  &nbsp;&nbsp;Phục vụ tài liệu mượn:&nbsp;
                  <span style={{ color: "#0073bc" }}>7:30 – 20:45</span>
                </span>
              </p>
              <p>
                <span
                  style={{
                    fontFamily: "verdana, geneva, sans-serif",
                    fontSize: "1.2em",
                    color: "#554e44",
                  }}
                >
                  &nbsp;
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="far"
                    data-icon="exclamation-circle"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="svg-inline--fa fa-exclamation-circle fa-w-16"
                    style={{ color: "#d0021c" }}
                  >
                    <path
                      fill="currentColor"
                      d="M256 8C119.043 8 8 119.083 8 256c0 136.997 111.043 248 248 248s248-111.003 248-248C504 119.083 392.957 8 256 8zm0 448c-110.532 0-200-89.431-200-200 0-110.495 89.472-200 200-200 110.491 0 200 89.471 200 200 0 110.53-89.431 200-200 200zm42-104c0 23.159-18.841 42-42 42s-42-18.841-42-42 18.841-42 42-42 42 18.841 42 42zm-81.37-211.401l6.8 136c.319 6.387 5.591 11.401 11.985 11.401h41.17c6.394 0 11.666-5.014 11.985-11.401l6.8-136c.343-6.854-5.122-12.599-11.985-12.599h-54.77c-6.863 0-12.328 5.745-11.985 12.599z"
                    />
                  </svg>
                  &nbsp;&nbsp;Chủ Nhật và các ngày lễ:&nbsp;
                  <span style={{ color: "#0073bc" }}>Ngưng phục vụ</span>
                </span>
              </p>

              <p>
                <span
                  style={{
                    fontFamily: "verdana, geneva, sans-serif",
                    fontSize: "1.2em",
                    color: "#554e44",
                  }}
                >
                  &nbsp;
                  <img src="./images/email-logo.png" width={20} height={20} />
                  &nbsp;&nbsp;Email:{" "}
                  <a
                    href="mailto:office@cit.ctu.edu.vn"
                    style={{ color: "#0073bc" }}
                  >
                    office@cit.ctu.edu.vn
                  </a>
                </span>
              </p>

              {/* <p>
                <span
                  style={{
                    fontFamily: "verdana, geneva, sans-serif",
                    fontSize: "1.2em",
                    color: "#554e44",
                  }}
                >
                  &nbsp;
                  <img src="./images/earth_icon.png" width={20} height={20} />
                  &nbsp;&nbsp;Chỉ đường:{" "}
                  <a
                    className="fancybox5310"
                    href="#"
                    title="Bản đồ đường đi tới TVQGVN"
                    style={{ color: "#0073bc" }}
                  >
                    [xem]
                  </a>
                </span>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
