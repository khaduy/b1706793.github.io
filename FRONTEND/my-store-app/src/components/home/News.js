import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import styles from "./css/books.module.css";

function News() {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };

  const fetchNews = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getnews`);
    setLoading(false);
    setNews(data);
    totalPagesCalculate(data.length);
  };
  useEffect(() => {
    fetchNews();
  }, []);
  //=== Pagination
  const { page = 1 } = useParams();
  const filterNews = (newsList) => {
    const firstParam = (page || 1) * 8 - 8;
    const secondParam = (page || 1) * 8;
    return newsList.slice(firstParam, secondParam);
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

  return loading ? (
    <div> Loading... </div>
  ) : (
    <div className="container-fluid">
      <div className="row" style={{ justifyContent: "center" }}>
        {filterNews(news).map((news, index) => (
          <div className="col-5" style={{ paddingBottom: "16px" }}>
            <div
              style={{
                display: "flex",
                border: "1px solid #e0e0e0",
                boxShadow: "0 20px 40px rgb(0 0 0 / 6%)",
                borderRadius: "8px",
                overflow: "hidden",
                height: "115px",
              }}
            >
              <div className="w-25">
                <div className="event-image">
                  <Link
                    to={`/detailnews/${news.tintucid}`} target="_blank"

                  >
                    <img
                      src={`http://localhost:4000/${news.image}`}
                      style={{ height: "115px", width: "150px" }}
                    />
                  </Link>
                </div>
              </div>
              <div>
                <p
                  className="content"
                  style={{ padding: ".75rem 1rem 0 .875rem" }}
                >
                  <span className="icon-event-link" />
                  <Link
                    to={`/detailnews/${news.tintucid}`} target="_blank"
                    style={{ textDecoration: "none" }}
                  >
                    {news.title}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div
          className="col-12"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <Link to={`/home/page/${prevPage(page)}`} className="page-link">
                  Prev
                </Link>
              </li>
              {totalPages.map((item) => (
                <li
                  className={`${item === Number(page) ? "active" : ""
                    } page-item`}
                >
                  <Link to={`/home/page/${item}`} className="page-link">
                    {item}
                  </Link>
                </li>
              ))}
              <li className="page-item">
                <Link to={`/home/page/${nextPage(page)}`} className="page-link">
                  Next
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <br />
    </div>
  );
}

export default News;
