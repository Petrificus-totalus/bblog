import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://probiotics.azurewebsites.net/api`, // 公共部分的 URL
  // baseURL: "http://localhost:5217/api",
  timeout: 5000, // 可选：设置请求超时时间
  headers: {
    "Content-Type": "application/json", // 可选：默认请求头
  },
});

export default axiosInstance;
