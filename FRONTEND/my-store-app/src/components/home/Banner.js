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
                <strong>CHỈ DẪN</strong>
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
                  &nbsp;&nbsp;Phục vụ máy tính:{" "}
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
                  &nbsp;&nbsp;Phục vụ tài liệu mượn:{" "}
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
              <p>
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
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
