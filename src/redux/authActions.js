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


  APP_USER_HOMEPAGE_REQUEST,
  APP_USER_HOMEPAGE_SUCCESS,
  APP_USER_HOMEPAGE_FAILURE,


  APP_TAB_MENU_REQUEST,
  APP_TAB_MENU_SUCCESS,
  APP_TAB_MENU_FAILURE,


  APP_EMPLOYEE_TAB_MENU_REQUEST,
  APP_EMPLOYEE_TAB_MENU_SUCCESS,
  APP_EMPLOYEE_TAB_MENU_FAILURE,


  APP_LANGUAGE_LIST_REQUEST,
  APP_LANGUAGE_LIST_SUCCESS,
  APP_LANGUAGE_LIST_FAILURE,


  APP_GET_SETTINGS_MENU_REQUEST,
  APP_GET_SETTINGS_MENU_SUCCESS,
  APP_GET_SETTINGS_MENU_FAILURE,

  APP_GET_PUNCHED_REQUEST,
  APP_GET_PUNCHED_SUCCESS,
  APP_GET_PUNCHED_FAILURE,

} from "./actionsTypes";
import API_REQUESTS from "../api/api-end-points";


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

// getSettingMenus
export const getSettingMenus = (userdata, callback) => async (dispatch) => {
  dispatch({ type: APP_GET_SETTINGS_MENU_REQUEST });
  try {
    const endpoint = API_REQUESTS.API_GET_SETTINGS_MENU_URL;
    const response = await sendRequest(endpoint, { userid: userdata });
    dispatch({ type: APP_GET_SETTINGS_MENU_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching APP_GET_SETTINGS_MENU_FAILUREs:", error.message);
    dispatch({ type: APP_GET_SETTINGS_MENU_FAILURE, error: error.message });
  }
};


// getCLinetData
export const getCLinetData = (userdata, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_CLINET_DATA_URL;
    const response = await sendRequest(endpoint, { userid: userdata });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching getCLinetData:", error.message);
  }
};

// updateClientDetails
export const updateClientDetails = (officeLocations, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_UPDATE_CLIENT__DATA_URL;
    const response = await sendRequest(endpoint, officeLocations);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching UpdateClientDetails:", error.message);
  }
};



