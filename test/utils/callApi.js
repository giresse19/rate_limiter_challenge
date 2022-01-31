const axios = require('axios');
const BASE_URL = `http://localhost:8000`
const MAX_WINDOW_REQUEST_COUNT_DEV = 100

const shouldGetRateLimitException = async (url) => {
  const apiCalls = [];

  for (let index = MAX_WINDOW_REQUEST_COUNT_DEV + 1; index > 0; index--) {
    try {
      const responds = await axios.get(url);
      apiCalls.push(responds);
    } catch (e) {
      apiCalls.push(e.response.data);
    }
  }
  return apiCalls;
}

const shouldNotGetRateLimitException = async (url) => {
  const apiCalls = [];

  for (let index = MAX_WINDOW_REQUEST_COUNT_DEV; index > 0; index--) {
    try {
      const responds = await axios.get(url);
      apiCalls.push(responds);
    } catch (e) {
      apiCalls.push(e.response.data);
    }
  }

  return apiCalls;
}

const deleteRequestCount = async () => {
  return await axios.get(`${BASE_URL}/api/v1/delete-user-request-count`);
}

module.exports = {
  shouldGetRateLimitException,
  shouldNotGetRateLimitException,
  deleteRequestCount
}
