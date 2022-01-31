const axios = require('axios');
const BASE_URL = `http://localhost:8000`
const MAX_WINDOW_REQUEST_COUNT_DEV = 100

const shouldGetRateLimitExceptionForDevEnv = async () => {
  const apiCalls = [];
  let devEnvTestNum = MAX_WINDOW_REQUEST_COUNT_DEV + 1;

  for (let index = devEnvTestNum; index > 0; index--) {
    try {
      const responds = await axios.get(`${BASE_URL}/internal/db`);
      apiCalls.push(responds);
    } catch (e) {
      apiCalls.push(e.response.data);
    }
  }
  return apiCalls;

}

module.exports = shouldGetRateLimitExceptionForDevEnv