// getJobDetailsArr
export const getJobDetailsArr = (userdata, callback) => async (dispatch) => {
  dispatch({ type: APP_GET_SETTINGS_MENU_REQUEST });
  try {
    const endpoint = API_REQUESTS.API_GET_JOB_DETAILS_URL;
    const response = await sendRequest(endpoint, { userid: userdata });
    dispatch({ type: APP_GET_SETTINGS_MENU_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching getJobDetailsArr:", error.message);
    dispatch({ type: APP_GET_SETTINGS_MENU_FAILURE, error: error.message });
  }
};




// changeNoftificationStatus
export const changeNoftificationStatus = (userdata, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_CHANGE_NOTIFICATION_URL;
    const response = await sendRequest(endpoint, userdata);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching ChangeNoftificationStatus:", error.message);
  }
};

// loginUser
export const loginUser = (credentials, callback) => async (dispatch) => {
  // alert(JSON.stringify(credentials, null, 2))

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


// loginWithMpin
export const loginWithMpin = (credentials, callback) => async (dispatch) => {
  // dispatch({ type: APP_USER_LOGIN_REQUEST });
  try {
    const endpoint = API_REQUESTS.API__MPIN_LOGIN_URL;
    const response = await sendRequest(endpoint, credentials);
    // alert(JSON.stringify(response.success))
    if (response.success) {
      dispatch({ type: APP_USER_LOGIN_SUCCESS, payload: response });
    }
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching Login:", error.message);
    // dispatch({ type: APP_USER_LOGIN_FAILURE, error: error.message });
  }
};


export const setLanguageSelected = (payLoad, callback) => async (dispatch) => {
  // dispatch({ type: APP_LANGUAGE_LIST_REQUEST });
  try {
    const endpoint = API_REQUESTS.API_LANGUAGE_CONTENT_URL;
    const response = await sendRequest(endpoint, { lang: payLoad });
    // alert(JSON.stringify(response, 2, null))
    // dispatch({ type: APP_LANGUAGE_LIST_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error fetching LANGUAGE Selected:", error.message);
    // dispatch({ type: APP_LANGUAGE_LIST_FAILURE, error: error.message });
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

// getSubcategoryApiiCall
export const getSubcategoryApiiCall = (type, category ,callback) => async (dispatch) => {
  const payLoadParams = {
    categoryId:category
  };

  try {
    const endpoint = API_REQUESTS.API_GET_SUB_CATEGORY_LIST_ARR;
    const response = await sendRequest(endpoint, payLoadParams);
    // console.log("dataFetch Success", payLoadParams)
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error fetching CATEGORIES:", error.message);
  }
};

// submitCreateForm
export const submitCreateForm = (payLoadParams ,callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_SUBMIT_COMPANY;
    const response = await sendRequest(endpoint, payLoadParams);
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error submitCreateForm:", error.message);
  }
};

// updateContactInfo
export const updateContactInfo = (payLoadParams ,callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_UPDATE_CONTACT_SUBMIT_COMPANY;
    const response = await sendRequest(endpoint, payLoadParams);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error UpdateContactInfo:", error.message);
  }
};

// createNewClient
export const createNewClient = (payLoadParams ,callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_CREATE_CLIENT_COMPANY;
    const response = await sendRequest(endpoint, payLoadParams);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error UpdateContactInfo:", error.message);
  }
};


// getPayRollHistory
export const getPayRollHistory = (uId, employId, page, limit, searchText, callback) => async (dispatch) => {
  const payLoadParams = {
    page: searchText ? null : page,
    limit: searchText ? null : limit,
    search: searchText,
    userid: uId,
    employId: employId
  };
  try {
    const endpoint = API_REQUESTS.API_GET_PAYROLL_LIST;
    const response = await sendRequest(endpoint, payLoadParams);
    console.log("dataFetch Success", response)
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error fetching CATEGORIES:", error.message);
  }
};

// getEmployeeList
export const getEmployeeList = (uId, page, limit, searchText, callback) => async (dispatch) => {
  const payLoadParams = {
    page: searchText ? null : page,
    limit: searchText ? null : limit,
    search: searchText,
    userid: uId,
  };
  try {
    const endpoint = API_REQUESTS.API_GET_EMPLOYEE_LIST;
    const response = await sendRequest(endpoint, payLoadParams);
    console.log("dataFetch Success", response)
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error fetching CATEGORIES:", error.message);
  }
};

// getHistoryApiCall
export const getHistoryApiCall = (uId, page, limit, searchText, callback) => async (dispatch) => {
  const payLoadParams = {
    page: searchText ? null : page,
    limit: searchText ? null : limit,
    search: searchText,
    userId: uId,
  };
  try {
    const endpoint = API_REQUESTS.API_GET_LOGIN_HISTOY_LIST;
    const response = await sendRequest(endpoint, payLoadParams);
    console.log("getHistoryApiCall Success", response)
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error fetching CATEGORIES:", error.message);
  }
};

// getPayrollActivitites
export const getPayrollActivitites = (uId, page, limit, searchText, callback) => async (dispatch) => {
  const payLoadParams = {
    page: searchText ? null : page,
    limit: searchText ? null : limit,
    search: searchText,
    userid: uId,
  };
  try {
    const endpoint = API_REQUESTS.API_GET_EMPLOYEE_PAYROLL_LIST;
    const response = await sendRequest(endpoint, payLoadParams);
    console.log("dataFetch Success", response)
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
  dispatch({ type: APP_TAB_MENU_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_PROFILE_MENU_API;
    const response = await sendRequest(endpoint, credentials);
    dispatch({ type: APP_TAB_MENU_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error APP_TAB_MENU_FAILURE:", error.message);
    dispatch({ type: APP_TAB_MENU_FAILURE, error: error.message });

  }
};

// getProfileDetailsById
export const getEmplyeeDetails = (credentials, callback) => async (dispatch) => {
  // dispatch({ type: APP_TAB_MENU_REQUEST });
  try {
    const endpoint = API_REQUESTS.GET_EMPLOYEE_DETAILS_API;
    const response = await sendRequest(endpoint, { employeeId: credentials });
    // dispatch({ type: APP_TAB_MENU_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("Error getProfileDetailsById:", error.message);
    // dispatch({ type: APP_TAB_MENU_FAILURE, error: error.message });

  }
};


// getHomePageData

export const getHomePageData = (payLoad, callback) => async (dispatch) => {
  dispatch({ type: APP_USER_HOMEPAGE_REQUEST });
  try {
    const endpoint = API_REQUESTS.API_HOME_SCREEN_CONTENT_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    dispatch({ type: APP_USER_HOMEPAGE_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("APP_USER_HOMEPAGE_FAILURE:", error.message);
    dispatch({ type: APP_USER_HOMEPAGE_FAILURE, error: error.message });
  }
};
// getCompanyData
export const getCompanyData = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_COMPANY_DATA_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompanyData:", error.message);
  }
};

// getClientData
export const getClientStepData = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_CLIENT_STEP_DATA_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompanyData:", error.message);
  }
};


// getCompanyDetailById
export const getCompanyDetailById = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_COMPANY_DATA_BY_ID_URL;
    const response = await sendRequest(endpoint, { companyId: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompanyDetailById:", error.message);
  }
};

// getClientDetailById
export const getClientDetailById = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_CLIENT_DATA_BY_ID_URL;
    const response = await sendRequest(endpoint, { clientId: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("GetClientDetailById:", error.message);
  }
};

// getCompaniesList
export const getCompaniesList = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_COMPANYLIST_CONTENT_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompaniesList:", error.message);
  }
};
// getCategoryList
export const getCategoryListCall = (payLoad, callback) => async (dispatch) => {
  // dispatch({ type: APP_USER_HOMEPAGE_REQUEST });
  try {
    const endpoint = API_REQUESTS.APIGET_CATEGORY_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    // dispatch({ type: APP_USER_HOMEPAGE_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCategoryList:", error.message);
    // dispatch({ type: APP_USER_HOMEPAGE_FAILURE, error: error.message });
  }
};

// getFilesdata

export const getFilesdata = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_FILES_DATA_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getFilesdata:", error.message);
  }
};


