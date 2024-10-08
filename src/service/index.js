import axios from "axios";
import { Toast } from "../components/ui/toast-alert";

// const API_URL = "http://localhost:8000/api/request-pronunce";
const API_URL =
  "https://ethnic-sparrow-gyulabs-668e5137.koyeb.app/api/request-pronunce";

// console.log("API_KEY:", API_KEY); // 환경 변수 출력

export const requestPronunce = async (requestBody) => {
  try {
    console.log("Sending request to API with body:", requestBody); // 요청 본문 로그 추가
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 204) {
      Toast.fire({
        icon: "error",
        title: "No tiene contenido.",
      });
      return null; // 또는 적절한 기본값을 반환
    }

    console.log("Response received:", response);
    return response.data;
  } catch (error) {
    console.error("Error in requestPronunce:", error);
    throw error;
  }
};
