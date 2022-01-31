const axios = require('axios');
const BASE_URL = `http://localhost:8000`

const shouldGetRateLimitException = async () => {
  const apiCalls = [];
  let devEnvTestNum = 101;

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

module.exports = shouldGetRateLimitException