// getChatListApi

export const getChatListApi = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_CHAT_LIST_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getChatListApi:", error.message);
  }
};

// getLeaveArray
export const getLeaveArray = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_LEAVE_ARRAY_URL;
    const response = await sendRequest(endpoint, { employeeId: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getLeaveArray:", error.message);
  }
};

// levaeFormSubmit
export const levaeFormSubmit = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_LEAVE_FORM_SUBMIT_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("levaeFormSubmit:", error.message);
  }
};



// create-punch
export const punchInOutApi = (payLoad, type, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_CREATE_PUNCH_IN_OUT_URL;
    const response = await sendRequest(endpoint, { userId: payLoad, type: type });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("punchInOutApi:", error.message);
  }
};

// getPunchinOutHistory
export const getPunchinOutHistory = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_PUNCH_IN_OUT_HISTORY_URL;
    const response = await sendRequest(endpoint, { userId: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("punchInOutApi:", error.message);
  }
};


// APP_GET_PUNCHED_REQUEST,
// APP_GET_PUNCHED_SUCCESS,
// APP_GET_PUNCHED_FAILURE,


// getPunchinOut
export const getPunchinOut = (payLoad, callback) => async (dispatch) => {
  dispatch({ type: APP_GET_PUNCHED_REQUEST });
  try {
    const endpoint = API_REQUESTS.API_APP_PUNCHED_URL;
    const response = await sendRequest(endpoint, { userId: payLoad });
    dispatch({ type: APP_GET_PUNCHED_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("APP_GET_PUNCHED_FAILURE:", error.message);
    dispatch({ type: APP_GET_PUNCHED_FAILURE, error: error.message });
  }
};







// getemployeeDetails
export const getemployeeDetails = (payLoad, callback) => async (dispatch) => {
  dispatch({ type: APP_EMPLOYEE_TAB_MENU_REQUEST });
  // alert(payLoad)
  try {
    const endpoint = API_REQUESTS.API_EMPLOYEE_CONTENT_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    dispatch({ type: APP_EMPLOYEE_TAB_MENU_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("APP_USER_HOMEPAGE_FAILURE:", error.message);
    dispatch({ type: APP_EMPLOYEE_TAB_MENU_FAILURE, error: error.message });
  }
};


// getAttendaceData
export const getAttendaceData = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_ATTENDANCE_CONTENT_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("APP_USER_HOMEPAGE_FAILURE:", error.message);
  }
};

// getProjectsStats
export const getProjectsStats = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_PROJECT_STATS_CONTENT_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getProjectsStats:", error.message);
  }
};










// getOtpByMobilenumber
export const getOtpByMobilenumber = (payLoad, callback) => async (dispatch) => {
  // dispatch({ type: APP_EMPLOYEE_TAB_MENU_REQUEST });
  // alert(payLoad)
  try {
    const endpoint = API_REQUESTS.API_MOBILE_OTP;
    const response = await sendRequest(endpoint, payLoad);
    // dispatch({ type: APP_EMPLOYEE_TAB_MENU_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getOtpByMobilenumber:", error.message);
    // dispatch({ type: APP_EMPLOYEE_TAB_MENU_FAILURE, error: error.message });
  }
};


