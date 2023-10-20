const app = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const db = require("../app/models");
const dbConfig = require("../app/config/db.config");
const utils = require("../app/utils/database")
const { login } = require("../app/utils/testing")

let token = null;

beforeAll(async () => {
  try {
    await db.mongoose
      .connect(`mongodb://${dbConfig.USER}:${dbConfig.PASS}@${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.TEST_DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })


    // Remove all collections in database
    await utils.removeCollections()
    //When connected create some data
    await utils.createAdminUser()
    token = await login('root', 'Testing123!');
  } catch (err) {
    console.error("Connection error", err);
    process.exit(err);

  }

});

afterAll((done) => {
  mongoose.connection.close()
  done()
});

describe('GET /api/v1/users/all', () => {

  test("Expect successfull response", (done) => {
    supertest(app)
      .get("/api/v1/users/all")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toEqual([{ _id: '999999999999999999999999' }]);
        done()
      });
  });
})

describe('PUT /api/v1/users/update/999999999999999999999999', () => {

  test("Expect update password", async () => {
    let userBeforeUpdate = await db.user.findOne({ _id: '999999999999999999999999' }, function (err, user) {
      expect(err).toBeNull();
      expect(user).not.toBeNull();
    })

    await supertest(app)
      .put("/api/v1/users/update/999999999999999999999999")
      .set('Authorization', `Bearer ${token}`)
      .send({ "password": "newPassword" })

    let user = await db.user.findOne({ _id: '999999999999999999999999' });
    expect(user).not.toBeNull();
    let newPassword = user.password
    expect(userBeforeUpdate.password).not.toEqual(newPassword);


  });
})