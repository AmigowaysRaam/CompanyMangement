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
// API_GENERATE_PAYROLL_URL
const API_GENERATE_PAYROLL_URL = {
  url: `${API_BASE_URL}generate-payroll`,
  method: "POST",
  responseDataKey: "data",
};
// API_GET_CHAT_LIST_URL
const API_GET_CHAT_LIST_URL = {
  url: `${API_BASE_URL}mob-chats`,
  method: "POST",
  responseDataKey: "data",
};

// API_FILES_DATA_URL
const API_FILES_DATA_URL = {
  url: `${API_BASE_URL}get-files`,
  method: "POST",
  responseDataKey: "data",
};

// API_UPLOAD_DTA
const API_UPLOAD_DTA = {
  url: `${API_BASE_URL}file-upload`,
  method: "POST",
  responseDataKey: "data",
};

// APIGET_CATEGORY_URL
const APIGET_CATEGORY_URL = {
  url: `${API_BASE_URL}getcategories`,
  method: "POST",
  responseDataKey: "data",
};

// API_CRETE_CATYEGORY_URL
const API_CRETE_CATYEGORY_URL = {
  url: `${API_BASE_URL}mob-create-category`,
  method: "POST",
  responseDataKey: "data",
};

// API_UPDATE_CATYEGORY_URL
const API_UPDATE_CATYEGORY_URL = {
  url: `${API_BASE_URL}mob-update-category`,
  method: "POST",
  responseDataKey: "data",
};
// API_GET_COMPANYLIST_CONTENT_URL
const API_GET_COMPANYLIST_CONTENT_URL = {
  url: `${API_BASE_URL}mob-get-companies`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_COMPANY_DATA_URL
const API_GET_COMPANY_DATA_URL = {
  url: `${API_BASE_URL}mob-company-tabs`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_SUB_CATEGORY_LIST_ARR
const API_GET_SUB_CATEGORY_LIST_ARR = {
  url: `${API_BASE_URL}mob-get-subcategories`,
  method: "POST",
  responseDataKey: "data",
};

// API_SUBMIT_COMPANY
const API_SUBMIT_COMPANY = {
  url: `${API_BASE_URL}mob-create-company`,
  method: "POST",
  responseDataKey: "data",
};

// API_UPDATE_CONTACT_SUBMIT_COMPANY
const API_UPDATE_CONTACT_SUBMIT_COMPANY = {
  url: `${API_BASE_URL}mob-update-company`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_COMPANY_DATA_BY_ID_URL
const API_GET_COMPANY_DATA_BY_ID_URL = {
  url: `${API_BASE_URL}mob-companies`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_CLIENT_STEP_DATA_URL
const API_GET_CLIENT_STEP_DATA_URL = {
  url: `${API_BASE_URL}mob-clients-tabs`,
  method: "POST",
  responseDataKey: "data",
};

// API_CREATE_CLIENT_COMPANY
const API_CREATE_CLIENT_COMPANY = {
  url: `${API_BASE_URL}mob-create-clients`,
  method: "POST",
  responseDataKey: "data",
};

// API_UPDATE_CLIENT__DATA_URL
const API_UPDATE_CLIENT__DATA_URL = {
  url: `${API_BASE_URL}mob-update-client`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_CLIENT_DATA_BY_ID_URL
const API_GET_CLIENT_DATA_BY_ID_URL = {
  url: `${API_BASE_URL}mob-get-client`,
  method: "POST",
  responseDataKey: "data",
};

const API_CREATE_PROJECT_URL = {
  url: `${API_BASE_URL}mob-create-projects`,
  method: "POST",
  responseDataKey: "data",
};


// API_GET_PROJECT_DETAIL_BY_ID_URL
const API_GET_PROJECT_DETAIL_BY_ID_URL = {
  url: `${API_BASE_URL}mob-get-project`,
  method: "POST",
  responseDataKey: "data",
};
// API_UPDATE_CREATE_PROJECT_URL
const API_UPDATE_CREATE_PROJECT_URL = {
  url: `${API_BASE_URL}mob-update-ProjectCostForm`,
  method: "POST",
  responseDataKey: "data",
};

// API_PROJECT_DELETE_URL

const API_PROJECT_DELETE_URL = {
  url: `${API_BASE_URL}mob-delete-project`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_CHAT_MESSAGES_LIST_URL
const API_GET_CHAT_MESSAGES_LIST_URL = {
  url: `${API_BASE_URL}mob-chat-details`,
  method: "POST",
  responseDataKey: "data",
};

// API_UPDATE_PROJECT_DETAILS_URL
const API_UPDATE_PROJECT_DETAILS_URL = {
  url: `${API_BASE_URL}mob-update-project`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_TASK_LIST_DATA_URL
const API_GET_TASK_LIST_DATA_URL = {
  url: `${API_BASE_URL}mob-gettasks`,
  method: "POST",
  responseDataKey: "data",
};

// API_CREATE_TASK_URL
const API_CREATE_TASK_URL = {
  url: `${API_BASE_URL}mob-create-task`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_TASK_BY_ID_URL
const API_GET_TASK_BY_ID_URL = {
  url: `${API_BASE_URL}mob-gettask-byid`,
  method: "POST",
  responseDataKey: "data",
};
// API_UPDATE_TASK_URL
const API_UPDATE_TASK_URL = {
  url: `${API_BASE_URL}mob-updatetask`,
  method: "POST",
  responseDataKey: "data",
};
// API_GET_PROJECT_STEP_DATA_URL
const API_GET_PROJECT_STEP_DATA_URL = {
  url: `${API_BASE_URL}mob-projects-tabs`,
  method: "POST",
  responseDataKey: "data",
};

// API_FORM_SUBMIT_BY_ID_URL
const API_FORM_SUBMIT_BY_ID_URL = {
  url: `${API_BASE_URL}mob-create-project-basicdetails`,
  method: "POST",
  responseDataKey: "data",
};

// API_PROJECT_DOCUMENT_UPLOAD_DTA
const API_PROJECT_DOCUMENT_UPLOAD_DTA = {
  url: `${API_BASE_URL}mob-update-project-files`,
  method: "POST",
  responseDataKey: "data",
};

// API_SEND_MESSAGES_LIST_URL
const API_SEND_MESSAGES_LIST_URL = {
  url: `${API_BASE_URL}mob-send-message`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_PROJECT_DOCS_URL
const API_GET_PROJECT_DOCS_URL = {
  url: `${API_BASE_URL}mob-get-project-files`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_MODULE_LIST_ARRAY_DATA_URL
const API_GET_MODULE_LIST_ARRAY_DATA_URL = {
  url: `${API_BASE_URL}mob-getrole-menus`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_GROUPCHAT_DETAILS_URL
const API_GET_GROUPCHAT_DETAILS_URL = {
  url: `${API_BASE_URL}mob-chat-participants`,
  method: "POST",
  responseDataKey: "data",
};

// API_PROJECT_REMOVE_USER_URL

const API_PROJECT_REMOVE_USER_URL = {
  url: `${API_BASE_URL}mob-chat-removemember`,
  method: "POST",
  responseDataKey: "data",
};


// API_UPDATE_PROJECT_USER_URL
const API_UPDATE_PROJECT_USER_URL = {
  url: `${API_BASE_URL}mob-chat-addmemnber`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_ASSIGNED_TASK_USER_URL
const API_GET_ASSIGNED_TASK_USER_URL = {
  url: `${API_BASE_URL}mob-gettasks`,
  method: "POST",
  responseDataKey: "data",
};

// API_TASK_STATUS_TASK_USER_URL
const API_TASK_STATUS_TASK_USER_URL = {
  url: `${API_BASE_URL}mob-update-taskstatus`,
  method: "POST",
  responseDataKey: "data",
};

// API_USER_SOCIAL_MEDIA_URL
const API_USER_SOCIAL_MEDIA_URL = {
  url: `${API_BASE_URL}mob-socialplatforms`,
  method: "POST",
  responseDataKey: "data",
};


// API_GET_MODULE_LIST_DATA_URL
const API_GET_MODULE_LIST_DATA_URL = {
  url: `${API_BASE_URL}mob-get-roles`,
  method: "POST",
  responseDataKey: "data",
};
// API_SUBMIT_ROLES_ACCESS_DATA_URL
const API_SUBMIT_ROLES_ACCESS_DATA_URL = {
  url: `${API_BASE_URL}mob-create-roles`,
  method: "POST",
  responseDataKey: "data",
};

// API_GET_MODULE_LIST_BY_ID_DATA_URL
const API_GET_MODULE_LIST_BY_ID_DATA_URL = {
  url: `${API_BASE_URL}mob-get-role-by-id`,
  method: "POST",
  responseDataKey: "data",
};

// API_UPDATE_ROLES_ACCESS_DATA_URL
const API_UPDATE_ROLES_ACCESS_DATA_URL = {
  url: `${API_BASE_URL}mob-edit-roles`,
  method: "POST",
  responseDataKey: "data",
};

// API_DELETE_MODULE_ACCESS_URL
const API_DELETE_MODULE_ACCESS_URL = {
  url: `${API_BASE_URL}mob-delete-role`,
  method: "POST",
  responseDataKey: "data",
};
// USER_UPDATE_PRO_PIC
const USER_UPDATE_PRO_PIC = {
  url: `${API_BASE_URL}employee-upload-profileimage`,
  method: "POST",
  responseDataKey: "data",
};

// 
const API_BTTOM_NAVIGATION_URL = {
  url: `${API_BASE_URL}mob-getbottom-navigation`,
  method: "POST",
  responseDataKey: "data",
};


export default {
  APP_GENERATE_TOKEN, API_GET_PROJECT_STEP_DATA_URL, API_SUBMIT_ROLES_ACCESS_DATA_URL,
  API_UPDATE_PROJECT_USER_URL, API_GET_ASSIGNED_TASK_USER_URL, API_UPDATE_ROLES_ACCESS_DATA_URL,
  API_GET_TASK_BY_ID_URL, API_UPDATE_TASK_URL, API_TASK_STATUS_TASK_USER_URL,
  API_GET_TASK_LIST_DATA_URL, API_GET_GROUPCHAT_DETAILS_URL, API_USER_SOCIAL_MEDIA_URL,
  API_PROJECT_DOCUMENT_UPLOAD_DTA, API_GET_PROJECT_DOCS_URL, API_GET_MODULE_LIST_BY_ID_DATA_URL,
  API_FORM_SUBMIT_BY_ID_URL, API_SEND_MESSAGES_LIST_URL, API_DELETE_MODULE_ACCESS_URL,
  API_SITE_URL, API_LANGUAGE_URL, API_LOGIN_URL, API_LANGUAGE_CONTENT_URL,
  API_GET_CATEGORY_LIST, API_GET_SUB_CATEGORY_LIST, GET_SIDE_MENU_API, USER_UPDATE_PRO_PIC,
  GET_PROFILE_MENU_API, API_MOBILE_CHECK, API_GET_SETTINGS_MENU_URL,
  API_HOME_SCREEN_CONTENT_URL, GET_EMPLOYEE_DETAILS_API, API_GET_USER_DETAILS_URL, API_UPDATE_USER_DETAILS_URL,
  API_EMPLOYEE_CONTENT_URL, API_ATTENDANCE_CONTENT_URL, API_MOBILE_OTP, API_SET_MPIN, API__MPIN_LOGIN_URL,
  API_RESETMPIN_URL, API_CHANGE_NOTIFICATION_URL, API_CHANGE_PASSCODE_URL, API_GET_PAYROLL_LIST,
  API_GET_EMPLOYEE_LIST, API_GET_EMPLOYEE_PAYROLL_LIST, API_GET_PROJECT_STATS_CONTENT_URL, API_GET_JOB_DETAILS_URL, API_GET_CLINET_DATA_URL,
  API_CREATE_EMPLOYEE_URL, API_CREATE_PUNCH_IN_OUT_URL, API_GET_PUNCH_IN_OUT_HISTORY_URL,
  API_LEAVE_FORM_SUBMIT_URL, API_GET_LEAVE_ARRAY_URL,
  API_APP_PUNCHED_URL, API_GET_LOGIN_HISTOY_LIST,
  API_GENERATE_PAYROLL_URL, API_GET_CHAT_LIST_URL, API_GET_SUB_CATEGORY_LIST_ARR,
  API_FILES_DATA_URL, API_GET_COMPANYLIST_CONTENT_URL, API_GET_COMPANY_DATA_URL,
  API_UPLOAD_DTA, APIGET_CATEGORY_URL, API_CRETE_CATYEGORY_URL, API_UPDATE_CATYEGORY_URL,
  API_SUBMIT_COMPANY, API_GET_CLIENT_STEP_DATA_URL,
  API_UPDATE_CONTACT_SUBMIT_COMPANY, API_GET_COMPANY_DATA_BY_ID_URL,
  API_CREATE_CLIENT_COMPANY, API_GET_MODULE_LIST_DATA_URL,
  API_UPDATE_CLIENT__DATA_URL, API_GET_MODULE_LIST_ARRAY_DATA_URL,
  API_GET_CLIENT_DATA_BY_ID_URL, API_PROJECT_REMOVE_USER_URL,
  API_CREATE_PROJECT_URL, API_GET_PROJECT_DETAIL_BY_ID_URL,
  API_UPDATE_CREATE_PROJECT_URL,
  API_PROJECT_DELETE_URL,
  API_GET_CHAT_MESSAGES_LIST_URL, API_UPDATE_PROJECT_DETAILS_URL,
  API_CREATE_TASK_URL,API_BTTOM_NAVIGATION_URL
};
