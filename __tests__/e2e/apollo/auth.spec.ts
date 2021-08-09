require("reflect-metadata");
import express from "express";
import session from "express-session";
import supertest from "supertest";
import { create_apollo_server } from "../../../src/apollo";
import { SQLDatabase } from "../../../src/db/SQLDatabase";

// https://stackoverflow.com/questions/49141927/express-body-parser-utf-8-error-in-test
const iconvLite = require("iconv-lite/lib");
iconvLite.getCodec("UTF-8");

// curl --request POST   --header 'content-type: application/json'   --url http://localhost:4000/graphql
// --data '{"query":"mutation SigninMutation{ signin(options: {email: \"test@mail.com\", password: \"password\"}){id, fname, lname, email}}"}'

describe("Authentication Graphql Endpoint", () => {
  let apollo: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await SQLDatabase.init();
    const exp = express();
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

    exp.use("/graphql", await create_apollo_server());
    apollo = supertest(exp);
  });

  afterAll(() => {
    SQLDatabase.close();
  });

  it("should return user with valid auth credentials", (done) => {
    apollo
      .post("/graphql")
      .send({
        query: 'mutation { signin(options: {email: "user1@mail.com", password: "Password@123"}){id, email}}'
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        expect(res.body).toBeInstanceOf(Object);
        expect(res.body.data.signin).toMatchObject({
          email: "user1@mail.com"
        });
        done();
      });
  });
});
