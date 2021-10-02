import {
  CAP_NHAT_USER_THANH_CONG,
  CAP_NHAT_USER_THAT_BAI,
  DANG_NHAP_THANH_CONG,
  DANG_NHAP_THAT_BAI,
  DANG_XUAT,
  FIRST_LOGIN_THANH_CONG,
  YEU_CAU_CAP_NHAT_USER,
  YEU_CAU_DANG_NHAP,
} from "./constants";

export const dangNhapReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case YEU_CAU_DANG_NHAP:
      return { loading: true,  };
    case DANG_NHAP_THANH_CONG:
      return { loading: false, userInfo: action.payload };
    case FIRST_LOGIN_THANH_CONG:
      return { loading: false, userInfo: action.payload };
    case DANG_NHAP_THAT_BAI:
      return { loading: false,error: action.payload };
    case DANG_XUAT:
      localStorage.removeItem("userInfo");
      return {};
    default:
      return state;
  }
};
export const capNhatUserReducer = (state = {}, action) => {
  switch (action.type) {
    case YEU_CAU_CAP_NHAT_USER:
      return { loading: true };
    case CAP_NHAT_USER_THANH_CONG:
      return { loading: false, infor: action.payload };
    case CAP_NHAT_USER_THAT_BAI:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};