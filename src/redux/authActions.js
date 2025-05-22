import axios from "axios";
import {
  APP_GENERATE_TOKEN_REQUEST,
  APP_GENERATE_TOKEN_SUCCESS,
  APP_GENERATE_TOKEN_FAILURE,


} from "./actionsTypes";
import { API_REQUESTS } from "../api/api-end-points";

// Utility function for async requests
const sendRequest = async (requestConfig, data = {}, headers = {}) => {
  // console.log("sendRequestAsyng", requestConfig, data);
  const { url, method } = requestConfig;
  const response = await axios({
    url,
    method,
    data,
    headers,
  });
  return response.data;
};

// Generate Token
export const generateToken = () => async (dispatch) => {
  dispatch({ type: APP_GENERATE_TOKEN_REQUEST });
  try {
    const response = await sendRequest(API_REQUESTS.APP_GENERATE_TOKEN);
    // console.log("generateToken", response);

    dispatch({ type: APP_GENERATE_TOKEN_SUCCESS, payload: response });
  } catch (error) {
    dispatch({ type: APP_GENERATE_TOKEN_FAILURE, error: error.message });
  }
};


