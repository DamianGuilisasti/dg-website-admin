import axios from "axios";

export const customHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

axios.defaults.baseURL = "http://localhost:4000/api";
axios.defaults.headers = customHeaders;

export default axios;
