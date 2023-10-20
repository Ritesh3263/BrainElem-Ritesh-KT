const app = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const db = require("../app/models");
const Mail = require("../app/models/mail.model");
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
    //When connected create some data
    // Remove all collections in database
    await utils.removeCollections()
    await utils.createAdminUser()
    await utils.createUserWithEmail("testing.adrihanu@gmail.com")
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

describe('POST /api/v1/auth/refreshToken', () => {

  test("Expect successfull refresh token", async () => {
    let response = await supertest(app)
      .post("/api/v1/auth/refreshToken")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(response.body).toMatchObject({ email: 'root' });


  });
})

describe('POST /api/v1/auth/resetPassword', () => {
  jest.setTimeout(30000);
  test("Check if email mail was sent", async () => {
    await supertest(app)
      .post("/api/v1/auth/resetPassword")
      .send({ "email": "testing.adrihanu@gmail.com" })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)


    let mail = await Mail.findOne({ "to": "testing.adrihanu@gmail.com" })
    expect(mail).not.toBeNull();
    expect(mail.status).toEqual("PENDING")

    /* ONLY FOR CI/CD testing
    // This will fail for local testing, as local testing is using connection to fake database
    // But task-executr is always connecting to the main database
    await new Promise((r) => setTimeout(r, 5000));
    await Mail.findOne({"to": "testing.adrihanu@gmail.com"}, async function(err, mail){
      expect(err).toBeNull();
      expect(mail).not.toBeNull();
      // Only when tests on default database
      expect(mail.status).toEqual("SENT")
    })
    */

  });

  // Make sure that response from the backend is always the same regardless of wrong email, username or password. 
  // So there is no easy way to check which email exists in the database. Thanks
  test("Expect 200 for mail which does not exists", async () => {
    await supertest(app)
      .post("/api/v1/auth/resetPassword")
      .send({ "email": "fakeEmail@whichDoesNotExist" })
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  });


})
