import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./css/diary.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSVLink, CSVDownload } from "react-csv";
import ReactToPrint from "react-to-print";
function Diary() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [diary, setDiary] = useState([]);
  const [diary1, setDiary1] = useState([]);
  const [totalPages, setTotalPages] = useState([]);

  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 8); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };

  const [note, setNote] = useState([]);
  const [edit, setEdit] = useState([]);

  const fetchDiary = async () => {
    setLoading(true);
    const { data } = await axios.get(`/getdiary`);
    var list = [];
    var listEdit = [];
    for (let i = 0; i < data.length; i++) {
      list.push({ id: data[i].id, ghichu: data[i].ghichu });
      listEdit.push({ value: false });
    }
    console.log(data);
    setEdit(listEdit);
    setNote(list);
    setLoading(false);
    setDiary(data);
    setDiary1(data);
    totalPagesCalculate(data.length);
  };

  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[3].check == true) {
      fetchDiary();
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  //=== Edit noted
  const editNote = (e, index) => {
    var list = [...diary];
    list[index].ghichu = e.target.value;

    setDiary(list);
  };

  const handleClickEdit = (e, index) => {
    var temp = [...diary];
    temp[index].isedit = !temp[index].isedit;
    setDiary(temp);
  };

  const handleClickCheck = (e, index) => {
    var temp = [...diary];

    for (let i = 0; i < temp.length; i++) {
      if (temp[i].isedit === true) {
        const data = {
          id: temp[i].id,
          ghichu: temp[i].ghichu,
        };
        axios.post("/editnote", data);
      }
    }
    temp[index].isedit = !temp[index].isedit;
    setDiary(temp);
  };

  //=== Pagination
  const { page = 1 } = useParams();
  const filterDiary = (diaryList) => {
    diaryList = diaryList.map((item, index) => {
      return { ...item, index: index };
    });
    const firstParam = (page || 1) * 8 - 8;
    const secondParam = (page || 1) * 8;
    return diaryList.slice(firstParam, secondParam);
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

  //=== Bộ lọc
  const [filter1, setFilter1] = useState();
  const search1 = async () => {
    console.log("abc", filter1);
    if (filter1 === "chưa trả") {
      setDiary(
        diary1.filter((item) => item.ngaytra.includes("1/1/1999, 12:00:00 AM"))
      );
      totalPagesCalculate(
        diary1.filter((item) => item.ngaytra.includes("1/1/1999, 12:00:00 AM"))
          .length
      );
    } else {
      setDiary(diary1.filter((item) => item.ngaytra.includes("")));
      totalPagesCalculate(
        diary1.filter((item) => item.ngaytra.includes("")).length
      );
    }
  };

  var tvkd = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
    str = str.replace(/\u02C6|\u0306|\u031B/g, "");
    str = str.replace(/ + /g, " ");
    str = str.trim();
    str = str.replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      " "
    );
    return str;
  };
  const [maSach, setMaSach] = useState();
  const [tenSach, setTenSach] = useState();

  const [MA0, setMa0] = useState();
  const [TEN0, setTen0] = useState();
  const [MA1, setMa1] = useState();
  const [TEN1, setTen1] = useState();
  const [MA2, setMa2] = useState();
  const [TEN2, setTen2] = useState();

  const [trangThai, setTrangThai] = useState();
  const [hanStart, setHanStart] = useState();
  const [hanEnd, setHanEnd] = useState();

  const [muonStart, setMuonStart] = useState();
  const [muonEnd, setMuonEnd] = useState();
  const [traStart, setTraStart] = useState();
  const [traEnd, setTraEnd] = useState();
  const reset = async (e) => {
    setMaSach("");
    setTenSach("");
    setHanStart("");
    setHanEnd("");
    setTrangThai("");
    setMa0("");
    setTen0("");
    setMa1("");
    setTen1("");
    setMa2("");
    setTen2("");
    setMuonStart("");
    setMuonEnd("");
    setTraStart("");
    setTraEnd("");
  };
  const handleClickSearch = async (e) => {
    e.preventDefault();
    fetchDiary1();
  };

  const [test, setTest] = useState("abccc");
  const fetchDiary1 = async () => {
    // setLoading(true);
    var masach = "";
    var masach1 = "";
    if (!maSach) {
      masach = "nbsp";
    } else {
      masach1 = tvkd(maSach);
      if (masach1 === "") {
        masach = "nbsp";
      } else {
        masach = masach1;
      }
    }
    var tensach = "";
    var tensach1 = "";
    if (!tenSach) {
      tensach = "nbsp";
    } else {
      tensach1 = tvkd(tenSach);
      if (tensach1 === "") {
        tensach = "nbsp";
      } else {
        tensach = tensach1;
      }
    }
    var trangthai = "";
    var trangthai1 = "";
    if (!trangThai) {
      trangthai = "nbsp";
    } else {
      trangthai1 = trangThai;
      if (trangthai1 === "") {
        trangthai = "nbsp";
      } else {
        trangthai = trangthai1;
      }
    }
    var ma0 = "";
    var ma00 = "";
    if (!MA0) {
      ma0 = "nbsp";
    } else {
      ma00 = tvkd(MA0);
      if (ma00 === "") {
        ma0 = "nbsp";
      } else {
        ma0 = ma00;
      }
    }
    var ten0 = "";
    var ten00 = "";
    if (!TEN0) {
      ten0 = "nbsp";
    } else {
      ten00 = tvkd(TEN0);
      if (ten00 === "") {
        ten0 = "nbsp";
      } else {
        ten0 = ten00;
      }
    }
    var ma1 = "";
    var ma11 = "";
    if (!MA1) {
      ma1 = "nbsp";
    } else {
      ma11 = tvkd(MA1);
      if (ma11 === "") {
        ma1 = "nbsp";
      } else {
        ma1 = ma11;
      }
    }
    var ten1 = "";
    var ten11 = "";
    if (!TEN1) {
      ten1 = "nbsp";
    } else {
      ten11 = tvkd(TEN1);
      if (ten11 === "") {
        ten1 = "nbsp";
      } else {
        ten1 = ten11;
      }
    }
    var ma2 = "";
    var ma22 = "";
    if (!MA2) {
      ma2 = "nbsp";
    } else {
      ma22 = tvkd(MA2);
      if (ma22 === "") {
        ma2 = "nbsp";
      } else {
        ma2 = ma22;
      }
    }
    var ten2 = "";
    var ten22 = "";
    if (!TEN2) {
      ten2 = "nbsp";
    } else {
      ten22 = tvkd(TEN2);
      if (ten22 === "") {
        ten2 = "nbsp";
      } else {
        ten2 = ten22;
      }
    }
    var hanstart = "";
    var hanstart1 = "";
    if (!hanStart) {
      hanstart = "nbsp";
    } else {
      hanstart1 = hanStart + " 00:00:00";
      if (hanstart1 === "") {
        hanstart = "nbsp";
      } else {
        hanstart = hanstart1;
      }
    }
    var hanend = "";
    var hanend1 = "";
    if (!hanEnd) {
      hanend = "nbsp";
    } else {
      hanend1 = hanEnd + " 23:59:59";
      if (hanend1 === "") {
        hanend = "nbsp";
      } else {
        hanend = hanend1;
      }
    }
    var muonstart = "";
    var muonstart1 = "";
    if (!muonStart) {
      muonstart = "nbsp";
    } else {
      muonstart1 = muonStart + " 00:00:00";
      if (muonstart1 === "") {
        muonstart = "nbsp";
      } else {
        muonstart = muonstart1;
      }
    }
    var muonend = "";
    var muonend1 = "";
    if (!muonEnd) {
      muonend = "nbsp";
    } else {
      muonend1 = muonEnd + " 23:59:59";
      if (muonend1 === "") {
        muonend = "nbsp";
      } else {
        muonend = muonend1;
      }
    }
    var trastart = "";
    var trastart1 = "";
    if (!traStart) {
      trastart = "nbsp";
    } else {
      trastart1 = traStart + " 00:00:00";
      if (trastart1 === "") {
        trastart = "nbsp";
      } else {
        trastart = trastart1;
      }
    }
    var traend = "";
    var traend1 = "";
    if (!traEnd) {
      traend = "nbsp";
    } else {
      traend1 = traEnd + " 23:59:59";
      if (traend1 === "") {
        traend = "nbsp";
      } else {
        traend = traend1;
      }
    }
    console.log("Start", hanstart);
    console.log("End", hanend);
    console.log("trang thai", trangthai);
    const { data } = await axios.get(
      `/searchdiary/masach=${masach}&&tensach=${tensach}&&trangthai=${trangthai}&&hanstart=${hanstart}&&hanend=${hanend}&&ma0=${ma0}&&ten0=${ten0}&&ma1=${ma1}&&ten1=${ten1}&&ma2=${ma2}&&ten2=${ten2}&&muonstart=${muonstart}&&muonend=${muonend}&&trastart=${trastart}&&traend=${traend}`
    );
    var list = [];
    var listEdit = [];
    console.log("nhan api", data);
    for (let i = 0; i < data.length; i++) {
      list.push({ id: data[i].id, ghichu: data[i].ghichu });
      listEdit.push({ value: false });
    }
    console.log("edit", listEdit);
    setEdit(listEdit);
    setTest(listEdit);
    setNote(list);
    // setLoading(false);
    setDiary(data);
    setDiary1(data);
    totalPagesCalculate(data.length);
  };

  //=== export excel
  const headers = [
    { label: "STT", key: "stt" },
    { label: "Mã sách", key: "masach" },
    { label: "Tên sách", key: "tensach" },
    { label: "Mã người mượn", key: "manguoimuon" },
    { label: "Tên người mượn", key: "tennguoimuon" },
    { label: "Mã người cho mượn", key: "manguoichomuon" },
    { label: "Tên người cho mượn", key: "tennguoichomuon" },
    { label: "Mã người cho trả", key: "manguoichotra" },
    { label: "Tên người cho tra", key: "tennguoichotra" },

    { label: "Ngày mượn", key: "ngaymuon" },
    { label: "Ngày trả", key: "ngaytra" },
    { label: "Phải trả trước", key: "phaitratruoc" },
    { label: "Trạng thái", key: "trangthai" },
    { label: "Ghi chú", key: "ghichu" },
  ];
  const excel = diary.map((diary, index) => ({
    stt: index + 1,
    masach: diary.sachid,
    tensach: diary.tensach,
    manguoimuon: diary.username,
    tennguoimuon: diary.hoten,
    manguoichomuon: diary.username1,
    tennguoichomuon: diary.hoten1,
    manguoichotra: diary.username2,
    tennguoichotra: diary.hoten2,
    ngaymuon: diary.ngaymuon,
    ngaytra:
      diary.ngaytra === "1/1/1999, 12:00:00 AM" ? "Chưa trả" : diary.ngaytra,
    phaitratruoc: diary.trangthai,
    trangthai: diary.trangthai,
    ghichu: diary.ghichu,
  }));

  //=== export pdf
  const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
      <div ref={ref}>
        <style type="text/css" media="print">
          {"\
            @page { size: landscape; }\
          "}
        </style>
        <table
          className="table table-bordered my-3"
          id="dataTable"
          // width="100%"
          cellSpacing={0}
        >
          <tbody className={`${styles.tbody}`}>
            <tr className="thead-light">
              <th className="align-middle text-center">STT</th>
              <th className="align-middle text-center">Mã sách</th>
              <th className="align-middle text-center">Tên sách được mượn</th>
              <th className="align-middle text-center">Mã người dùng</th>
              <th className="align-middle text-center">Tên người mượn</th>
              <th className="align-middle text-center">Mã người cho mượn</th>
              <th className="align-middle text-center">Tên người cho mượn</th>
              <th className="align-middle text-center">Mã người cho trả</th>
              <th className="align-middle text-center">Tên người cho trả</th>
              <th className="align-middle text-center">Ngày mượn</th>
              <th className="align-middle text-center">Ngày trả</th>
              <th className="align-middle text-center">Phải trả trước</th>
              <th className="align-middle text-center">Trạng thái</th>
              <th className="align-middle text-center">Ghi chú</th>
            </tr>
            {!diary.length ? (
              <tr>
                <td colSpan="11" className="align-middle text-center">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              diary.map((item, index) => (
                <tr>
                  <td className="align-middle text-center">
                    {index + 1}
                  </td>
                  <td className="align-middle text-center">{item.sachid}</td>
                  <td className="align-middle text-center">{item.tensach}</td>
                  <td className="align-middle text-center text-uppercase">
                    {item.username}
                  </td>
                  <td className="align-middle text-center">{item.hoten}</td>
                  <td className="align-middle text-center text-uppercase">
                    {item.username1}
                  </td>
                  <td className="align-middle text-center">{item.hoten1}</td>
                  <td className="align-middle text-center text-uppercase">
                    {item.username2}
                  </td>
                  <td className="align-middle text-center">{item.hoten2}</td>
                  <td className="align-middle text-center">{item.ngaymuon}</td>
                  <>
                    {(() => {
                      if (item.ngaytra === "1/1/1999, 12:00:00 AM") {
                        return (
                          <td className="align-middle text-center">Chưa trả</td>
                        );
                      } else {
                        return (
                          <td className="align-middle text-center">
                            {item.ngaytra}
                          </td>
                        );
                      }
                    })()}
                  </>
                  <td className="align-middle text-center">{item.thoigian}</td>
                  {(() => {
                    // Ngay tra
                    const date1 = item.ngaytra;
                    const date11 = date1.toLocaleString("en-US");
                    const date111 = new Date(date11);
                    // Chua tra
                    const date2 = new Date("1/1/1999, 12:00:00 AM");
                    const date22 = date2.toLocaleString("en-US");
                    const date222 = new Date(date22);
                    // Phai tra truoc
                    const date3 = item.thoigian;
                    const date33 = date3.toLocaleString("en-US");
                    // const date34 = date3.toLocaleString("en-GB");
                    const date333 = new Date(date33);
                    // Ngay hien tai
                    const date4 = new Date();
                    const date44 = date4.toLocaleString("en-US");
                    const date444 = new Date(date44);
                    if (date111.getTime() === date222.getTime()) {
                      if (date444.getTime() < date333.getTime()) {
                        return (
                          <td className="align-middle text-center">Còn hạn</td>
                        );
                      } else if (date444.getTime() > date333.getTime()) {
                        return (
                          <td className="align-middle text-center">Hết hạn</td>
                        );
                      }
                    } else if (date111.getTime() !== date222.getTime()) {
                      if (date111.getTime() <= date333.getTime()) {
                        return (
                          <td className="align-middle text-center">Đúng hạn</td>
                        );
                      } else if (date111.getTime() > date333.getTime()) {
                        return (
                          <td className="align-middle text-center">Trễ hạn</td>
                        );
                      }
                    }
                  })()}
                  <td className="align-middle text-center">{item.ghichu}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  });
  const componentRef = useRef();

  return (
    <div className={`${styles.content}`}>
      <div className="container-fluid">
        <form>

          <div className="row">
            <div className="form-group col">
              <label
                htmlFor="masach"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập mã sách
              </label>
              <input
                type="text"
                id="masach"
                name="masach"
                className="form-control"
                placeholder="Nhập mã sách cần tìm kiếm"
                onChange={(e) => setMaSach(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="tensach"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tên sách
              </label>
              <input
                type="text"
                id="tensach"
                name="tensach"
                className="form-control"
                placeholder="Nhập tên sách cần tìm kiếm"
                onChange={(e) => setTenSach(e.target.value)}
              />
            </div>

            <div className="form-group col">
              <label
                htmlFor="ma"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập mã người mượn
              </label>
              <input
                type="text"
                id="ma"
                name="ma"
                className="form-control"
                placeholder="Nhập mã người dùng cần tìm kiếm"
                onChange={(e) => setMa0(e.target.value)}
              />
            </div>

            <div className="form-group col">
              <label
                htmlFor="tennguoidung"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tên người mượn
              </label>
              <input
                type="text"
                id="tennguoidung"
                name="tennguoidung"
                className="form-control"
                placeholder="Nhập tên người dùng cần tìm kiếm"
                onChange={(e) => setTen0(e.target.value)}
              />
            </div>

          </div>

          <div className="row">
            <div className="form-group col">
              <label
                htmlFor="ma1"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập mã người cho mượn
              </label>
              <input
                type="text"
                id="ma1"
                name="ma1"
                className="form-control"
                placeholder="Nhập mã người cho mượn cần tìm kiếm"
                onChange={(e) => setMa1(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="ten1"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tên người cho mượn
              </label>
              <input
                type="text"
                id="ten1"
                name="ten1"
                className="form-control"
                placeholder="Nhập tên người cho mượn cần tìm kiếm"
                onChange={(e) => setTen1(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="ma2"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập mã người cho trả
              </label>
              <input
                type="text"
                id="ma2"
                name="ma2"
                className="form-control"
                placeholder="Nhập mã người cho trả cần tìm kiếm"
                onChange={(e) => setMa2(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="ten2"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Nhập tên người cho trả
              </label>
              <input
                type="text"
                id="ten2"
                name="ten2"
                className="form-control"
                placeholder="Nhập tên người cho trả cần tìm kiếm"
                onChange={(e) => setTen2(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="form-group col">
              <label
                htmlFor="hantra"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Chọn hạn trả bắt đầu
              </label>
              <input
                type="date"
                id="hanstart"
                name="hanstart"
                className="form-control"
                onChange={(e) => setHanStart(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="hanend"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Chọn hạn trả kết thúc
              </label>
              <input
                type="date"
                id="hanend"
                name="hanend"
                className="form-control"
                onChange={(e) => setHanEnd(e.target.value)}
              />
            </div>

            <div className="form-group col">
              <label
                htmlFor="trangthai"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Chọn trạng thái
              </label>
              <div>
                <select
                  id="trangthai"
                  name="trangthai"
                  className="form-control"
                  onChange={(e) => setTrangThai(e.target.value)}
                >
                  <option value="">Tất cả</option>
                  <option value="đúng hạn">Đúng hạn</option>
                  <option value="còn hạn">Còn hạn</option>
                  <option value="hết hạn">Hết hạn</option>
                  <option value="trễ hạn">Trễ hạn</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="form-group col">
              <label
                htmlFor="muonstart"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Ngày mượn bắt đầu
              </label>
              <input
                type="date"
                id="muonstart"
                name="muonstart"
                className="form-control"
                // placeholder="Năm xuất bản: Từ năm"
                onChange={(e) => setMuonStart(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="muonend"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Ngày mượn kết thúc
              </label>
              <input
                type="date"
                id="muonend"
                name="muonend"
                className="form-control"
                onChange={(e) => setMuonEnd(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="trastart"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Ngày trả bắt đầu
              </label>
              <input
                type="date"
                id="trastart"
                name="trastart"
                className="form-control"
                onChange={(e) => setTraStart(e.target.value)}
              />
            </div>
            <div className="form-group col">
              <label
                htmlFor="traend"
                className="col-form-label"
                style={{ fontWeight: "bold" }}
              >
                Ngày trả kết thúc
              </label>
              <input
                type="date"
                id="traend"
                name="traend"
                className="form-control"
                // placeholder="Năm xuất bản: đến năm"
                onChange={(e) => setTraEnd(e.target.value)}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-12" style={{ textAlign: "right" }}>
              <button
                style={{ maxHeight: "38px", marginLeft: "10px" }}
                type="reset"
                className="btn btn-primary"
                onClick={reset}
              >
                Làm lại
              </button>
              <button
                style={{ maxHeight: "38px", marginLeft: "10px" }}
                type="button"
                className="btn btn-primary"
                onClick={handleClickSearch}
              >
                Lọc
              </button>
            </div>
          </div>

        </form>

        <div>
          <button
            className="btn buttons-excel buttons-html5 btn-success mr-4"
            tabIndex={0}
            aria-controls="dataTable"
            type="button"
          >
            <span>
              <div>
                <CSVLink
                  className="text-decoration-none text-white"
                  headers={headers}
                  data={excel}
                >
                  <i className="far fa-file-excel" /> Excel
                </CSVLink>
              </div>
            </span>
          </button>
          <ReactToPrint
            trigger={() => (
              <button
                className={` btn buttons-excel buttons-html5 btn-danger mr-4`}
                tabIndex={0}
                aria-controls="dataTable"
                type="button"
              >
                <span>
                  <div>
                    <i className="fas fa-file-pdf" /> PDF
                  </div>
                </span>
              </button>
            )}
            content={() => componentRef.current}
          />

          {loading ? (
            <div> Loading... </div>
          ) : (
            <table
              className="table table-responsive table-bordered my-3 text-nowrap"
              id="dataTable"
              width="100%"
              cellSpacing={0}
            >
              <tbody className={`${styles.tbody}`}>
                <tr className="thead-light">
                  <th className="align-middle text-center">STT</th>
                  <th className="align-middle text-center">Mã sách</th>
                  <th className="align-middle text-center">
                    Tên sách được mượn
                  </th>
                  <th className="align-middle text-center">Mã người mượn</th>
                  <th className="align-middle text-center">Tên người mượn</th>
                  <th className="align-middle text-center">
                    Mã người cho mượn
                  </th>
                  <th className="align-middle text-center">
                    Tên người cho mượn
                  </th>
                  <th className="align-middle text-center">Mã người cho trả</th>
                  <th className="align-middle text-center">
                    Tên người cho trả
                  </th>
                  <th className="align-middle text-center">Ngày mượn</th>
                  <th
                    className="align-middle text-center"
                    style={{ minWidth: "185.46px" }}
                  >
                    <select
                      id="ngaytra"
                      name="ngaytra"
                      className="form-control"
                      onClick={search1}
                      onChange={(e) => setFilter1(e.target.value)}
                    >
                      <option value="">Ngày trả</option>
                      <option value="chưa trả">Chưa trả</option>
                    </select>
                  </th>
                  <th className="align-middle text-center">Phải trả trước</th>
                  <th className="align-middle text-center">Trạng thái</th>
                  <th
                    className="align-middle text-center"
                    style={{ minWidth: "500px" }}
                  >
                    Ghi chú
                  </th>
                  <th className="align-middle text-center">Sửa ghi chú</th>
                </tr>

                {!diary.length ? (
                  <tr>
                    <td colSpan="11" className="align-middle text-center">
                      Không có dữ liệu
                    </td>
                  </tr>
                ) : (
                  filterDiary(diary).map((item, index) => (
                    <tr>
                      <td className="align-middle text-center">
                        {item.index + 1}
                      </td>
                      <td className="align-middle text-center">
                        {item.sachid}
                      </td>
                      <td className="align-middle text-center">
                        {item.tensach}
                      </td>
                      <td className="align-middle text-center text-uppercase">
                        {item.username}
                      </td>
                      <td className="align-middle text-center">{item.hoten}</td>
                      <td className="align-middle text-center text-uppercase">
                        {item.username1}
                      </td>
                      <td className="align-middle text-center">
                        {item.hoten1}
                      </td>
                      <td className="align-middle text-center text-uppercase">
                        {item.username2}
                      </td>
                      <td className="align-middle text-center">
                        {item.hoten2}
                      </td>
                      <td className="align-middle text-center">
                        {item.ngaymuon}
                      </td>

                      <>
                        {(() => {
                          if (item.ngaytra === "1/1/1999, 12:00:00 AM") {
                            return (
                              <td className="align-middle text-center">
                                Chưa trả
                              </td>
                            );
                          } else {
                            return (
                              <td className="align-middle text-center">
                                {item.ngaytra}
                              </td>
                            );
                          }
                        })()}
                      </>

                      <td className="align-middle text-center">
                        {item.thoigian}
                      </td>

                      {(() => {
                        // Ngay tra
                        const date1 = item.ngaytra;
                        const date11 = date1.toLocaleString("en-US");
                        const date111 = new Date(date11);
                        // Chua tra
                        const date2 = new Date("1/1/1999, 12:00:00 AM");
                        const date22 = date2.toLocaleString("en-US");
                        const date222 = new Date(date22);
                        // Phai tra truoc
                        const date3 = item.thoigian;
                        const date33 = date3.toLocaleString("en-US");
                        // const date34 = date3.toLocaleString("en-GB");
                        const date333 = new Date(date33);
                        // Ngay hien tai
                        const date4 = new Date();
                        const date44 = date4.toLocaleString("en-US");
                        const date444 = new Date(date44);

                        // console.log("thoigian: ", date444);

                        if (date111.getTime() === date222.getTime()) {
                          if (date444.getTime() < date333.getTime()) {
                            return (
                              <td className="align-middle text-center">
                                Còn hạn
                              </td>
                            );
                          } else if (date444.getTime() > date333.getTime()) {
                            return (
                              <td className="align-middle text-center">
                                Hết hạn
                              </td>
                            );
                          }
                        } else if (date111.getTime() !== date222.getTime()) {
                          if (date111.getTime() <= date333.getTime()) {
                            return (
                              <td className="align-middle text-center">
                                Đúng hạn
                              </td>
                            );
                          } else if (date111.getTime() > date333.getTime()) {
                            return (
                              <td className="align-middle text-center">
                                Trễ hạn
                              </td>
                            );
                          }
                        }
                      })()}

                      {item.isedit === true ? (
                        <>
                          <td
                            className="align-middle text-center"
                            style={{ minWidth: "500px" }}
                          >
                            <input
                              type="text"
                              name="note"
                              className="form-control"
                              defaultValue={item.ghichu}
                              onChange={(e) => editNote(e, index)}
                              required
                            />
                          </td>
                          <td className="align-middle text-center">
                            <div
                              className="text-success"
                              onClick={(e) => handleClickCheck(e, index)}
                            >
                              <FontAwesomeIcon icon={["fas", "check"]} />
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className="align-middle text-center"
                            style={{ minWidth: "500px" }}
                          >
                            {item.ghichu}
                          </td>
                          <td className="align-middle text-center">
                            <div
                              className="text-success"
                              onClick={(e) => handleClickEdit(e, index)}
                            >
                              <FontAwesomeIcon icon={["fas", "edit"]} />
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
          <br />
          <div className="row">
            <div
              className="col-12"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <Link
                      to={`/diary/page/${prevPage(page)}`}
                      className="page-link"
                    >
                      Prev
                    </Link>
                  </li>
                  {totalPages.map((item) => (
                    <li
                      className={`${item === Number(page) ? "active" : ""
                        } page-item`}
                    >
                      <Link to={`/diary/page/${item}`} className="page-link">
                        {item}
                      </Link>
                    </li>
                  ))}
                  <li className="page-item">
                    <Link
                      to={`/diary/page/${nextPage(page)}`}
                      className="page-link"
                    >
                      Next
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div style={{ display: "none" }}>
          <ComponentToPrint ref={componentRef} />
        </div>
      </div>
    </div>
  );
}

export default Diary;
