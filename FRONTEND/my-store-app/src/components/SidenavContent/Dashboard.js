import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./css/dashboard.module.css";
import { CSVLink, CSVDownload } from "react-csv";
import ReactToPrint from "react-to-print";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import faker from "faker";
import moment, { months } from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      // text: 'Chart.js Bar Chart',
    },
  },
};

function Dashboard() {
  const dangNhap = useSelector((state) => state.dangNhap);
  const { userInfo } = dangNhap;
  const history = useHistory();
  const [sourceImages, setSourceImages] = useState([]);
  const fetchSourceImage = async () => {
    const { data } = await axios.get(`/getimage`);
    setSourceImages(data);
  };
  const [images, setImages] = useState([]);
  const fetchImage = async () => {
    const { data } = await axios.get(`/getshowimage`);
    setImages(data);
  };
  const [getReport, setGetReport] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date()).subtract(1, "month").format("YYYY-MM-DD")
  );
  const [selectedDate2, setSelectedDate2] = useState(
    moment(new Date()).format("YYYY-MM-DD")
  );
  const search = async (e) => {
    e.preventDefault();
    const numberPattern = /\d+/g;
    console.log("faker", faker.datatype.number({ min: 0, max: 1000 }));
    await fetchReport();
  };

  const fetchReport = async () => {
    const type = "week";
    moment.updateLocale("en", {
      week: {
        dow: 1, // Monday is the first day of the week.
      },
    });
    if (!selectedDate || !selectedDate2) return;
    console.log(selectedDate2);
    let dateStart = moment(selectedDate).format("YYYY-MM-DD 00:00:00");
    let dateEnd = moment(selectedDate2).format("YYYY-MM-DD 23:59:59");
    const { data } = await axios.get(
      `/get-report?fromdate=${dateStart}&todate=${dateEnd}&type=${type}`
    );
    console.log(data);
    const res = data?.ngaymuon?.map((item, i) =>
      Object.assign({}, item, data?.ngaytra[i])
    );
    console.log(res);
    setGetReport(res);
  };
  const labels = getReport
    ?.sort((first, second) => Number(first.by_week) - Number(second.by_week))
    ?.map((item) => "Tuần " + item?.by_week);
  const report = {
    labels,
    datasets: [
      {
        label: "Số sách đã mượn",
        data: getReport?.map((item) => item.ngaymuon),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Số sách đã trả",
        data: getReport?.map((item) => item.ngaytra),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  useEffect(() => {
    const callFectch = async () => {
      await fetchReport();
    }

    callFectch();

  }, [])

  useEffect(async () => {
    const { data } = await axios.get(`/getpermit/${userInfo.username}`);
    if (data[9].check == true) {
      fetchBook();
      fetchUser();
      fetchNews();
      fetchImage();
      fetchSourceImage();
      fetchDiary();
      fetchCountBook();
    } else {
      history.push("/error");
    }
  }, [userInfo]);

  //========== THONG KE SACH
  const [book, setBook] = useState([]);
  const fetchBook = async () => {
    setLoading01(true);
    const { data } = await axios.get(`/getbook`);
    setLoading01(false);
    setBook(data);
    totalPagesCalculate(data.length);
  };
  //=== Bo loc
  const [loading01, setLoading01] = useState(false);
  const [tieuDe, setTieuDe] = useState();
  const [tacGia, setTacGia] = useState();
  const [ngonNgu, setNgonNgu] = useState();
  const [namXbStart, setNamXbStart] = useState(1111);
  const [namXbEnd, setNamXbEnd] = useState(new Date().getFullYear());
  const [nhaXB, setNhaXB] = useState();
  const [maHP, setMaHP] = useState();
  const [chuDe, setChuDe] = useState();
  const [loaiSach, setLoaiSach] = useState();
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
  var ktln = (str) => {
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    return str;
  };
  const reset = async (e) => {
    setTieuDe("");
    setTacGia("");
    setNgonNgu("");
    setNamXbStart("");
    setNamXbEnd("");
    setNhaXB("");
    setMaHP("");
    setChuDe("");
    setLoaiSach("");
  };
  const search01 = async (e) => {
    e.preventDefault();
    fetchBook3();
  };
  const searchkhongdau = async (e) => {
    e.preventDefault();
    fetchBook1();
  };
  const fetchBook1 = async () => {
    var tieude = "";
    var tieude1 = "";
    if (!tieuDe) {
      tieude = "nbsp";
    } else {
      tieude1 = tvkd(tieuDe);
      if (tieude1 === "") {
        tieude = "nbsp";
      } else {
        tieude = tieude1;
      }
    }
    var tacgia = "";
    var tacgia1 = "";
    if (!tacGia) {
      tacgia = "nbsp";
    } else {
      tacgia1 = tvkd(tacGia);
      if (tacgia1 === "") {
        tacgia = "nbsp";
      } else {
        tacgia = tacgia1;
      }
    }
    var ngonngu = "";
    var ngonngu1 = "";
    if (!ngonNgu) {
      ngonngu = "nbsp";
    } else {
      ngonngu1 = tvkd(ngonNgu);
      if (ngonngu1 === "") {
        ngonngu = "nbsp";
      } else {
        ngonngu = ngonngu1;
      }
    }
    var namxbstart = 1111;
    var namxbstart1 = 1111;
    if (!namXbStart) {
      namxbstart = 1111;
    } else {
      namxbstart1 = namXbStart
      if (namxbstart1 === '') {
        namxbstart = 1112;
      } else {
        namxbstart = namxbstart1;
      }
    }
    var namxbend = new Date().getFullYear();;
    var namxbend1 = new Date().getFullYear();;
    if (!namXbEnd) {
      namxbend = new Date().getFullYear();;
    } else {
      namxbend1 = namXbEnd
      if (namxbend1 === "") {
        namxbend = new Date().getFullYear();;
      } else {
        namxbend = namxbend1;
      }
    }
    var nhaxb = "";
    var nhaxb1 = "";
    if (!nhaXB) {
      nhaxb = "nbsp";
    } else {
      nhaxb1 = tvkd(nhaXB);
      if (nhaxb1 === "") {
        nhaxb = "nbsp";
      } else {
        nhaxb = nhaxb1;
      }
    }
    var mahp = "";
    var mahp1 = "";
    if (!maHP) {
      mahp = "nbsp";
    } else {
      mahp1 = tvkd(maHP);
      if (mahp1 === "") {
        mahp = "nbsp";
      } else {
        mahp = mahp1;
      }
    }
    var chude = "";
    var chude1 = "";
    if (!chuDe) {
      chude = "nbsp";
    } else {
      chude1 = tvkd(chuDe);
      if (chude1 === "") {
        chude = "nbsp";
      } else {
        chude = chude1;
      }
    }
    var loaisach = "";
    var loaisach1 = "";
    if (!loaiSach) {
      loaisach = "nbsp";
    } else {
      loaisach1 = tvkd(loaiSach);
      if (loaisach1 === "") {
        loaisach = "nbsp";
      } else {
        loaisach = loaisach1;
      }
    }
    if (namxbstart > new Date().getFullYear()) {
      alert("Năm bắt đầu phải nhỏ hơn năm hiện tại");
      return;
    } else if (namxbend > new Date().getFullYear()) {
      alert("Năm kết thúc phải nhỏ hơn năm hiện tại");
      return;
    } else if (namxbstart > namxbend) {
      alert("Năm bắt đầu phải nhỏ hơn năm kết thúc");
      return;
    }
    setLoading01(true);
    const { data } = await axios.get(
      `/searchkd/tieude=${tieude}&&tacgia=${tacgia}&&ngonngu=${ngonngu}&&namxbstart=${namxbstart}&&namxbend=${namxbend}&&nhaxb=${nhaxb}&&mahp=${mahp}&&chude=${chude}&&loaisach=${loaisach}`
    );
    setBook(data);
    totalPagesCalculate(data.length);
    setLoading01(false);
  };
  const fetchBook3 = async () => {
    var tieude = "";
    var tieude1 = "";
    if (!tieuDe) {
      tieude = "nbsp";
    } else {
      tieude1 = ktln(tieuDe);
      if (tieude1 === "") {
        tieude = "nbsp";
      } else {
        tieude = tieude1;
      }
    }
    var tacgia = "";
    var tacgia1 = "";
    if (!tacGia) {
      tacgia = "nbsp";
    } else {
      tacgia1 = ktln(tacGia);
      if (tacgia1 === "") {
        tacgia = "nbsp";
      } else {
        tacgia = tacgia1;
      }
    }
    var ngonngu = "";
    var ngonngu1 = "";
    if (!ngonNgu) {
      ngonngu = "nbsp";
    } else {
      ngonngu1 = ktln(ngonNgu);
      if (ngonngu1 === "") {
        ngonngu = "nbsp";
      } else {
        ngonngu = ngonngu1;
      }
    }
    var namxbstart = 1111;
    var namxbstart1 = 1111;
    if (!namXbStart) {
      namxbstart = 1111;
    } else {
      namxbstart1 = namXbStart
      if (namxbstart1 === '') {
        namxbstart = 1112;
      } else {
        namxbstart = namxbstart1;
      }
    }
    var namxbend = new Date().getFullYear();;
    var namxbend1 = new Date().getFullYear();;
    if (!namXbEnd) {
      namxbend = new Date().getFullYear();;
    } else {
      namxbend1 = namXbEnd
      if (namxbend1 === "") {
        namxbend = new Date().getFullYear();;
      } else {
        namxbend = namxbend1;
      }
    }
    var nhaxb = "";
    var nhaxb1 = "";
    if (!nhaXB) {
      nhaxb = "nbsp";
    } else {
      nhaxb1 = ktln(nhaXB);
      if (nhaxb1 === "") {
        nhaxb = "nbsp";
      } else {
        nhaxb = nhaxb1;
      }
    }
    var mahp = "";
    var mahp1 = "";
    if (!maHP) {
      mahp = "nbsp";
    } else {
      mahp1 = ktln(maHP);
      if (mahp1 === "") {
        mahp = "nbsp";
      } else {
        mahp = mahp1;
      }
    }
    var chude = "";
    var chude1 = "";
    if (!chuDe) {
      chude = "nbsp";
    } else {
      chude1 = ktln(chuDe);
      if (chude1 === "") {
        chude = "nbsp";
      } else {
        chude = chude1;
      }
    }
    var loaisach = "";
    var loaisach1 = "";
    if (!loaiSach) {
      loaisach = "nbsp";
    } else {
      loaisach1 = ktln(loaiSach);
      if (loaisach1 === "") {
        loaisach = "nbsp";
      } else {
        loaisach = loaisach1;
      }
    }
    if (namxbstart > new Date().getFullYear()) {
      alert("Năm bắt đầu phải nhỏ hơn năm hiện tại");
      return;
    } else if (namxbend > new Date().getFullYear()) {
      alert("Năm kết thúc phải nhỏ hơn năm hiện tại");
      return;
    } else if (namxbstart > namxbend) {
      alert("Năm bắt đầu phải nhỏ hơn năm kết thúc");
      return;
    }
    setLoading01(true);
    const { data } = await axios.get(
      `/searchpro/tieude=${tieude}&&tacgia=${tacgia}&&ngonngu=${ngonngu}&&namxbstart=${namxbstart}&&namxbend=${namxbend}&&nhaxb=${nhaxb}&&mahp=${mahp}&&chude=${chude}&&loaisach=${loaisach}`
    );
    setLoading01(false);
    setBook(data);
    totalPagesCalculate(data.length);
  };
  //=== export excel
  const headers = [
    { label: "Mã sách", key: "masach" },
    { label: "Tên sách", key: "tensach" },
    { label: "Tác giả", key: "tacgia" },
    { label: "Nhà xuất bản", key: "nhaxuatban" },
    { label: "Mã học phần", key: "mahocphan" },
    { label: "Vị trí", key: "vitri" },
    { label: "Số lượng", key: "soluong" },
    { label: "Năm xuất bản", key: "namxuatban" },
    { label: "Hình thức mượn", key: "hinhthucmuon" },
    { label: "Ngôn ngữ", key: "ngonngu" },
    { label: "Loại sách", key: "loaisach" },
    { label: "Chủ đề", key: "chude" },
  ];
  const excel = book.map((book) => ({
    masach: book.sachid,
    tensach: book.tensach,
    tacgia: book.tacgia,
    nhaxuatban: book.nhaxb,
    mahocphan: book.mahp,
    vitri: book.vitri,
    soluong: book.soluong,
    namxuatban: book.namxb,
    hinhthucmuon: book.hinhthuc,
    ngonngu: book.ngonngu,
    loaisach: book.tenloai,
    chude: book.chude,
  }));
  //=== export pdf
  const ComponentToPrint = React.forwardRef((props, ref) => {
    return (
      <div ref={ref}>
        <table
          className="table table-bordered my-3 text-nowrap"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <tbody className={`${styles.tbody}`}>
            <tr className="thead-light">
              <th className="align-middle text-center">Mã sách</th>
              <th className="align-middle text-center">Tên sách</th>
              <th className="align-middle text-center">Tác giả</th>
              <th className="align-middle text-center">Nhà xuất bản</th>
              <th className="align-middle text-center">Mã học phần</th>
              <th className="align-middle text-center">Vị trí</th>
              <th className="align-middle text-center">Số lượng</th>
              <th className="align-middle text-center">Năm xuất bản</th>
              <th className="align-middle text-center">Hình thức mượn</th>
              <th className="align-middle text-center">Ngôn ngữ</th>
              <th className="align-middle text-center">Loại sách</th>
              <th className="align-middle text-center">Chủ đề</th>
            </tr>
            {book.map((book, index) => (
              <tr>
                <td className="align-middle text-center">{book.sachid}</td>
                <td className="align-middle text-center">{book.tensach}</td>
                <td className="align-middle text-center">{book.tacgia}</td>
                <td className="align-middle text-center">{book.nhaxb}</td>
                <td className="align-middle text-center text-uppercase">
                  {book.mahp}
                </td>
                <td className="align-middle text-center">{book.vitri}</td>
                <td className="align-middle text-center">{book.soluong}</td>
                <td className="align-middle text-center">{book.namxb}</td>
                <td className="align-middle text-center">{book.hinhthuc}</td>
                <td className="align-middle text-center">{book.ngonngu}</td>
                <td className="align-middle text-center">{book.tenloai}</td>
                <td className="align-middle text-center">{book.tenchude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
  const componentRef = useRef();
  //=== Pagination
  const [totalPages, setTotalPages] = useState([]);
  const totalPagesCalculate = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 5); i++) {
      totalP.push(i);
    }
    setTotalPages(totalP);
  };
  const { page = 1 } = useParams();
  const [bookPage, setBookPage] = useState(1);
  const filterBook = (bookList) => {
    bookList = bookList.map((item, index) => {
      return { ...item, index: index };
    });
    const firstParam = (bookPage || 1) * 5 - 5;
    const secondParam = (bookPage || 1) * 5;
    return bookList.slice(firstParam, secondParam);
  }
  const prevBookPage = () => {
    if (bookPage <= 1) return;
    setBookPage(() => bookPage - 1);
  };
  const nextBookPage = () => {
    if (bookPage >= totalPages[totalPages.length - 1]) return;
    setBookPage(() => bookPage + 1);
  };
  const toBookPage = (num) => {
    setBookPage(num);
  }

  //========== THONG KE NHAT KY
  const [loading02, setLoading02] = useState(false);
  const [diary, setDiary] = useState([]);
  const [diary01, setDiary01] = useState([]);
  const fetchDiary = async () => {
    setLoading02(true);
    const { data } = await axios.get(`/getdiary`);
    setDiary(data);
    setDiary01(data);
    totalPagesCalculate02(data.length);
    setLoading02(false);
  };
  //=== Bộ lọc
  const [filter1, setFilter1] = useState();
  const search002 = async () => {
    if (filter1 === "chưa trả") {
      setDiary(
        diary01.filter((item) => item.ngaytra.includes("1/1/1999, 12:00:00 AM"))
      );
      totalPagesCalculate02(
        diary01.filter((item) => item.ngaytra.includes("1/1/1999, 12:00:00 AM"))
          .length
      );
    } else {
      setDiary(diary01.filter((item) => item.ngaytra.includes("")));
      totalPagesCalculate02(
        diary01.filter((item) => item.ngaytra.includes("")).length
      );
    }
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
  const reset02 = async (e) => {
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
  const search02 = async (e) => {
    e.preventDefault();
    fetchDiary1();
  };
  const fetchDiary1 = async () => {
    setLoading02(true);
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
    const { data } = await axios.get(
      `/searchdiary/masach=${masach}&&tensach=${tensach}&&trangthai=${trangthai}&&hanstart=${hanstart}&&hanend=${hanend}&&ma0=${ma0}&&ten0=${ten0}&&ma1=${ma1}&&ten1=${ten1}&&ma2=${ma2}&&ten2=${ten2}&&muonstart=${muonstart}&&muonend=${muonend}&&trastart=${trastart}&&traend=${traend}`
    );
    setDiary(data);
    setDiary01(data);
    totalPagesCalculate02(data.length);
    setLoading02(false);
  };
  //=== export excel
  const headers02 = [
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
  const excel02 = diary.map((diary, index) => ({
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
  const ComponentToPrint02 = React.forwardRef((props, ref) => {
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
  const componentRef02 = useRef();
  //=== Pagination
  const [page02, setPage02] = useState(1);
  const [totalPages02, setTotalPages02] = useState([]);
  const totalPagesCalculate02 = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 5); i++) {
      totalP.push(i);
    }
    setTotalPages02(totalP);
  };
  const filterDiary = (diaryList) => {
    diaryList = diaryList.map((item, index) => {
      return { ...item, index: index };
    });
    const firstParam = (page02 || 1) * 5 - 5;
    const secondParam = (page02 || 1) * 5;
    return diaryList.slice(firstParam, secondParam);
  };
  const prevPage02 = (num) => {
    if (page02 <= 1) return;
    setPage02(() => page02 - 1);
  };
  const nextPage02 = (num) => {
    if (page02 >= totalPages02[totalPages02.length - 1]) return;
    setPage02(() => page02 + 1);
  };
  const toPage02 = (num) => {
    setPage02(num);
  }

  //========== THONG KE NGUOI DUNG
  const [loading03, setLoading03] = useState(false);
  const [user, setUser] = useState([]);
  const [totalPages03, setTotalPages03] = useState([]);
  const totalPagesCalculate03 = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 5); i++) {
      totalP.push(i);
    }
    setTotalPages03(totalP);
  };
  const fetchUser = async () => {
    setLoading03(true);
    const { data } = await axios.get(`/getuser`);
    setUser(data);
    totalPagesCalculate03(data.length);
    setLoading03(false);
  };

  //=== bo loc
  const [MA00, setMa00] = useState();
  const [TEN00, setTen00] = useState();
  const search03 = async (e) => {
    e.preventDefault();
    fetchUser1();
  };
  const fetchUser1 = async () => {
    var ma0 = "";
    var ma00 = "";
    if (!MA00) {
      ma0 = "nbsp";
    } else {
      ma00 = tvkd(MA00);
      if (ma00 === "") {
        ma0 = "nbsp";
      } else {
        ma0 = ma00;
      }
    }
    var ten0 = "";
    var ten00 = "";
    if (!TEN00) {
      ten0 = "nbsp";
    } else {
      ten00 = tvkd(TEN00);
      if (ten00 === "") {
        ten0 = "nbsp";
      } else {
        ten0 = ten00;
      }
    }
    setLoading03(true);
    const { data } = await axios.get(`/searchuser/ma0=${ma0}&&ten0=${ten0}`);
    setUser(data);
    totalPagesCalculate03(data.length);
    setLoading03(false);
  };

  //=== export excel
  const headers03 = [
    { label: "STT", key: "stt" },
    { label: "Mã người dùng", key: "manguoidung" },
    { label: "Tên người dùng", key: "tennguoidung" },
    { label: "Địa chỉ", key: "diachi" },
    { label: "Số điện thoại", key: "sdt" },
    { label: "Email", key: "email" },
  ];
  const excel03 = user.map((user, index) => ({
    stt: index + 1,
    manguoidung: user.usernames,
    tennguoidung: user.hoten,
    diachi: user.diachi,
    sdt: user.sdt,
    email: user.email,
  }));
  //=== export pdf
  const ComponentToPrint03 = React.forwardRef((props, ref) => {
    return (
      <div ref={ref}>
        <table
          className="table table-bordered my-3 text-nowrap"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <tbody className={`${styles.tbody}`}>
            <tr className="thead-light">
              <th className="align-middle text-center">STT</th>
              <th className="align-middle text-center">Mã người dùng</th>
              <th className="align-middle text-center">Họ và tên</th>
              <th className="align-middle text-center">Địa chỉ</th>
              <th className="align-middle text-center">Số điện thoại</th>
              <th className="align-middle text-center">Email</th>
            </tr>
            {filterUser(user).map((user, index) => (
              <tr>
                <td className="align-middle text-center">{index + 1}</td>
                <td className="align-middle text-center text-uppercase">
                  {user.usernames}
                </td>
                <td className="align-middle text-center">{user.hoten}</td>
                <td className="align-middle text-center">{user.diachi}</td>
                <td className="align-middle text-center">{user.sdt}</td>
                <td className="align-middle text-center">{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
  const componentRef03 = useRef();

  //=== Pagination
  const [page03, setPage03] = useState(1);
  const filterUser = (userList) => {
    const firstParam = (page03 || 1) * 5 - 5;
    const secondParam = (page03 || 1) * 5;
    return userList.slice(firstParam, secondParam);
  };
  const prevPage03 = (num) => {
    if (page03 <= 1) return;
    setPage03(() => page03 - 1);
  };
  const nextPage03 = (num) => {
    if (page03 >= totalPages03[totalPages03.length - 1]) return;
    setPage03(() => page03 + 1);
  };
  const toPage03 = (num) => {
    setPage03(num);
  }

  //========== THONG KE TIN TUC
  const [loading04, setLoading04] = useState(false);
  const [news, setNews] = useState([]);
  const [totalPages04, setTotalPages04] = useState([]);
  const totalPagesCalculate04 = (arrLength) => {
    const totalP = [];
    for (let i = 1; i <= Math.ceil(arrLength / 5); i++) {
      totalP.push(i);
    }
    setTotalPages04(totalP);
  };
  const fetchNews = async () => {
    setLoading04(true);
    const { data } = await axios.get(`/getnews`);
    setNews(data);
    totalPagesCalculate04(data.length);
    setLoading04(false);
  };
  //=== export excel
  const headers04 = [
    { label: "STT", key: "stt" },
    { label: "Tựa đề", key: "tuade" },
    { label: "Tác giả", key: "tacgia" },
    { label: "Thời gian", key: "thoigian" },
  ];
  const excel04 = news.map((news, index) => ({
    stt: index + 1,
    tuade: news.title,
    tacgia: news.hoten,
    thoigian: news.thoigian,
  }));
  //=== export pdf
  const ComponentToPrint04 = React.forwardRef((props, ref) => {
    return (
      <div ref={ref}>
        <table
          className="table table-bordered my-3 text-nowrap"
          id="dataTable"
          width="100%"
          cellSpacing={0}
        >
          <tbody className={`${styles.tbody}`}>
            <tr className="thead-light">
              <th className="align-middle text-center">STT</th>
              <th
                className="align-middle text-center"
                style={{ maxWidth: "500px" }}
              >
                Tiêu đề tin tức
              </th>
              <th className="align-middle text-center">Tác giả</th>
              <th className="align-middle text-center">Thời gian</th>
            </tr>
            {filterNews(news).map((news, index) => (
              <tr>
                <td className="align-middle text-center">{news.index + 1}</td>
                <td
                  className="align-middle text-center"
                  style={{
                    maxWidth: "500px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {news.title}
                </td>
                <td className="align-middle text-center">{news.hoten}</td>
                <td className="align-middle text-center">{news.thoigian}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  });
  const componentRef04 = useRef();
  //=== Bộ lọc
  const [tieuDe04, setTieuDe04] = useState();
  const [tacGia04, setTacGia04] = useState();
  const [timeStart, setTimeStart] = useState();
  const [timeEnd, setTimeEnd] = useState();
  const search04 = async (e) => {
    e.preventDefault();
    fetchNews1();
  };
  const fetchNews1 = async () => {
    setLoading04(true);
    var tieude = "";
    var tieude1 = "";
    if (!tieuDe) {
      tieude = "nbsp";
    } else {
      tieude1 = tieuDe;
      if (tieude1 === "") {
        tieude = "nbsp";
      } else {
        tieude = tieude1;
      }
    }
    var tacgia = "";
    var tacgia1 = "";
    if (!tacGia) {
      tacgia = "nbsp";
    } else {
      tacgia1 = tacGia;
      if (tacgia1 === "") {
        tacgia = "nbsp";
      } else {
        tacgia = tacgia1;
      }
    }
    var timestart = "";
    var timestart1 = "";
    if (!timeStart) {
      timestart = "nbsp";
    } else {
      timestart1 = timeStart + " 00:00:00";
      if (timestart1 === "") {
        timestart = "nbsp";
      } else {
        timestart = timestart1;
      }
    }
    var timeend = "";
    var timeend1 = "";
    if (!timeEnd) {
      timeend = "nbsp";
    } else {
      timeend1 = timeEnd + " 23:59:59";
      if (timeend1 === "") {
        timeend = "nbsp";
      } else {
        timeend = timeend1;
      }
    }
    console.log("data", tieude);
    const { data } = await axios.get(
      `/searchnews/tieude=${tieude}&&tacgia=${tacgia}&&timestart=${timestart}&&timeend=${timeend}`
    );
    setNews(data);
    totalPagesCalculate04(data.length);
    setLoading04(false);
  };
  //=== Pagination
  const [page04, setPage04] = useState(1);
  const filterNews = (newsList) => {
    newsList = newsList.map((item, index) => {
      return { ...item, index: index };
    });
    const firstParam = (page04 || 1) * 5 - 5;
    const secondParam = (page04 || 1) * 5;
    return newsList.slice(firstParam, secondParam);
  };
  const prevPage04 = (num) => {
    if (page04 <= 1) return;
    setPage04(() => page04 - 1);
  };
  const nextPage04 = (num) => {
    if (page04 >= totalPages04[totalPages04.length - 1]) return;
    setPage04(() => page04 + 1);
  };
  const toPage04 = (num) => {
    setPage04(num);
  }

  //========== Thong ke sach duoc muon nhieu nhat
  const [day1, setDay1] = useState(moment(new Date()).subtract(7, "day").format("YYYY-MM-DD"));
  const [day2, setDay2] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const search05 = (e) => {
    e.preventDefault();
    fetchCountBook();
  };
  const [countBook, setCountBook] = useState([]);
  const fetchCountBook = async () => {
    const { data } = await axios.get(`/searchcountbook/day1=${day1}&&day2=${day2}`);
    setCountBook(data);
  };

  return (
    <div className={`${styles.content}`}>
      <div className="container">
        {/* Thống kê sách */}
        <h3 className={`${styles.title}`}>Thống kê sách</h3>
        <hr />
        <div>
          <div>
            <form>
              <div className="row">
                <div className="form-group col-4">
                  <label
                    htmlFor="tensach"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập tiêu đề
                  </label>
                  <input
                    type="text"
                    id="tensach"
                    name="tensach"
                    className="form-control"
                    placeholder="Nhập tiêu đề cần tìm kiếm"
                    onChange={(e) => setTieuDe(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label
                    htmlFor="tacgia"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập tác giả
                  </label>
                  <input
                    type="text"
                    id="tacgia"
                    name="tacgia"
                    className="form-control"
                    placeholder="Nhập tác giả cần tìm kiếm"
                    onChange={(e) => setTacGia(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label
                    htmlFor="ngonngu"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Chọn ngôn ngữ
                  </label>
                  <div>
                    <select
                      id="ngonngu"
                      name="ngonngu"
                      className="form-control"
                      onChange={(e) => setNgonNgu(e.target.value)}
                    >
                      <option value="">Tất cả</option>
                      <option value="Tiếng Việt">Tiếng Việt</option>
                      <option value="Ngôn ngữ khác">Ngôn ngữ khác</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="form-group col-4">
                  <label
                    htmlFor="namxbstart"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập năm xuất bản: Từ năm
                  </label>
                  <input
                    type="number"
                    id="namxbstart"
                    name="namxbstart"
                    className="form-control"
                    placeholder="Năm xuất bản: Từ năm"
                    onChange={(e) => setNamXbStart(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label
                    htmlFor="namxbend"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập năm xuất bản: Đến năm
                  </label>
                  <input
                    type="number"
                    id="namxbend"
                    name="namxbend"
                    className="form-control"
                    placeholder="Năm xuất bản: đến năm"
                    onChange={(e) => setNamXbEnd(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label
                    htmlFor="nhaxb"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập nhà xuất bản
                  </label>
                  <input
                    type="text"
                    id="nhaxb"
                    name="nhaxb"
                    className="form-control"
                    placeholder="Nhập nhà xuất bản cần tìm kiếm"
                    onChange={(e) => setNhaXB(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-4">
                  <label
                    htmlFor="chude"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập chủ đề
                  </label>
                  <input
                    type="text"
                    id="chude"
                    name="chude"
                    className="form-control"
                    placeholder="Nhập chủ đề cần tìm kiếm"
                    onChange={(e) => setChuDe(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label
                    htmlFor="loaisach"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập loại sách
                  </label>
                  <input
                    type="text"
                    id="loaisach"
                    name="loaisach"
                    className="form-control"
                    placeholder="Nhập loại sách cần tìm kiếm"
                    onChange={(e) => setLoaiSach(e.target.value)}
                  />
                </div>
                <div className="form-group col-4">
                  <label
                    htmlFor="mahp"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập mã học phần
                  </label>
                  <input
                    type="text"
                    id="mahp"
                    name="mahp"
                    className="form-control"
                    placeholder="Số mã học phần cần tìm kiếm"
                    onChange={(e) => setMaHP(e.target.value)}
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
                    onClick={searchkhongdau}
                  >
                    Tìm không dấu
                  </button>
                  <button
                    style={{ maxHeight: "38px", marginLeft: "10px" }}
                    type="button"
                    className="btn btn-primary"
                    onClick={search01}
                  >
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </form>
            <div id="baocaoCV">
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
              <span className={`${styles.result}`}>
                Tìm kiếm được {book.length} kết quả
              </span>
              {loading01 ? (
                <div> Loading... </div>
              ) : (
                !book.length ? (
                  <table
                    className="table table-bordered my-3 text-nowrap"
                    id="dataTable"
                    width="100%"
                    cellSpacing={0}
                  >
                    <tbody className={`${styles.tbody}`}>
                      <tr className="thead-light">
                        <th className="align-middle text-center">STT</th>
                        <th className="align-middle text-center">Mã sách</th>
                        <th className="align-middle text-center">Tên sách</th>
                        <th className="align-middle text-center">Tác giả</th>
                        <th className="align-middle text-center">Nhà xuất bản</th>
                        <th className="align-middle text-center">Mã học phần</th>
                        <th className="align-middle text-center">Vị trí</th>
                        <th className="align-middle text-center">Số lượng</th>
                        <th className="align-middle text-center">Năm xuất bản</th>
                        <th className="align-middle text-center">
                          Hình thức mượn
                        </th>
                        <th className="align-middle text-center">Ngôn ngữ</th>
                        <th className="align-middle text-center">Loại sách</th>
                        <th className="align-middle text-center">Chủ đề</th>
                      </tr>
                      <tr>
                        <td colSpan="15" className="align-middle text-center">
                          Không có dữ liệu
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div>
                    <div className="table-responsive">
                      <table
                        className="table table-bordered my-3 text-nowrap"
                        id="dataTable"
                        width="100%"
                        cellSpacing={0}
                      >
                        <tbody className={`${styles.tbody}`}>
                          <tr className="thead-light">
                            <th className="align-middle text-center">STT</th>
                            <th className="align-middle text-center">Mã sách</th>
                            <th className="align-middle text-center">Tên sách</th>
                            <th className="align-middle text-center">Tác giả</th>
                            <th className="align-middle text-center">Nhà xuất bản</th>
                            <th className="align-middle text-center">Mã học phần</th>
                            <th className="align-middle text-center">Vị trí</th>
                            <th className="align-middle text-center">Số lượng</th>
                            <th className="align-middle text-center">Năm xuất bản</th>
                            <th className="align-middle text-center">
                              Hình thức mượn
                            </th>
                            <th className="align-middle text-center">Ngôn ngữ</th>
                            <th className="align-middle text-center">Loại sách</th>
                            <th className="align-middle text-center">Chủ đề</th>
                          </tr>
                          {filterBook(book).map((book, index) => (
                            <tr>
                              <td className="align-middle text-center">
                                {book.index + 1}
                              </td>
                              <td className="align-middle text-center">
                                {book.sachid}
                              </td>
                              <td className="align-middle text-center">
                                {book.tensach}
                              </td>
                              <td className="align-middle text-center">
                                {book.tacgia}
                              </td>
                              <td className="align-middle text-center">
                                {book.nhaxb}
                              </td>
                              <td className="align-middle text-center text-uppercase">
                                {book.mahp}
                              </td>
                              <td className="align-middle text-center">
                                {book.vitri}
                              </td>
                              <td className="align-middle text-center">
                                {book.soluong}
                              </td>
                              <td className="align-middle text-center">
                                {book.namxb}
                              </td>
                              <td className="align-middle text-center">
                                {book.hinhthuc}
                              </td>
                              <td className="align-middle text-center">
                                {book.ngonngu}
                              </td>
                              <td className="align-middle text-center">
                                {book.tenloai}
                              </td>
                              <td className="align-middle text-center">
                                {book.tenchude}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <br />
                    <div className="row">
                      <div
                        className="col-12"
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            <li className="page-item">
                              <div
                                className="page-link"
                                style={{ "cursor": "pointer" }}
                                onClick={() => prevBookPage()}
                              >
                                Prev
                              </div>
                            </li>
                            {totalPages.map((item) => (
                              <li
                                className={`${item === bookPage ? "active" : ""
                                  } page-item`}
                              >
                                <div
                                  className="page-link"
                                  style={{ "cursor": "pointer" }}
                                  onClick={() => toBookPage(item)}
                                >
                                  {item}
                                </div>
                              </li>
                            ))}
                            <li className="page-item">
                              <div
                                className="page-link"
                                style={{ "cursor": "pointer" }}
                                onClick={() => nextBookPage()}
                              >
                                Next
                              </div>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <br />

          </div>

          <div style={{ display: "none" }}>
            <ComponentToPrint ref={componentRef} />
          </div>
        </div>

        {/* Thống kê nhật ký */}
        <h3 className={`${styles.title}`}>Thống kê nhật ký mượn - trả sách</h3>
        <hr />
        <div>
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
                  type="number"
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
                  onClick={reset02}
                >
                  Làm lại
                </button>
                <button
                  style={{ maxHeight: "38px", marginLeft: "10px" }}
                  type="button"
                  className="btn btn-primary"
                  onClick={search02}
                >
                  Lọc
                </button>
              </div>
            </div>
          </form>
          <div className="table-responsive">
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
                    headers={headers02}
                    data={excel02}
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
              content={() => componentRef02.current}
            />
            <span className={`${styles.result}`}>
              Tìm kiếm được {diary.length} kết quả
            </span>
            {loading02 ? (
              <div> Loading... </div>
            ) : (
              <table
                className="table table-bordered my-3 text-nowrap"
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
                    <th className="align-middle text-center">
                      Mã người cho trả
                    </th>
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
                        onClick={search002}
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
                        <td className="align-middle text-center">
                          {item.hoten}
                        </td>
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
                        <td
                          className="align-middle text-center"
                          style={{ minWidth: "500px" }}
                        >
                          {item.ghichu}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
          <br />
          <div className="row">
            <div
              className="col-12"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <div
                      className="page-link"
                      style={{ "cursor": "pointer" }}
                      onClick={() => prevPage02()}
                    >
                      Prev
                    </div>
                  </li>
                  {totalPages02.map((item) => (
                    <li
                    className={`${item === page02 ? "active" : ""
                  } page-item`}
                    >
                      <div
                        className="page-link"
                        style={{ "cursor": "pointer" }}
                        onClick={() => toPage02(item)}
                      >
                        {item}
                      </div>
                    </li>
                  ))}
                  <li className="page-item">
                    <div
                      className="page-link"
                      style={{ "cursor": "pointer" }}
                      onClick={() => nextPage02()}
                    >
                      Next
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div style={{ display: "none" }}>
            <ComponentToPrint02 ref={componentRef02} />
          </div>
        </div>

        {/* Thống kê người dùng */}
        <h3 className={`${styles.title}`}>Thống kê người dùng</h3>
        <hr />
        <div>
          <form>
            <div className="row">
              <div className="form-group col">
                <label
                  htmlFor="ma"
                  className="col-form-label"
                  style={{ fontWeight: "bold" }}
                >
                  Nhập mã người dùng
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
                  Nhập tên người dùng
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
              <div className="form-group col-1">
                <label
                  htmlFor="tennguoidung"
                  className="col-form-label"
                  style={{ fontWeight: "bold" }}
                >
                  &nbsp;
                </label>
                <div className="w-100">
                  <button
                    style={{ maxHeight: "38px" }}
                    type="button"
                    className="btn btn-primary w-100"
                    onClick={search03}
                  >
                    Lọc
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="table-responsive" id="baocaoCV">
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
                    headers={headers03}
                    data={excel03}
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
              content={() => componentRef03.current}
            />
            <span className={`${styles.result}`}>
              Tìm kiếm được {user.length} kết quả
            </span>
            {loading03 ? (
              <div> Loading... </div>
            ) : (
              <table
                className="table table-bordered my-3 text-nowrap"
                id="dataTable"
                width="100%"
                cellSpacing={0}
              >
                <tbody className={`${styles.tbody}`}>
                  <tr className="thead-light">
                    <th className="align-middle text-center">STT</th>
                    <th className="align-middle text-center">Mã người dùng</th>
                    <th className="align-middle text-center">Họ và tên</th>
                    <th className="align-middle text-center">Địa chỉ</th>
                    <th className="align-middle text-center">Số điện thoại</th>
                    <th className="align-middle text-center">Email</th>
                  </tr>
                  {filterUser(user).map((user, index) => (
                    <tr>
                      <td className="align-middle text-center">{index + 1}</td>
                      <td className="align-middle text-center text-uppercase">
                        {user.usernames}
                      </td>
                      <td className="align-middle text-center">{user.hoten}</td>
                      <td className="align-middle text-center">
                        {user.diachi}
                      </td>
                      <td className="align-middle text-center">{user.sdt}</td>
                      <td className="align-middle text-center">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className="row">
            <div
              className="col-12"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item">
                    <div
                      className="page-link"
                      style={{ "cursor": "pointer" }}
                      onClick={() => prevPage03()}
                    >
                      Prev
                    </div>
                  </li>
                  {totalPages03.map((item) => (
                    <li
                    className={`${item === page03 ? "active" : ""
                  } page-item`}
                    >
                      <div
                        className="page-link"
                        style={{ "cursor": "pointer" }}
                        onClick={() => toPage03(item)}
                      >
                        {item}
                      </div>
                    </li>
                  ))}

                  <li className="page-item">
                    <div
                      className="page-link"
                      style={{ "cursor": "pointer" }}
                      onClick={() => nextPage03()}
                    >
                      Next
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div style={{ display: "none" }}>
            <ComponentToPrint03 ref={componentRef03} />
          </div>
        </div>

        {/* Thống kê tin tức */}
        <h3 className={`${styles.title}`}>Thống kê tin tức</h3>
        <hr />
        <div className={`${styles.content}`}>
          <div>
            <form>
              <div className="row">
                <div className="form-group col">
                  <label
                    htmlFor="tieude"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập tiêu đề tin tức
                  </label>
                  <input
                    type="text"
                    id="tieude"
                    name="tieude"
                    className="form-control"
                    placeholder="Nhập tiêu đề cần tìm kiếm"
                    onChange={(e) => setTieuDe(e.target.value)}
                  />
                </div>
                <div className="form-group col">
                  <label
                    htmlFor="tacgia"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Nhập tên tác giả
                  </label>
                  <input
                    type="text"
                    id="tacgia"
                    name="tacgia"
                    className="form-control"
                    placeholder="Nhập tên tác giả cần tìm kiếm"
                    onChange={(e) => setTacGia(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col">
                  <label
                    htmlFor="timestart"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Chọn thời gian bắt đầu
                  </label>
                  <input
                    type="date"
                    id="timestart"
                    name="timestart"
                    className="form-control"
                    onChange={(e) => setTimeStart(e.target.value)}
                  />
                </div>
                <div className="form-group col">
                  <label
                    htmlFor="timeend"
                    className="col-form-label"
                    style={{ fontWeight: "bold" }}
                  >
                    Chọn thời gian kết thúc
                  </label>
                  <input
                    type="date"
                    id="timeend"
                    name="timeend"
                    className="form-control"
                    onChange={(e) => setTimeEnd(e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12" style={{ textAlign: "right" }}>
                  <button
                    style={{ maxHeight: "38px", marginLeft: "10px" }}
                    type="button"
                    className="btn btn-primary"
                    onClick={search04}
                  >
                    Lọc
                  </button>
                </div>
              </div>
            </form>

            <div className="table-responsive" id="baocaoCV">
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
                      headers={headers04}
                      data={excel04}
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
                content={() => componentRef04.current}
              />
              <span className={`${styles.result}`}>
                Tìm kiếm được {news.length} kết quả
              </span>
              {loading04 ? (
                <div> Loading... </div>
              ) : (
                <table
                  className="table table-bordered my-3 text-nowrap"
                  id="dataTable"
                  width="100%"
                  cellSpacing={0}
                >
                  <tbody className={`${styles.tbody}`}>
                    <tr className="thead-light">
                      <th className="align-middle text-center">STT</th>
                      <th
                        className="align-middle text-center"
                        style={{ maxWidth: "500px" }}
                      >
                        Tiêu đề tin tức
                      </th>
                      <th className="align-middle text-center">Tác giả</th>
                      <th className="align-middle text-center">Thời gian</th>
                    </tr>
                    {!news.length ? (
                      <tr>
                        <td colSpan="11" className="align-middle text-center">
                          Không có dữ liệu
                        </td>
                      </tr>
                    ) : (
                      filterNews(news).map((news, index) => (
                        <tr>
                          <td className="align-middle text-center">
                            {news.index + 1}
                          </td>
                          <td
                            className="align-middle text-center"
                            style={{
                              maxWidth: "500px",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            <Link
                              to={`/detailnews/${news.tintucid}`}
                              target="_blank"
                              className="text-decoration-none"
                            >
                              {news.title}
                            </Link>
                          </td>
                          <td className="align-middle text-center">
                            {news.hoten}
                          </td>
                          <td className="align-middle text-center">
                            {news.thoigian}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <br />
            <div className="row">
              <div
                className="col-12"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <nav aria-label="Page navigation example">
                  <ul className="pagination">
                    <li className="page-item">
                      <div
                        className="page-link"
                        style={{ "cursor": "pointer" }}
                        onClick={() => prevPage04()}
                      >
                        Prev
                      </div>
                    </li>
                    {totalPages04.map((item) => (
                      <li
                      className={`${item === page04 ? "active" : ""
                    } page-item`}
                      >
                        <div
                          className="page-link"
                          style={{ "cursor": "pointer" }}
                          onClick={() => toPage04(item)}
                        >
                          {item}
                        </div>
                      </li>
                    ))}
                    <li className="page-item">
                      <div
                        className="page-link"
                        style={{ "cursor": "pointer" }}
                        onClick={() => nextPage04()}
                      >
                        Next
                      </div>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>

          <div style={{ display: "none" }}>
            <ComponentToPrint04 ref={componentRef04} />
          </div>
        </div>

        {/* Thống kê hình ảnh */}
        <h3 className={`${styles.title}`}>
          Thống kê hình ảnh
        </h3>
        <hr />
        <div className={`${styles.content} row`}>
          <div className="col-3">
            <div className={`${styles.bgGreen} card text-white mb-4`}>
              <h3 className={`${styles.cardBody1} card-body`}>
                {sourceImages.length}
              </h3>
              <div className={`${styles.cardBody2} card-body`}>
                Tất cả hình ảnh
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="./images">
                  Xem chi tiết
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right" />
                </div>
              </div>
            </div>
          </div>
          <div className="col-3">
            <div className={`${styles.bgAqua} card text-white mb-4`}>
              <h3 className={`${styles.cardBody1} card-body`}>
                {images.length}
              </h3>
              <div className={`${styles.cardBody2} card-body`}>
                Hình ảnh đã hiển thị
              </div>
              <div className="card-footer d-flex align-items-center justify-content-between">
                <Link className="small text-white stretched-link" to="./photos">
                  Xem chi tiết
                </Link>
                <div className="small text-white">
                  <i className="fas fa-angle-right" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thống kê sơ đồ */}
        <h3 className={`${styles.title}`}>
          Thống kê số sách đã mượn và đã trả
        </h3>
        <hr />
        <div>
          <form className="form-inline">
            <div className="form-group mx-sm-2 mb-2">
              <input
                type="date"
                className="form-control"
                id="myDate"
                name="myDate"
                onChange={(e) => setSelectedDate(e.target.value)}
                required
                value={selectedDate}
              />
            </div>
            <div className="form-group mx-sm-2 mb-2">
              <input
                type="date"
                className="form-control"
                id="myDate2"
                name="myDate2"
                onChange={(e) => setSelectedDate2(e.target.value)}
                required
                value={selectedDate2}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={search}
            >
              Lọc
            </button>
          </form>
          <Bar options={options} data={report} />
        </div>
        <br />




        {/* Thống kê sách được mượn nhiều nhất */}
        <h3 className={`${styles.title}`}>
          Thống kê 5 sách được mượn nhiều nhất
        </h3>
        <hr />
        <div className={`${styles.comp3}`}>
          <form className="form-inline">
            <div className="form-group mx-sm-2 mb-2">
              <input
                type="date"
                className="form-control"
                id="myWeek1"
                name="myWeek1"
                onChange={(e) => setDay1(e.target.value)}
                value={day1}
                required
              />
            </div>
            <div className="form-group mx-sm-2 mb-2">
              <input
                type="date"
                className="form-control"
                id="myWeek1"
                name="myWeek1"
                onChange={(e) => setDay1(e.target.value)}
                value={day2}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary mb-2"
              onClick={search05}
            >
              Lọc
            </button>
          </form>
          <div className="table-responsive" id="baocaoCV">
            <table
              className="table table-bordered my-3 text-nowrap"
              id="dataTable"
              width="100%"
              cellSpacing={0}
            >
              <tbody className={`${styles.tbody}`}>
                <tr className="thead-light">
                  <th className="align-middle text-center">Số lần được mượn</th>
                  <th className="align-middle text-center">Mã sách</th>
                  <th className="align-middle text-center">Tên sách</th>
                  <th className="align-middle text-center">Tác giả</th>
                  <th className="align-middle text-center">Nhà xuất bản</th>
                  <th className="align-middle text-center">Mã học phần</th>
                  <th className="align-middle text-center">Vị trí</th>
                  <th className="align-middle text-center">Số lượng</th>
                  <th className="align-middle text-center">Năm xuất bản</th>
                  <th className="align-middle text-center">Hình thức mượn</th>
                  <th className="align-middle text-center">Ngôn ngữ</th>
                  <th className="align-middle text-center">Loại sách</th>
                  <th className="align-middle text-center">Chủ đề</th>
                </tr>
                {countBook.map((book, index) => (
                  <tr>
                    <td className="align-middle text-center">{book.count}</td>
                    <td className="align-middle text-center">{book.sachid}</td>
                    <td className="align-middle text-center">{book.tensach}</td>
                    <td className="align-middle text-center">{book.tacgia}</td>
                    <td className="align-middle text-center">{book.nhaxb}</td>
                    <td className="align-middle text-center text-uppercase">
                      {book.mahp}
                    </td>
                    <td className="align-middle text-center">{book.vitri}</td>
                    <td className="align-middle text-center">{book.soluong}</td>
                    <td className="align-middle text-center">{book.namxb}</td>
                    <td className="align-middle text-center">
                      {book.hinhthuc}
                    </td>
                    <td className="align-middle text-center">{book.ngonngu}</td>
                    <td className="align-middle text-center">{book.tenloai}</td>
                    <td className="align-middle text-center">
                      {book.tenchude}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <br />

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
