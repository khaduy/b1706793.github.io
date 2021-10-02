import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from "./css/content.module.css";

function Users(props) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };

  const fetchUser = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getuser`);
    setLoading(false);
    setUser(data);
    totalPagesCalculate(data.length);
  };
  useEffect(() => {
    fetchUser();
  }, []);
  //=== Pagination
  const { page = 1 } = useParams();
  const filterUser = (userList) => {
    const firstParam = (page || 1) * 8 - 8;
    const secondParam = (page || 1) * 8;
    return userList.slice(firstParam, secondParam);
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
    <div className="table-responsive col-12" id="baocaoCV">
      <table className="table table-bordered my-3 text-nowrap" id="dataTable" width="100%" cellSpacing={0}>
        <thead className="thead-light">
          <tr>
            <th className="align-middle text-center">Tên người dùng</th>
            <th className="align-middle text-center">Họ và tên</th>
            <th className="align-middle text-center">Địa chỉ</th>
            <th className="align-middle text-center">Số điện thoại</th>
            <th className="align-middle text-center">Email</th>
            <th className="align-middle text-center">Phân quyền</th>
            <th className="align-middle text-center">Sửa</th>
            <th className="align-middle text-center">Khóa</th>
          </tr>
        </thead>
        {filterUser(user).map((user) => (
          <tr>
            <th className="align-middle text-center">{user.usernames}</th>
            <th className="align-middle text-center">{user.hoten}</th>
            <th className="align-middle text-center">{user.diachi}</th>
            <th className="align-middle text-center">{user.sdt}</th>
            <th className="align-middle text-center">{user.email}</th>
            <th className="align-middle text-center"> </th>
            <th className="align-middle text-center"> </th>
            <th className="align-middle text-center"> </th>
          </tr>
        ))}
      </table>
      <div className="row">
        <div className="col-12" style={{ display: "flex", justifyContent: "right" }}>
          <nav aria-label="Page navigation example">
            <ul className="pagination">
              <li className="page-item">
                <Link to={`/khlisting/page/${prevPage(page)}`} className="page-link">Prev</Link>
              </li>
              {totalPages.map((item) => (
                <li className={`${item === Number(page) ? "active" : ""} page-item`}>
                  <Link to={`/khlisting/page/${item}`} className="page-link">{item}</Link>
                </li>
              ))}

              <li className="page-item">
                <Link to={`/khlisting/page/${nextPage(page)}`} className="page-link">Next</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}


export default Users
