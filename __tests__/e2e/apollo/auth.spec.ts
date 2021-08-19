import supertest from "supertest";
import { MainServer } from "../../../src/MainServer";

describe("Authentication Graphql Endpoint", () => {
  let apollo: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await MainServer.init();
    apollo = supertest(MainServer.expressServer);
  });

  afterAll(async () => {
    await MainServer.shutdown();
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
        return done();
      });
  });
});
