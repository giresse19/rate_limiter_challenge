const {
  shouldGetRateLimitException,
  shouldNotGetRateLimitException,
  deleteRequestCount
} = require('./utils/callApi');
const expect = require("chai").expect;
const BASE_URL = `http://localhost:8000`


describe('GET', async () => {
  beforeEach(async () => {
    await deleteRequestCount();
  })

  it('it should get one response status code of 429 from getting DB ', async () => {
    const responses = await shouldGetRateLimitException(`${BASE_URL}/internal/db`);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses.length).to.be.eq(1);
  });

  it('it should not get any response status code of 429 from getting DB ', async () => {
    const responses = await shouldNotGetRateLimitException(`${BASE_URL}/internal/db`);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses.length).to.be.eq(0);
  });

  it('it should get one response status code of 429 from getting DB logs', async () => {
    const responses = await shouldGetRateLimitException(`${BASE_URL}/internal/logs`);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses.length).to.be.eq(1);
  });

  it('it should not get any response status code of 429 from getting DB logs ', async () => {
    const responses = await shouldNotGetRateLimitException(`${BASE_URL}/internal/logs`);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses.length).to.be.eq(0);
  });

  it('it should get one response status code of 429 from DB initialization', async () => {
    const responses = await shouldGetRateLimitException(`${BASE_URL}/internal/initialize`);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses.length).to.be.eq(1);
  });

  it('it should not get any response status code of 429 from DB initialization ', async () => {
    const responses = await shouldNotGetRateLimitException(`${BASE_URL}/internal/initialize`);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses.length).to.be.eq(0);
  });

  it('it should not get any response status code of 429 from getting rich companies ', async () => {
    const responses = await shouldNotGetRateLimitException(`${BASE_URL}/api/v1/rich-companies?countryCode=DE&category=Automobile`);
    const throttledResponses = responses.filter((response) => response.status === 429);
    expect(throttledResponses.length).to.be.eq(0);
  });
})





