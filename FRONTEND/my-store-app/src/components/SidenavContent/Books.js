import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./css/content.module.css";

function Books() {
  // const [loading, setLoading] = useState(false);
  // const [user, setUser] = useState([]);
  // const [totalPages, setTotalPages] = useState([]);

  // const totalPagesCalculate = (arrLength) => {
  //   const totalP = [];
  //   for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
  //     totalP.push(i);
  //   }
  //   setTotalPages(totalP);
  // };

  // const fetchUser = async () => {
  //   setLoading(true);
  //   const { data } = await axios.get(`/getuser`);
  //   setLoading(false);
  //   setUser(data);
  //   totalPagesCalculate(data.length);
  // };
  // useEffect(() => {
  //   fetchUser();
  // }, []);
  // //=== Pagination
  // const { page = 1 } = useParams();
  // const filterUser = (userList) => {
  //   const firstParam = (page || 1) * 8 - 8;
  //   const secondParam = (page || 1) * 8;
  //   return userList.slice(firstParam, secondParam);
  // };

  // const prevPage = (num) => {
  //   let myNum = Number(num);
  //   if (myNum === 1) {
  //     return "1";
  //   } else if (myNum > 1 && myNum <= totalPages.length) {
  //     return (myNum = myNum - 1);
  //   }
  // };

  // const nextPage = (num) => {
  //   let myNum = Number(num);
  //   if (myNum === totalPages.length) {
  //     return totalPages.length;
  //   } else if (myNum < totalPages.length) {
  //     return (myNum = myNum + 1);
  //   }
  // };
  return (
    <div className={`${styles.content}`}>
    <div className="container-fluid">
        <div className="row">
          <div
            className="col-md-12"
            style={{ textAlign: "left" }}
            id="btnedit"
          >
            <button
              style={{ maxHeight: "38px" }}
              type="submit"
              className="btn btn-primary"
            >
              Thêm sách
            </button>
          </div>
        </div>
      </div>
    <div className="table-responsive col-12" id="baocaoCV">
      <table className="table table-bordered my-3 text-nowrap" id="dataTable" width="100%" cellSpacing={0}>
        <thead className="thead-light">
          <tr>
            <th className="align-middle text-center">ID</th>
            <th className="align-middle text-center">Tên sách</th>
            <th className="align-middle text-center">Nhà xuất bản</th>
            <th className="align-middle text-center">Tác giả</th>
            <th className="align-middle text-center">Năm xuất bản</th>
            <th className="align-middle text-center">Ngôn ngữ</th>
            <th className="align-middle text-center">Chủ đề</th>
            <th className="align-middle text-center">Loại sách</th>
            <th className="align-middle text-center">Sửa</th>
            <th className="align-middle text-center">Khóa</th>
          </tr>
        </thead>

        <tr>
          <th className="align-middle text-center"></th>
          <th className="align-middle text-center"></th>
          <th className="align-middle text-center"></th>
          <th className="align-middle text-center"></th>
          <th className="align-middle text-center"></th>
          <th className="align-middle text-center"> </th>
          <th className="align-middle text-center"> </th>
          <th className="align-middle text-center"> </th>
          <th className="align-middle text-center"> </th>
          <th className="align-middle text-center"> </th>
        </tr>

      </table>
    </div>
    </div>
  );
}


export default Books
