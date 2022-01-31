const shouldGetRateLimitException = require('./utils/callApi');
const expect  = require("chai").expect;


describe('GET DB records check response code 429', async () => {
  it('it should get one response status code of 429 ', async () => {
    const responses = await shouldGetRateLimitException();
    const throttledResponses = responses.filter((response) =>  response.status === 429);
    expect(throttledResponses.length).to.be.eq(1);
  });
})


