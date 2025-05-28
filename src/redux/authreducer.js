import {
  APP_GENERATE_TOKEN_REQUEST,
  APP_GENERATE_TOKEN_SUCCESS,
  APP_GENERATE_TOKEN_FAILURE,

  APP_SITE_SETTINGS_REQUEST,
  APP_SITE_SETTINGS_SUCCESS,
  APP_SITE_SETTINGS_FAILURE,

  APP_USER_LOGIN_REQUEST,
  APP_USER_LOGIN_SUCCESS,
  APP_USER_LOGIN_FAILURE,


  APP_USER_SIDE_MENUS_REQUEST,
  APP_USER_SIDE_MENUS_SUCCESS,
  APP_USER_SIDE_MENUS_FAILURE,

  APP_TAB_MENU_REQUEST,
  APP_TAB_MENU_SUCCESS,
  APP_TAB_MENU_FAILURE,



} from "./actionsTypes";

const initialState = {
  isLoggedIn: false,
  isFirstTime: false,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  getFrontSite: null,
  error: null, // make sure error is part of state
  user: null,
  sidemenu: null, tabMenuList: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {

    // Generate Token
    case APP_GENERATE_TOKEN_REQUEST:
      console.log("APP_GENERATE_TOKEN_REQUEST", state);
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case APP_GENERATE_TOKEN_SUCCESS:
      console.log("generateTokenSuccess", action.payload);
      return {
        ...state,
        token: action.payload,
        isLoading: false,
        error: null,
      };

    case APP_GENERATE_TOKEN_FAILURE:
      console.log("generateTokenFailure");
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };

    // Get Site Settings
    case APP_SITE_SETTINGS_REQUEST:
      // console.log("Request started — usually no payload here");
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case APP_SITE_SETTINGS_SUCCESS:
      // console.log("Site settings fetched successfully:", action.payload);
      return {
        ...state,
        getFrontSite: action.payload, // actual data here
        isLoading: false,
        error: null,
      };
    case APP_SITE_SETTINGS_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    // 
    case APP_USER_LOGIN_REQUEST:
      // console.log("Request started");
      return {
        ...state,
        loading: true,
        error: null,
      };

    case APP_USER_LOGIN_SUCCESS:
      // console.log("LOGIN successfully:", action.payload);
      return {
        ...state,
        loading: false,
        user: action.payload,
        error: null,
      };

    case APP_USER_LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        user: null,
        error: action.payload, // typically an error message or object
      };


    // APP_USER_SIDE_MENUS_REQUEST,
    // APP_USER_SIDE_MENUS_SUCCESS,
    // APP_USER_SIDE_MENUS_FAILURE,
    // 
    case APP_USER_SIDE_MENUS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case APP_USER_SIDE_MENUS_SUCCESS:
      // console.log("APP_USER_SIDE_MENUS_SUCCESS:", action.payload);
      return {
        ...state,
        loading: false,
        sidemenu: action.payload,
        error: null,
      };

    case APP_USER_SIDE_MENUS_FAILURE:
      return {
        ...state,
        loading: false,
        sidemenu: null,
        error: action.payload, // typically an error message or object
      };

    // Tab menu
    case APP_TAB_MENU_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case APP_TAB_MENU_SUCCESS:
      console.log("APP_USER_SIDE_MENUS_SUCCESS:", action.payload);
      return {
        ...state,
        loading: false,
        tabMenuList: action.payload,
        error: null,
      };

    case APP_TAB_MENU_FAILURE:
      return {
        ...state,
        loading: false,
        tabMenuList: null,
        error: action.payload, // typically an error message or object
      };







    default:
      return state;
  }
};

export default authReducer;
