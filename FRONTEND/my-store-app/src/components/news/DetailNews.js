import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom'
import styles from "./css/detailnews.module.css";
function DetailNews() {
  const [loading, setLoading] = useState(false);
  const [detailNews, setDetailNews] = useState([]);
  const { id } = useParams()
  const fetchDetailNews = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getdetailnews/${id}`);
    setLoading(false);
    setDetailNews(data);
  };
  useEffect(() => {
    fetchDetailNews();
  }, [id]);

  return loading ? (
    <div> Loading... </div>
  ) : (
    <>
      {detailNews.map((news) => (
        <div className={`${styles.container} container-fluid`}>
          <div className={`row`} style={{ display: "flex", justifyContent: "center" }}>
            <div className={`col-10`}>
              <div className={`${styles.title}`}>{news.title}</div>
              <span className={`${styles.time}`}>{news.thoigian} | {news.hoten}</span>
              <div className={`${styles.boxImage}`}>
                <img src={`http://localhost:4000/${news.image}`} alt="" className={`${styles.img}`} />
              </div>
              <div className={`${styles.boxNews} row`} style={{ display: "flex", justifyContent: "center" }}>
                <div className="col-8" style={{ textAlign: "justify"}}
                  dangerouslySetInnerHTML={{ __html: news.content }} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default DetailNews
