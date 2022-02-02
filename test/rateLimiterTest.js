const {
  shouldGetRateLimitException,
  shouldNotGetRateLimitException,
  deleteRequestCountWithIpAndTokenAsKey,
  deleteRequestCountWithIpAsKey,
  shouldGetPrivate,
} = require('./utils/callApi');

const expect = require("chai").expect;
const BASE_URL = `http://localhost:8000`

describe('UNPROTECTED GET REQUEST', async () => {

  it('It should delete request with Ip address as key ', async () => {
    const responses = await deleteRequestCountWithIpAsKey(`${BASE_URL}/internal/delete-user-request-count`);
    expect(responses.status).to.be.eq(200);
  });

  it('it should not get any response status code of 429 from getting logs ', async () => {
    const responses = await shouldGetRateLimitException(`${BASE_URL}/internal/logs`, 10);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses).to.be.empty;
  });

  it('it should get one response status code of 429 from initializing DB ', async () => {
    const responses = await shouldNotGetRateLimitException(`${BASE_URL}/internal/initialize`, 91);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses.length).to.be.eq(1);
  });

})


describe("PROTECTED GET REQUEST", () => {

  it('It should delete request with Ip address and token as key', async () => {
    const responses = await deleteRequestCountWithIpAndTokenAsKey(`${BASE_URL}/api/v1/delete-user-request-count`);
    expect(responses.status).to.be.eq(200);
  });

  it('it should not get any response status code of 429 by calling getrich companies end-point ', async () => {
    const responses = await shouldGetPrivate(`${BASE_URL}/api/v1/rich-companies?countryCode=DE&category=Automobile`,  10);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses).to.be.empty;
  });

  it('it should not get any response status code of 429 from getting users', async () => {
    const responses = await shouldGetPrivate(`${BASE_URL}/api/v1/users`,  90);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses.length).to.be.eq(0);
  });

})




