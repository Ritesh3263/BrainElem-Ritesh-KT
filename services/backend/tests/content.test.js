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
        await utils.createChapter()
        await utils.createTrainingModule()
        await utils.createContent()
        //await new Promise((r) => setTimeout(r, 1000));
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


describe('GET /api/v1/contents/search', () => {
    jest.setTimeout(30000);
    test("Expect to find content with contents name", (done) => {
        supertest(app)
            .get("/api/v1/contents/search?query=Newton")
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(async (response) => {
                let firstResultId = response.body.hits.hits[0]._id;
                // If not working localy, please make sure you have unmodified, initial database
                expect(firstResultId).toEqual("111111110000000000000000");
                done()
            });
    });

    test("Expect to find content with Chapter name", (done) => {
        supertest(app)
            .get("/api/v1/contents/search?query=Mecanique&contentType=TEST")
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(async (response) => {

                let firstResultId = response.body.hits.hits[0]._id;
                // If not working localy, please make sure you have unmodified, initial database
                expect(firstResultId).toEqual("111111110000000000000000");
                done()
            });
    });

    test("Expect to find content with TrainingModule name", (done) => {
        supertest(app)
            .get("/api/v1/contents/search?query=Physique")
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(async (response) => {
                //console.log(response.body.hits.hits.map(o=>{return [o._id, o.title]}))
                expect(response.body.hits.hits.some(o => { return o._id == "111111110000000000000000" })).toEqual(true)
                done()
            });
    });

    test("Expect to find content by elements", (done) => {
        supertest(app)
            .get("/api/v1/contents/search?query=tomorrow")
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(async (response) => {
                //console.log(response.body.hits.hits.map(o=>{return [o._id, o.title]}))
                expect(response.body.hits.hits.some(o => { return o._id == "777777777777777777777000" })).toEqual(true)
                done()
            });
    });

})