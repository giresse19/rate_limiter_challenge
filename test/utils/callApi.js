const axios = require('axios');
const login = require('./protecteRoute');

const shouldGetRateLimitException = async (url, number) => {
  const apiCalls = [];
  for (let index = number; index > 0; index--) {
    try {
      const responds = await axios.get(url);
      apiCalls.push(responds);
    } catch (e) {
      apiCalls.push(e.response.data);
    }
  }
  return apiCalls;
}

const shouldNotGetRateLimitException = async (url, number) => {
  const apiCalls = [];
  for (let index = number; index > 0; index--) {
    try {
      const responds = await axios.get(url);
      apiCalls.push(responds);
    } catch (e) {
      apiCalls.push(e.response.data);
    }
  }

  return apiCalls;
}

const shouldGetPrivate = async (url, number) => {
  const apiCalls = [];
  const bearer = await login();
  for (let index = number; index > 0; index--) {
    try {
      const responds = await axios.get(url, { headers: { "Authorization": `${bearer}` } })
      apiCalls.push(responds);
    } catch (e) {
      apiCalls.push(e.response.data);
    }
  }

  return apiCalls;
}


const deleteRequestCountWithIpAsKey = async (url) => {
 return await axios.get(url);
}

const deleteRequestCountWithIpAndTokenAsKey = async (url) => {
  const bearer = await login();
 return await axios.get(url,  { headers: { "Authorization": `${bearer}`}  }) ;
}

module.exports = {
  shouldGetRateLimitException,
  shouldGetPrivate,
  shouldNotGetRateLimitException,
  deleteRequestCountWithIpAsKey,
  deleteRequestCountWithIpAndTokenAsKey,
}
