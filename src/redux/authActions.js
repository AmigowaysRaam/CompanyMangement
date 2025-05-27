import axios from "axios";
import {
  APP_SITE_SETTINGS_REQUEST,
  APP_SITE_SETTINGS_SUCCESS,
  APP_SITE_SETTINGS_FAILURE,

  APP_GET_LANGUAGES_REQUEST,
  APP_GET_LANGUAGE_SUCCESS,
  APP_GET_LANGUAGE_FAILURE,

  APP_USER_LOGIN_REQUEST,
  APP_USER_LOGIN_SUCCESS,
  APP_USER_LOGIN_FAILURE,

  APP_USER_SIDE_MENUS_REQUEST,
  APP_USER_SIDE_MENUS_SUCCESS,
  APP_USER_SIDE_MENUS_FAILURE,

} from "./actionsTypes";
import { API_REQUESTS } from "../api/api-end-points";


const sendRequest = async (requestConfig, data = {}, headers = {}) => {
  const { url } = requestConfig;

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error("Request failed:", error.response?.data || error.message);
    throw error;
  }
};


export const getSiteSettingsFrom = (callback) => async (dispatch) => {
  dispatch({ type: APP_SITE_SETTINGS_REQUEST });

  try {
    const endpoint = API_REQUESTS.API_SITE_URL;
    const response = await sendRequest(endpoint, {});
    dispatch({ type: APP_SITE_SETTINGS_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;

  } catch (error) {
    console.error("Error fetching site settings:", error.message);
    dispatch({ type: APP_SITE_SETTINGS_FAILURE, error: error.message });
  }
};

// getLanguageList
export const getLanguageList = (callback) => async (dispatch) => {
  dispatch({ type: APP_GET_LANGUAGES_REQUEST });
  try {
    const endpoint = API_REQUESTS.API_LANGUAGE_URL;
    const response = await sendRequest(endpoint, {});
    dispatch({ type: APP_GET_LANGUAGE_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;

  } catch (error) {
    console.error("Error fetching site settings:", error.message);
    dispatch({ type: APP_GET_LANGUAGE_FAILURE, error: error.message });
  }
};


// loginUser
export const loginUser = (credentials, callback) => async (dispatch) => {
  // alert(JSON.stringify(credentials.email))
  dispatch({ type: APP_USER_LOGIN_REQUEST });
  try {
    const endpoint = API_REQUESTS.API_LOGIN_URL;
    const response = await sendRequest(endpoint, credentials);
    dispatch({ type: APP_USER_LOGIN_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching Login:", error.message);
    dispatch({ type: APP_USER_LOGIN_FAILURE, error: error.message });
  }
};


// setLanguageSelected
export const setLanguageSelected = (payLoad, callback) => async (dispatch) => {
  // dispatch({ type: APP_USER_LOGIN_REQUEST });
  try {
    const endpoint = API_REQUESTS.API_LANGUAGE_CONTENT_URL;
    const response = await sendRequest(endpoint, { lang: payLoad });
    // alert(JSON.stringify(response, 2, null))
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching LANGUAGE Selected:", error.message);
    // dispatch({ type: APP_USER_LOGIN_FAILURE, error: error.message });
  }
};


export const getCategoryList = (type, page, limit, searchText, callback) => async (dispatch) => {
  const payLoadParams = {
    page: searchText ? null : page,
    limit: searchText ? null : limit,
    search: searchText,
    type: type
  };
  try {
    const endpoint = API_REQUESTS.API_GET_CATEGORY_LIST;
    const response = await sendRequest(endpoint, payLoadParams);
    console.log("dataFetch Success", payLoadParams)
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error fetching CATEGORIES:", error.message);
  }
};

// getSubCategoryList
export const getSubCategoryList = (categoryId, type, page, limit, searchText, callback) => async (dispatch) => {
  const payLoadParams = {
    page: searchText ? null : page,
    limit: searchText ? null : limit,
    search: searchText,
    type: type,
    categoryId: categoryId
  };
  try {
    const endpoint = API_REQUESTS.API_GET_SUB_CATEGORY_LIST;
    const response = await sendRequest(endpoint, payLoadParams);
    console.log("Sub Category dataFetch Success", payLoadParams)
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error fetching CATEGORIES:", error.message);
  }
};

// getSideMenus
export const getSideMenus = (credentials, callback) => async (dispatch) => {
  dispatch({ type: APP_USER_SIDE_MENUS_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_SIDE_MENU_API;
    const response = await sendRequest(endpoint, credentials);
    dispatch({ type: APP_USER_SIDE_MENUS_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching Login:", error.message);
    dispatch({ type: APP_USER_SIDE_MENUS_FAILURE, error: error.message });
  }
};
// getProfileMenuList
export const getProfileMenuList = (credentials, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.GET_PROFILE_MENU_API;
    const response = await sendRequest(endpoint, credentials);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error getProfileMenuList:", error.message);
  }
};
