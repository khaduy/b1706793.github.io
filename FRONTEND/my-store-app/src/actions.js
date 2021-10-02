import {
  CAP_NHAT_USER_THANH_CONG,
  CAP_NHAT_USER_THAT_BAI,
  DANG_NHAP_THANH_CONG,
  FIRST_LOGIN_THANH_CONG,
  DANG_NHAP_THAT_BAI,
  YEU_CAU_CAP_NHAT_USER,
  YEU_CAU_DANG_NHAP,
} from "./constants";
import Axios from "axios";

export const dangNhapUser = (usernames, passwords) => async (dispatch) => {
  dispatch({ type: YEU_CAU_DANG_NHAP });
  const { data }  = await Axios.post("/login", { usernames, passwords });

  if (data.type == "ldap"){
    dispatch({ type: DANG_NHAP_THAT_BAI, payload: "đăng nhập thất bại" });
    // alert("Thông tin đăng nhập không chính xác!!!");
  } else if (data.type == "pg") {
    dispatch({ type:  FIRST_LOGIN_THANH_CONG, payload: data });
    // da chia ra trong cai ì else
    // thi cai state khong 2quan trogn nua, m da lay du liẹu truc tiep tu api roi
    localStorage.setItem("userInfo", JSON.stringify({ userInfo: data })); 
  } else if (data.type == "else") {
    dispatch({ type:  DANG_NHAP_THANH_CONG, payload: data });
    localStorage.setItem("userInfo", JSON.stringify({ userInfo: data })); 
  }
}; 

// export const dangNhapUser = (usernames, passwords) => async (dispatch) => {
//   dispatch({ type: YEU_CAU_DANG_NHAP });
//   const { data } = await Axios.post("/login", { usernames, passwords });

//   if (data) {
//     dispatch({ type: DANG_NHAP_THANH_CONG, payload: data });
//     localStorage.setItem("userInfo", JSON.stringify({ userInfo: data })); //Bien doi thanh chuoi
//   } else if(error) {
//     dispatch({ type: DANG_NHAP_THANH_CONG_1, payload: data });
//     localStorage.setItem("userInfo", JSON.stringify({ userInfo: data })); //Bien doi thanh chuoi
//   } else if(err) {
//     dispatch({ type: DANG_NHAP_THAT_BAI, payload: err.message });
//     alert("Thông tin đăng nhập không chính xác!!!");
//   }


// };



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