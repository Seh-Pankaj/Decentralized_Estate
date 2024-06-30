import axios from "axios";

const apiRequest = axios.create({
  baseURL: "http://192.168.38.99:8800/api",
  withCredentials: true,
});

export default apiRequest;