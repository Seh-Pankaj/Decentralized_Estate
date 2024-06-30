import axios from "axios";

const ipfsApiRequest = axios.create({
  baseURL: "http://192.168.38.99:4007",
  withCredentials: true,
});

export default ipfsApiRequest;