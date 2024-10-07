import axios from "axios";

const API_URL = "http://aiopen.etri.re.kr:8000/WiseASR/PronunciationKor";
const API_KEY = process.env.REACT_APP_API_KEY; // 여기에 실제 API 키를 입력하세요.

console.log("API_KEY:", API_KEY); // 환경 변수 출력

export const requestPronunce = async (requestBody) => {
  try {
    console.log("Sending request to API with body:", requestBody); // 요청 본문 로그 추가
    const response = await axios.post(API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY,
      },
    });

    if (response.status === 204) {
      console.log("No content returned from server");
      return null; // 또는 적절한 기본값을 반환
    }

    console.log("Response received:", response);
    return response.data;
  } catch (error) {
    console.error("Error in requestPronunce:", error);
    throw error;
  }
};
