const app = require("../../server");
const supertest = require("supertest");

async function login(username, password){
 let response = await supertest(app)
        .post('/api/v1/auth/signin')
        .send({
          username: username,
          password: password,
        })
  return response.body.access_token
}

module.exports = {
 login: login
}