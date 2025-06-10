const BASE_URL = "https://amigo.scriptzol.in/";


export const API_BASE_URL = `${BASE_URL}api/?url=`;
/* ******  Authentication APIs Start ****** */
const APP_GENERATE_TOKEN = {
  url: `${API_BASE_URL}generate-token`,
  method: "POST",
  responseDataKey: "data",
};

// API_SITE_URL
const API_SITE_URL = {
  url: `${API_BASE_URL}mob-getsitesettings`,
  method: "POST",
  responseDataKey: "data",
};

// API_LANGUAGE_URL
const API_LANGUAGE_URL = {
  url: `${API_BASE_URL}mob-languages`,
  method: "POST",
  responseDataKey: "data",
};

// API_LOGIN_URL
const API_LOGIN_URL = {
  url: `${API_BASE_URL}mob-employee-login`,
  method: "POST",
  responseDataKey: "data",
};

// API_LANGUAGE_CONTENT_URL
const API_LANGUAGE_CONTENT_URL = {
  url: `${API_BASE_URL}mob-language-content`,
  method: "POST",
  responseDataKey: "data",
};
// API_GET_CATEGORY_LIST
const API_GET_CATEGORY_LIST = {
  url: `${API_BASE_URL}mob-getcategories`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_SUB_CATEGORY_LIST
const API_GET_SUB_CATEGORY_LIST = {
  url: `${API_BASE_URL}mob-getsubcategories`,
  method: "POST",
  responseDataKey: "data",
};
// GET_SIDE_MENU_API
const GET_SIDE_MENU_API = {
  url: `${API_BASE_URL}mob-getsidebarmenu`,
  method: "POST",
  responseDataKey: "data",
};
// GET_PROFILE_MENU_API
const GET_PROFILE_MENU_API = {
  url: `${API_BASE_URL}mob-profilemenu`,
  method: "POST",
  responseDataKey: "data",
};
// API_HOME_SCREEN_CONTENT_URL
const API_HOME_SCREEN_CONTENT_URL = {
  url: `${API_BASE_URL}mob-dashboard`,
  method: "POST",
  responseDataKey: "data",
};

// GET_EMPLOYEE_DETAILS_API
const GET_EMPLOYEE_DETAILS_API = {
  url: `${API_BASE_URL}mob-getemployee-details`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_USER_DETAILS_URL
const API_GET_USER_DETAILS_URL = {
  url: `${API_BASE_URL}mob-getuser-details`,
  method: "POST",
  responseDataKey: "data",
};
// API_UPDATE_USER_DETAILS_URL
const API_UPDATE_USER_DETAILS_URL = {
  url: `${API_BASE_URL}mob-update-employee`,
  method: "POST",
  responseDataKey: "data",
};
// API_EMPLOYEE_CONTENT_URL
const API_EMPLOYEE_CONTENT_URL = {
  url: `${API_BASE_URL}mob-getallemployees`,
  method: "POST",
  responseDataKey: "data",
};
// API_ATTENDANCE_CONTENT_URL
const API_ATTENDANCE_CONTENT_URL = {
  url: `${API_BASE_URL}mob-getattendance`,
  method: "POST",
  responseDataKey: "data",
};

// API_MOBILE_OTP
const API_MOBILE_OTP = {
  url: `${API_BASE_URL}mob-employee-generate-mpin`,
  method: "POST",
  responseDataKey: "data",
};

// API_SET_MPIN
const API_SET_MPIN = {
  url: `${API_BASE_URL}mob-employee-set-mpin`,
  method: "POST",
  responseDataKey: "data",
};

// API__MPIN_LOGIN_URL
const API__MPIN_LOGIN_URL = {
  url: `${API_BASE_URL}mob-employee-login-mpin`,
  method: "POST",
  responseDataKey: "data",
};

// API_MOBILE_CHECK
const API_MOBILE_CHECK = {
  url: `${API_BASE_URL}mob-number-check`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_SETTINGS_MENU_URL
const API_GET_SETTINGS_MENU_URL = {
  url: `${API_BASE_URL}mob-settings`,
  method: "POST",
  responseDataKey: "data",
};
// API_RESETMPIN_URL
const API_RESETMPIN_URL = {
  url: `${API_BASE_URL}mob-employee-change-mpin`,
  method: "POST",
  responseDataKey: "data",
};
// API_CHANGE_NOTIFICATION_URL
const API_CHANGE_NOTIFICATION_URL = {
  url: `${API_BASE_URL}mob-user-notification`,
  method: "POST",
  responseDataKey: "data",
};
// API_CHANGE_PASSCODE_URL
const API_CHANGE_PASSCODE_URL = {
  url: `${API_BASE_URL}mob-change-password`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_PAYROLL_LIST
const API_GET_PAYROLL_LIST = {
  url: `${API_BASE_URL}mob-getpayroll`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_EMPLOYEE_LIST
const API_GET_EMPLOYEE_LIST = {
  url: `${API_BASE_URL}mob-get-Employees`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_EMPLOYEE_PAYROLL_LIST
const API_GET_EMPLOYEE_PAYROLL_LIST = {
  url: `${API_BASE_URL}mob-get-payrollactivities`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_PROJECT_STATS_CONTENT_URL
const API_GET_PROJECT_STATS_CONTENT_URL = {
  url: `${API_BASE_URL}mob-getprojects`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_JOB_DETAILS_URL
const API_GET_JOB_DETAILS_URL = {
  url: `${API_BASE_URL}mob-job-details`,
  method: "POST",
  responseDataKey: "data",
};
// API_GET_CLINET_DATA_URL
const API_GET_CLINET_DATA_URL = {
  url: `${API_BASE_URL}mob-client-details`,
  method: "POST",
  responseDataKey: "data",
};

// API_CREATE_EMPLOYEE_URL
const API_CREATE_EMPLOYEE_URL = {
  url: `${API_BASE_URL}mob-create-employee`,
  method: "POST",
  responseDataKey: "data",
};

// API_CREATE_PUNCH_IN_OUT_URL
const API_CREATE_PUNCH_IN_OUT_URL = {
  url: `${API_BASE_URL}mob-attendance-punchin-out`,
  method: "POST",
  responseDataKey: "data",
};
// API_GET_PUNCH_IN_OUT_HISTORY_URL
const API_GET_PUNCH_IN_OUT_HISTORY_URL = {
  url: `${API_BASE_URL}mob-get-attaendance-records`,
  method: "POST",
  responseDataKey: "data",
};

// API_LEAVE_FORM_SUBMIT_URL
const API_LEAVE_FORM_SUBMIT_URL = {
  url: `${API_BASE_URL}addleave`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_LEAVE_ARRAY_URL
const API_GET_LEAVE_ARRAY_URL = {
  url: `${API_BASE_URL}getleavebyemployee`,
  method: "POST",
  responseDataKey: "data",
};

// API_APP_PUNCHED_URL
const API_APP_PUNCHED_URL = {
  url: `${API_BASE_URL}mob-is-punched-in`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_LOGIN_HISTOY_LIST
const API_GET_LOGIN_HISTOY_LIST = {
  url: `${API_BASE_URL}mob-attendance-records`,
  method: "POST",
  responseDataKey: "data",
};


export default {
  APP_GENERATE_TOKEN,
  API_SITE_URL, API_LANGUAGE_URL, API_LOGIN_URL, API_LANGUAGE_CONTENT_URL,
  API_GET_CATEGORY_LIST, API_GET_SUB_CATEGORY_LIST, GET_SIDE_MENU_API,
  GET_PROFILE_MENU_API, API_MOBILE_CHECK, API_GET_SETTINGS_MENU_URL,
  API_HOME_SCREEN_CONTENT_URL, GET_EMPLOYEE_DETAILS_API, API_GET_USER_DETAILS_URL, API_UPDATE_USER_DETAILS_URL,
  API_EMPLOYEE_CONTENT_URL, API_ATTENDANCE_CONTENT_URL, API_MOBILE_OTP, API_SET_MPIN, API__MPIN_LOGIN_URL,
  API_RESETMPIN_URL, API_CHANGE_NOTIFICATION_URL, API_CHANGE_PASSCODE_URL, API_GET_PAYROLL_LIST,
  API_GET_EMPLOYEE_LIST, API_GET_EMPLOYEE_PAYROLL_LIST, API_GET_PROJECT_STATS_CONTENT_URL, API_GET_JOB_DETAILS_URL, API_GET_CLINET_DATA_URL,
  API_CREATE_EMPLOYEE_URL, API_CREATE_PUNCH_IN_OUT_URL, API_GET_PUNCH_IN_OUT_HISTORY_URL,
  API_LEAVE_FORM_SUBMIT_URL,API_GET_LEAVE_ARRAY_URL,
  API_APP_PUNCHED_URL,API_GET_LOGIN_HISTOY_LIST
};
