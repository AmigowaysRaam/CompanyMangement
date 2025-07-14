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
export const getSubcategoryApiiCall = (type, category, callback) => async (dispatch) => {
  const payLoadParams = {
    categoryId: category
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
export const submitCreateForm = (payLoadParams, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_SUBMIT_COMPANY;
    const response = await sendRequest(endpoint, payLoadParams);
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error submitCreateForm:", error.message);
  }
};

// submitCreateSalaryStructureForm
export const submitCreateSalaryStructureForm = (payLoadParams, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_SUBMIT_CREATE_SALARY_COMPANY;
    const response = await sendRequest(endpoint, payLoadParams);
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error submitCreateSalaryStructureForm:", error.message);
  }
};


// updateCreateSalaryStructureForm
export const updateCreateSalaryStructureForm = (payLoadParams, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_UPFDATE_SALARY_COMPANY;
    const response = await sendRequest(endpoint, payLoadParams);
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error updateCreateSalaryStructureForm:", error.message);
  }
};





// updateContactInfo
export const updateContactInfo = (payLoadParams, callback) => async (dispatch) => {
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
export const createNewClient = (payLoadParams, callback) => async (dispatch) => {
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
    console.error("getHomePageData:", error.message);
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

// getSalaryTabMenu

export const getSalaryTabMenu = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_SALARYSTRUCTR_TAB_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompanyData:", error.message);
  }
};


// getRoleList
export const getRoleList = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_MODULE_LIST_DATA_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getRoleList:", error.message);
  }
};


// getAdminById
export const getAdminById = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_ADMIN_BY_ID_DATA_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getRoleList:", error.message);
  }
};



// getRoleListArray

// deleteRoleAccess
export const deleteRoleAccess = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_DELETE_MODULE_ACCESS_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getRoleList:", error.message);
  }
};

// getModuleListArray
export const getModuleListArray = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_MODULE_LIST_ARRAY_DATA_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getModuleListArray:", error.message);
  }
};


// getModuleAccessByIdArray
export const getModuleAccessByIdArray = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_MODULE_LIST_BY_ID_DATA_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getModuleListArray:", error.message);
  }
};


// subMitRoleAccess
export const subMitRoleAccess = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_SUBMIT_ROLES_ACCESS_DATA_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getModuleListArray:", error.message);
  }
};

// updateRoleAccess
export const updateRoleAccess = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_UPDATE_ROLES_ACCESS_DATA_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getModuleListArray:", error.message);
  }
};






// getChatDetails
export const getChatDetails = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_GROUPCHAT_DETAILS_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getChatDetails:", error.message);
  }
};

// getProjectDosc
export const getProjectDosc = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_PROJECT_DOCS_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompanyData:", error.message);
  }
};

export const getTaskList = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_TASK_LIST_DATA_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getTaskList:", error.message);
  }
};


export const createTaskForm = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_CREATE_TASK_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getTaskList:", error.message);
  }
};


// updateTaskForm
export const updateTaskForm = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_UPDATE_TASK_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getTaskList:", error.message);
  }
};










// getTaskDeytails
export const getTaskDeytails = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_TASK_BY_ID_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getTaskList:", error.message);
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

// getEmplDetailById
export const getEmplDetailById = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_EMP_DATA_BY_ID_URL;
    const response = await sendRequest(endpoint, { eId: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompanyData:", error.message);
  }
};

// getEmployeeStepData
export const getEmployeeStepData = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_EMPLOYEE_STEP_DATA_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompanyData:", error.message);
  }
};



// getProjectStepData
export const getProjectStepData = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_PROJECT_STEP_DATA_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getProjectStepData:", error.message);
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

// submitProjectBasicDetails
export const submitProjectBasicDetails = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_FORM_SUBMIT_BY_ID_URL;
    const response = await sendRequest(endpoint, payLoad);
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

// getSalaryStructureList
export const getSalaryStructureList = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_SALARYSTUCTURELIST_CONTENT_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getSalaryStructureList:", error.message);
  }
};

// createDepartment
export const createDepartment = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_CREATE_DEPARTMENT_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createDepartment:", error.message);
  }
};

// updateDepartment
export const updateDepartment = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_UPDATE_DEPARTMENT_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("updateDepartment:", error.message);
  }
};
// deleteDepartment
export const deleteDepartment = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_DELETE_DEPARTMENT_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("updateDepartment:", error.message);
  }
};

// getEmplCategoryList
export const getEmplCategoryList = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_EMPL_LIST_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("updateDepartment:", error.message);
  }
};


// getDepartMentList
export const getDepartMentList = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_DEPARTMENTLIST_CONTENT_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompaniesList:", error.message);
  }
};
// getSalaryStructureById
export const getSalaryStructureById = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_SALARYSTIURCTURE_BY_ID_CONTENT_URL;
    const response = await sendRequest(endpoint, payLoad);
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

