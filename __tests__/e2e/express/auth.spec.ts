import supertest from "supertest";
import { MainServer } from "../../../src/MainServer";

describe("Authentication Express Endpoint", () => {
  let app: supertest.SuperTest<supertest.Test>;

  beforeAll(async () => {
    await MainServer.init();
    app = supertest(MainServer.expressServer);
  });

  afterAll(async () => {
    await MainServer.shutdown();
  });

  it("should return user with valid auth credentials", (done) => {
    app
      .post("/api/auth/basic/signin")
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
