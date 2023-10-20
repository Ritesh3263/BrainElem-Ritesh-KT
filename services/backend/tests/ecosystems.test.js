const app = require("../server");
const supertest = require("supertest");
const mongoose = require("mongoose");
const db = require("../app/models");
const dbConfig = require("../app/config/db.config");
const utils = require("../app/utils/database")
const { login } = require("../app/utils/testing")
const Ecosystem = require("../app/models/ecosystem.model");

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
    await utils.createModuleManager()
    await utils.createAssistant()
    await utils.createEcosystem()
    await utils.createEcoManager()
    token = await login('root', 'Testing123!');

  }
  catch (err) {
    console.error("Connection error", err);
    process.exit(err);
  }
});

afterAll((done) => {
  mongoose.connection.close()
  done()
});

// ORDERED AS ecosystem.routes.js !!!


describe('POST /api/v1/ecosystems/add', () => {
  test("Expect successfull response and check if entry was added to database", (done) => {
    supertest(app)
      .post("/api/v1/ecosystems/add")
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Ecosystem X', description: "Ecosystem description", "isActive": true, "subscriptions": [] })
      .expect(200)
      .then(async (response) => {
        // Check if ecosystem is inside database
        let ecosystem = await db.ecosystem.findOne({ "name": 'Ecosystem X' })
        expect(ecosystem).not.toBeNull();
        done()
      });
  });

})

describe('PUT /api/v1/ecosystems/update/100000000000000000000000', () => {
  test("Expect successfull data change", (done) => {
    supertest(app)
      .put("/api/v1/ecosystems/update/100000000000000000000000")
      .set('Authorization', `Bearer ${token}`)
      .send({ _id: '100000000000000000000000', manager: '999999999999999999999996', name: 'Ecosystem 2', description: 'Description of Ecosystem 2', isActive: true })
      .expect(200)
      .then(async (response) => {
        // Check if modified ecosystem is inside database
        let ecosystem = await db.ecosystem.findOne({ "name": 'Ecosystem 2' })
        expect(ecosystem).not.toBeNull();
        done()
      });
  });
})




describe('GET /api/v1/ecosystems/get-managers', () => {
  test("Expect successfull response", (done) => {
    supertest(app)
      .get("/api/v1/ecosystems/get-managers")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async (response) => {
        expect(response.body).toMatchObject([{
          "_id": "999999999999999999999998",
          "email": "ecomanager",
          "username": "ecomanager"
        },

        ]);
        done()
      });
  });
})




describe('POST /api/v1/ecosystems/add-manager', () => {
  test("Expect successfull response and check if entry was added to database", (done) => {
    supertest(app)
      .post("/api/v1/ecosystems/add-manager")
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Name X', surname: "Surname X", email: "Email@x.com", username: "UsernameX", password: "password X", "isActive": true, "scopes": "ecomanager:write:all", "recommendations": [] })
      .expect(200)
      .then(async (response) => {
        // Check if ecosystem manager is inside database
        let user = await db.user.findOne({ "name": 'Name X' })
        expect(user).not.toBeNull();
        done()
      });
  });

})

describe('PUT /api/v1/ecosystems/update-manager/999999999999999999999999', () => {
  test("Expect successfull data change", (done) => {
    supertest(app)
      .put("/api/v1/ecosystems/update-manager/999999999999999999999999")
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Name X2', surname: "Surname X2", username: "UsernameX2", password: "passwordX" })
      .expect(200)
      .then(async (response) => {
        // Check if edited ecosystem manager is inside database
        let user = await db.user.findOne({ "name": 'Name X2' })
        expect(user).not.toBeNull();
        done()

      });
  });
})

describe('DELETE /api/v1/ecosystems/remove/100000000000000000000000', () => {
  test("Expect successfull data change", (done) => {
    supertest(app)
      .delete("/api/v1/ecosystems/remove/100000000000000000000000")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async (response) => {
        // Check if meeting is inside database
        let ecosystem = await db.ecosystem.findOne({ "id": '100000000000000000000000' })
        expect(ecosystem).toBeNull();
        done()

      });
  });
})

describe('DELETE /api/v1/ecosystems/remove-manager/999999999999999999999999', () => {
  test("Expect successfull data change", (done) => {
    supertest(app)
      .delete("/api/v1/ecosystems/remove-manager/999999999999999999999999")
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .then(async (response) => {
        // Check if meeting is inside database
        let ecosystem = await db.ecosystem.findOne({ "id": '999999999999999999999999' })
        expect(ecosystem).toBeNull();
        done()
      });
  });
})