// checkValidMobileNumber
export const checkValidMobileNumber = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_MOBILE_CHECK;
    const response = await sendRequest(endpoint, { phone: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("checkValidMobileNumber:", error.message);
  }
};


// setMpinCall
export const setMpinCall = (payLoad, callback) => async (dispatch) => {
  // alert(payLoad)
  try {
    const endpoint = API_REQUESTS.API_SET_MPIN;
    const response = await sendRequest(endpoint, payLoad);
    dispatch({ type: APP_USER_LOGIN_SUCCESS, payload: response });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getOtpByMobilenumber:", error.message);
  }
};



// getProfileDetailsById
export const getProfileDetailsById = (payLoad, callback) => async (dispatch) => {
  // dispatch({ type: APP_USER_HOMEPAGE_REQUEST });
  try {
    const endpoint = API_REQUESTS.API_GET_USER_DETAILS_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    // dispatch({ type: APP_USER_HOMEPAGE_SUCCESS, payload: response });
    // alert(JSON.stringify(response))
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getProfileDetailsById:", error.message);
    // dispatch({ type: APP_USER_HOMEPAGE_FAILURE, error: error.message });
  }
};

// changeMpinCall
export const changeMpinCall = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_RESETMPIN_URL;
    const response = await sendRequest(endpoint, payLoad);
    // alert(JSON.stringify(response))
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("changeMpinCall:", error.message);
  }
};

// ChangePasswordApiCall
export const changePasswordApiCall = (payLoad, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_CHANGE_PASSCODE_URL;
    const response = await sendRequest(endpoint, payLoad);
    // alert(JSON.stringify(response))
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("changeMpinCall:", error.message);
  }
};



export const updateFormSubmit = (userId, payLoad, callback) => async (dispatch) => {

  try {
    const endpoint = API_REQUESTS.API_UPDATE_USER_DETAILS_URL.url;
    // Create FormData and hardcode each field
    const formData = new FormData();
    formData.append('full_name', payLoad.fullname);
    formData.append('username', payLoad.username);
    formData.append('designation', payLoad.designation);
    formData.append('dob', payLoad.dob);
    formData.append('email', payLoad.email);
    formData.append('phone', payLoad.phone);
    formData.append('employeeId', userId);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    // alert(JSON.stringify(data.success))
    if (data.success) {
      dispatch({ type: APP_USER_LOGIN_SUCCESS, payload: data });
    }
    if (callback) callback(data);
    return data;
  } catch (error) {
    console.error("updateFormSubmit:", error.message);
    dispatch({ type: APP_USER_LOGIN_FAILURE, error: error.message });
  }
};

// createEmployeeCall
export const createEmployeeCall = (userId, payLoad, callback) => async (dispatch) => {

  try {

    const endpoint = API_REQUESTS.API_CREATE_EMPLOYEE_URL.url;
    const formData = new FormData();
    formData.append('full_name', payLoad.fullname);
    formData.append('username', payLoad.username);
    formData.append('designation', payLoad.designation);
    formData.append('dob', payLoad.dob);
    formData.append('email', payLoad.email);
    formData.append('phone', payLoad.phone);
    formData.append('userid', userId);
    formData.append('password', "password");
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (callback) callback(data);
    return data;
  } catch (error) {
    console.error("createEmployeeCallApi:", error.message);
  }
};


// getUploaddata
export const getUploaddata = (userId, fileName,fileData, callback) => async (dispatch) => {

  try {
    

    const endpoint = API_REQUESTS.API_UPLOAD_DTA.url;
    const formData = new FormData();
    formData.append('folderName', fileName);
    formData.append('file', fileData);
    formData.append('userid', userId);
    const response = await fetch(endpoint, { 
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (callback) callback(data);
    return data;
  } catch (error) {
    console.error("getUploaddata:", error.message);
  }
};




















// generatePayroll
export const generatePayroll = (userid, parollFile, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_GENERATE_PAYROLL_URL;
    const response = await sendRequest(endpoint, {
      employeeId: userid,
      month: parollFile.month,
      year: parollFile.year
    });
    // alert(JSON.stringify(response))
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("generatePayroll:", error.message);
  }
};

// createSubCatgoryForm
export const createSubCatgoryForm = ( formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_CRETE_CATYEGORY_URL;
    const response = await sendRequest(endpoint, formFields);
    // alert(JSON.stringify(response))
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createSubCatgoryForm:", error.message);
  }
};
// updateSubCatgoryForm
export const updateSubCatgoryForm = ( formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_UPDATE_CATYEGORY_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createSubCatgoryForm:", error.message);
  }
};