import {
  CAP_NHAT_USER_THANH_CONG,
  CAP_NHAT_USER_THAT_BAI,
  DANG_NHAP_THANH_CONG,
  FIRST_LOGIN_THANH_CONG,
  DANG_NHAP_THAT_BAI,
  YEU_CAU_CAP_NHAT_USER,
  YEU_CAU_DANG_NHAP,
  YEU_CAU_TIM_KIEM,
  TIM_KIEM_THANH_CONG,
  TIM_KIEM_THAT_BAI,
} from "./constants";
import Axios from "axios";

export const dangNhapUser = (usernames, passwords) => async (dispatch) => {
  dispatch({ type: YEU_CAU_DANG_NHAP });
  const { data } = await Axios.post("/login", { usernames, passwords });
  if (data.type === "ldap") {
    dispatch({ type: DANG_NHAP_THAT_BAI, payload: "đăng nhập thất bại" });
    alert("Thông tin đăng nhập không chính xác!!!");
  } else if (data.type === "pg") {
    dispatch({ type: FIRST_LOGIN_THANH_CONG, payload: data });
    // da chia ra trong cai if else
    // thi cai state khong 2quan trogn nua, m da lay du liẹu truc tiep tu api roi
    localStorage.setItem("userInfo", JSON.stringify({ userInfo: data }));
  } else if (data.type === "else") {
    if (data.check === "true") {
      dispatch({ type: DANG_NHAP_THANH_CONG, payload: data });
      localStorage.setItem("userInfo", JSON.stringify({ userInfo: data }));
    } else {
      dispatch({ type: DANG_NHAP_THAT_BAI, payload: "đăng nhập thất bại" });
      alert("Tài khoản của bạn đã bị khoá!!!");
    }
  }
};


export const capNhatUser = (info) => async (dispatch) => {
  dispatch({ type: YEU_CAU_CAP_NHAT_USER });
  try {
    const { data } = await Axios.post("/update", info);
    dispatch({ type: CAP_NHAT_USER_THANH_CONG, payload: data });
  } catch (error) {
    dispatch({ type: CAP_NHAT_USER_THAT_BAI, payload: "cập nhật thất bại" });
    alert("Lỗi cập nhật!!!");
  }
};

export const timKiem = (info) => async (dispatch) => {
  dispatch({ type: YEU_CAU_TIM_KIEM });
  try {
    const { data } = await Axios.get(`/search/danhmuc=${info.dM}&&keyword=${info.keyWord}`, info);
    dispatch({ type: TIM_KIEM_THANH_CONG, payload: data });
  } catch (error) {
    dispatch({ type: TIM_KIEM_THAT_BAI, payload: "cập nhật thất bại" });
  }
};