// getChatMessages
export const getChatMessages = (payLoad, chatId, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_CHAT_MESSAGES_LIST_URL;
    const response = await sendRequest(endpoint, { senderId: payLoad, chatId: chatId });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getChatListApi:", error.message);
  }
};


// sendChatMessage
export const sendChatMessage = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_SEND_MESSAGES_LIST_URL;
    const response = await sendRequest(endpoint, payLoad);
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

// getAdminList
export const getAdminList = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_ADMIN_ARRAY_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getLeaveArray:", error.message);
  }
};

// deleteAdminAction
export const deleteAdminAction = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_DELETE_ADMIN__URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("deleteAdminAction:", error.message);
  }
};

// getHolidayLIstApi
export const getHolidayLIstApi = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_HOLIDAY_ARRAY_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getLeaveArray:", error.message);
  }
};
// getRequestedLeaveArray
export const getRequestedLeaveArray = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_REQUESTED_LEAVE_ARRAY_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getLeaveArray:", error.message);
  }
};

// updateLeaveStatus
export const updateLeaveStatus = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_UPDATE_LEAVE_ARRAY_URL;
    const response = await sendRequest(endpoint, payLoad);
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

// getCompabyBranches
export const getCompabyBranches = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_BRANHC_BY_COMPANY_SUBMIT_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getCompabyBranches:", error.message);
  }
};


export const getShiftsByCompany = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_SHIFTS_BY_COMPANY_SUBMIT_URL;
    const response = await sendRequest(endpoint, payLoad);
    if (callback) callback(response);
    console.log(response)
    return response;
  } catch (error) {
    console.error("getShiftsByCompany:", error.message);
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
    console.error("getemployeeDetails:", error.message);
    dispatch({ type: APP_EMPLOYEE_TAB_MENU_FAILURE, error: error.message });
  }
};


// getProjectDetailById
export const getProjectDetailById = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_PROJECT_DETAIL_BY_ID_URL;
    const response = await sendRequest(endpoint, { projectId: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getProjectDetailById:", error.message);
  }
};


// projectDocumentSubmit

// getAttendaceData
export const getAttendaceData = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_ATTENDANCE_CONTENT_URL;
    const response = await sendRequest(endpoint, { userid: payLoad });
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getAttendaceData:", error.message);
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


export const getProjectsStatsById = (payLoad, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_GET_PROJECT_STATS_BY_ID_CONTENT_URL;
    const response = await sendRequest(endpoint,payLoad);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getProjectsStats:", error.message);
  }
};


// deleteProjectById
export const deleteProjectById = (payLoad, uId, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_PROJECT_DELETE_URL;
    const response = await sendRequest(endpoint, { projectId: payLoad, userId: uId });
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
    // dispatch({ type: APP_USER_LOGIN_SUCCESS, payload: response });
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
    formData.append('role', payLoad.role_id);
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
export const getUploaddata = (userId, fileName, fileData, callback) => async (dispatch) => {
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

// projectDocumentSubmit
export const projectDocumentSubmit = (formData, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_PROJECT_DOCUMENT_UPLOAD_DTA.url;
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

export const createProjectForm = (values, userdata, callback) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('projectName', values.projectName);
    formData.append('company', values.company);
    formData.append('client', values.client);
    formData.append('startDate', values.startDate.toISOString());
    formData.append('endDate', values.endDate.toISOString());
    formData.append('status', values.status);
    formData.append('luser', userdata);
    formData.append('description', values.description);
    formData.append('teamMembers', values.employee);
    formData.append('projectAdmins', values.admin);

    // if (Array.isArray(values.files)) {
    //   formData.append('files', JSON.stringify(values.files));
    // }
    // if (Array.isArray(values.files)) {
    //   values.files.forEach((file, idx) => {
    //     if (file?.uri) {
    //       formData.append('files', {
    //         uri: file.uri,
    //         type: file.type || 'application/octet-stream',
    //         name: file.name || `file_${idx}`,
    //       });
    //     }
    //   });
    // }

    const endpoint = API_REQUESTS.API_CREATE_PROJECT_URL.url;
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (callback) callback(data);

    return data;
  } catch (error) {
    console.error("createProjectForm:", error.message);
  }
};


export const updateProjectForm = (values, pId, userdata, callback) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append('projectName', values.projectName);
    formData.append('company', values.company);
    formData.append('client', values.client);
    formData.append('startDate', values.startDate.toISOString());
    formData.append('endDate', values.endDate.toISOString());
    formData.append('status', values.status);
    formData.append('luser', userdata);
    formData.append('description', values.description);
    formData.append('projectId', pId || '');
    // if (Array.isArray(values.files)) {
    //   values.files.forEach((file, idx) => {
    //     if (file?.uri) {
    //       formData.append('files', {
    //         uri: file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`,
    //         type: file.type || 'application/octet-stream',
    //         name: file.name || `file_${idx}`, 
    //       });
    //     }
    //   });
    // }

    formData.append('teamMembers', values.employee);
    formData.append('projectAdmins', values.admin);
    const endpoint = API_REQUESTS.API_UPDATE_CREATE_PROJECT_URL.url;
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(`Server error: ${response.status}`);
    }
    const data = await response.json();
    if (callback) callback(data);
    return data;
  } catch (error) {
    console.error("UPDATE PROJECT:", error.message);
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
export const createSubCatgoryForm = (formFields, callback) => async (dispatch) => {
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
export const updateSubCatgoryForm = (formFields, callback) => async (dispatch) => {
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

export const updateProjectCost = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_UPDATE_CREATE_PROJECT_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createSubCatgoryForm:", error.message);
  }
};


export const removeParticipant = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_PROJECT_REMOVE_USER_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createSubCatgoryForm:", error.message);
  }
};

