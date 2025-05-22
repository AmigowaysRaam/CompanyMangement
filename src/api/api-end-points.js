const BASE_URL = "https://sana.admin.in/";

export const API_BASE_URL = `${BASE_URL}api/?url=`;

/* ******  Authentication APIs Start ****** */

const APP_GENERATE_TOKEN = {
  url: `${API_BASE_URL}generate-token`,
  method: "POST",
  responseDataKey: "data",
};

export const API_REQUESTS = {
  APP_GENERATE_TOKEN,
};
