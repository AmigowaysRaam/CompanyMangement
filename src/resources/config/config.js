/* config.js */
import {HOC as HocConfigure} from 'react-boilerplate-redux-saga-hoc';
import {API_REQUESTS} from '../api/api-end-points';
import axios from '../api/axios';

const HOC = HocConfigure({
  handlers: [],
  useHocHook: true /* This will help us to use hoc as a hook */,
});

const TEST_API =
  'https://jsonplaceholder.typicode.com/posts/'; /* Default method GET */

const useAuthHoc = HOC({
  initialState: {
    isLoggedIn: false,
    isFirstTime: false,
    profile: {},
    stories: [],
    cart: [],
  },
  dontReset: {
    TEST_API /* If you pass anything on don't reset it wont reset the paricular state on setting to reset */,
  },
  apiEndPoints: API_REQUESTS,
  // axiosInterceptors: axios,
  constantReducer: ({type, state, resetState, action}) => {
    /* For handling custom action */
    switch (type) {
      case 'ADD_STORIES':
        return {
          ...state,
          stories: [...action.payload],
        };

      case 'UPDATE_PROFILE':
        return {
          ...state,
          profile: action.payload,
        };

      case 'UPDATE_CART':
        return {
          ...state,
          cart: action.payload,
        };

      case 'logout':
        return resetState;

      default:
        return state;
    }
  },
  name: 'Auth' /* Reducer name */,
});

export {useAuthHoc};

export {useQuery} from 'react-boilerplate-redux-saga-hoc';
