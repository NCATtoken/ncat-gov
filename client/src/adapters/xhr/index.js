import axios from "axios";

const { api } = require("../../constants");

function returnAxiosInstance() {
  return axios.create({
    baseURL: api.baseURL,
    timeout: 5 * 60 * 1000 /* 5m */,
    headers: {
      'Authorization': 'Bearer ' + api.token,
    }
  });
}

export async function get(url) {
  const instance = returnAxiosInstance();
  try {
    return await instance.get(url);
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else throw error;
  }
}

export async function post(url, body) {
  const instance = returnAxiosInstance();
  try {
    return await instance.post(url, body);
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else throw error;
  }
}