// updateParticipants
export const updateParticipants = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_UPDATE_PROJECT_USER_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createSubCatgoryForm:", error.message);
  }
};


// getTaskAssignedArray
export const getTaskAssignedArray = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_GET_ASSIGNED_TASK_USER_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createSubCatgoryForm:", error.message);
  }
};

// changeTaskStatus
export const changeTaskStatus = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_TASK_STATUS_TASK_USER_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createSubCatgoryForm:", error.message);
  }
};

// mob-socialplatforms
// getSocialMediasArray
export const getSocialMediasArray = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_USER_SOCIAL_MEDIA_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getSocialMediasArray:", error.message);
  }
};


export const updatrProfilePic = (formData, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.USER_UPDATE_PRO_PIC.url;
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.success) {
      dispatch({ type: APP_USER_LOGIN_SUCCESS, payload: data });
    }

    if (callback) callback(data);
    return data;
  } catch (error) {
    console.error("updatrProfilePic:", error.message);
  }
};



export const bottomNavigation = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_BTTOM_NAVIGATION_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("bottomNavigation:", error.message);
  }
};


export const getProjectsListPagination = (uId, page, limit, searchText, callback) => async (dispatch) => {
  const payLoadParams = {
    page: searchText ? null : page,
    limit: searchText ? null : limit,
    search: searchText,
    userid: uId,
  };
  try {
    const endpoint = API_REQUESTS.API_GET_PROJECT_STATS_CONTENT_URL;
    const response = await sendRequest(endpoint, payLoadParams);
    console.log("dataFetch Success", response)
    if (callback) callback(response); // ✅ Check if callback exists before calling
    return response;
  } catch (error) {
    console.error("Error fetching getProjectsListPagination:", error.message);
  }
};


// createNewEmp
export const createNewEmp = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_GET_CREATE_EMP_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createNewEmp:", error.message);
  }
};


// createPosition
export const createPosition = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_CREATE_EMP_POSTION_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createPosition:", error.message);
  }
};

// updatePosition
export const updatePosition = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_UPDATE_EMP_POSTION_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createPosition:", error.message);
  }
};

// deletePositionArr
export const deletePositionArr = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_DELETE_EMP_POSTION_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createPosition:", error.message);
  }
};


// createHolidayApi
export const createHolidayApi = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_CREATE_HOLIDAY_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createPosition:", error.message);
  }
};

// updateHolidayForm
export const updateHolidayForm = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_UPDATE_HOLIDAY_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createPosition:", error.message);
  }
};


// deleteHolidayApi
export const deleteHolidayApi = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_DELETE_HOLIDAY_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("deleteHolidayApi:", error.message);
  }
};


// getShiftsListing
export const getShiftsListing = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_SHIFTS_LISTING_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("getShiftsListing:", error.message);
  }
};



// genearteOverAllPayroll
export const genearteOverAllPayroll = (formFields, callback) => async (dispatch) => {
  // alert(JSON.stringify(payLoad))
  try {
    const endpoint = API_REQUESTS.API_GET_GENARTRE_PAYROLL_URL;
    const response = await sendRequest(endpoint, formFields);
    if (callback) callback(response);
    return response;
  } catch (error) {
    console.error("createPosition:", error.message);
  }
};
// /

export const createAdminApi = (formData, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_CREATE_ADMIN_URL.url;
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (callback) callback(data);
    return data;
  } catch (error) {
    console.error("updatrProfilePic:", error.message);
  }
};

// updateAdminDetails
export const updateAdminDetails = (formData, callback) => async (dispatch) => {
  try {
    const endpoint = API_REQUESTS.API_UPDATE_ADMIN_URL.url;
    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (callback) callback(data);
    return data;
  } catch (error) {
    console.error("updatrProfilePic:", error.message);
  }
};