import {
  APP_GENERATE_TOKEN_REQUEST,
  APP_GENERATE_TOKEN_SUCCESS,
  APP_GENERATE_TOKEN_FAILURE,
} from "./actionsTypes";

const initialState = {
  isLoggedIn: false,
  isFirstTime: false,
  token: null,
  isLoading: false,
  isAuthenticated: false,
  user: null,
  error: null,
  lerror: null,
  mpinSent: false,
  registered: false,
  confirmed: false,
  loginConfirmed: false,
  profile: null,
  conversationList: [],
  messageList: {},
  groupMessageList: {},
  groupMessageListLoading: false,
  messageSending: [],
  messageSender: [],
  flamesResults: null,
  groupCommunity: [],
  groupList: null,
  CommunityList: {},
  stickersList: null,
  wallpaperList: null,
  SlamBookConvoArray: null,
  getCommunityMessageList: [],
  getFrontSite: null
};

const authReducer = (state = initialState, action) => {

  switch (action.type) {
    // Generate Token
    case APP_GENERATE_TOKEN_REQUEST:
      console.log("APP_GENERATE_TOKEN_SUCCESS", state);
      return {
        ...state,
        isLoading: true,
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
      console.log("generateTokenfailure");
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };


    default:
      return state;
  }
};

export default authReducer;
