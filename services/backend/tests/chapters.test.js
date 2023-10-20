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
    await utils.createChapter()
    token = await login('root', 'Testing123!');
  }
  catch (err) {
    console.error("Connection error", err);
    process.exit(err);
  };
});

afterAll((done) => {
  mongoose.connection.close()
  done()
});

describe('GET /api/v1/chapters/all', () => {

  test("Expect successfull response", (done) => {
    supertest(app)
      .get("/api/v1/chapters/all")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body.some(chapter => chapter._id == '111111100000000000000000')).toEqual(true)
        done()
      });
  });
})

describe('GET /api/v1/chapters/111111100000000000000000', () => {

  test("Expect successfull response", (done) => {
    supertest(app)
      .get("/api/v1/chapters/111111100000000000000000")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toMatchObject({ _id: '111111100000000000000000' });
        done()
      });
  });
})