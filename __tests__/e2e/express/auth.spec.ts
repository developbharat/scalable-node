require("reflect-metadata");
import supertest from "supertest";
import express from "express";
import session from "express-session";
import { BasicAuthRouter } from "../../../src/express/routes/auth/BasicAuthRouter";
import { SQLDatabase } from "../../../src/db/SQLDatabase";

describe("Authentication Express Endpoint", () => {
  let app: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await SQLDatabase.init();
    const exp = express();
    exp.use(express.json({}));
    exp.use(express.json());
    exp.use(express.urlencoded({ extended: true }));
    exp.use(
      session({
        name: "qid",
        secret: "test secret",
        resave: false,
        saveUninitialized: false
      })
    );
    exp.use("/auth", BasicAuthRouter());

    app = supertest(exp);
  });

  afterAll(async () => {
    await SQLDatabase.close();
  });

  it("should return user with valid auth credentials", (done) => {
    app
      .post("/auth/signin")
      .send({
        email: "user1@mail.com",
        password: "Password@123"
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body).toMatchObject({
          email: "user1@mail.com"
        });
        done();
      });
  });
});
