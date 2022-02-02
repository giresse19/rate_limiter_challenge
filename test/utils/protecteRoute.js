const axios = require('axios');
const BASE_URL = `http://localhost:8000`
const MAX_WINDOW_REQUEST_COUNT_DEV = 100

const postDataRegister = {
  username: "test",
  email: "test2@mail.com",
  password: "123456"
};

const postDataLogin = {
  email: "test2@mail.com",
  password: "123456"
};

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    "Access-Control-Allow-Origin": "*",
  }
};

const register = async () => {
  try {
    return await axios.post(`${BASE_URL}/api/v1/user/register`, postDataRegister, axiosConfig);
  } catch (err) {
    return err.response
  }
}



const login = async () => {
  let responseWithJwt;
  const response = await register();

  if (response.status === 200 || response.data.msg === 'User Already Exists') {
    responseWithJwt = await axios.post(`${BASE_URL}/api/v1/user/login`, postDataLogin, axiosConfig)
  }

 return `Bearer ${responseWithJwt.data.token}`;
}

module.exports = login

