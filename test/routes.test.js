const request = require("supertest");
const app = require("../router");
const server = require("../src/server");
const models = require(".././models");
const Sequelize = require("sequelize");
const { expect } = require("chai");
const { sequelize } = require(".././models");
const config = require(__dirname + "/../config/database.js")["development"];
const chat = require("../router/chat");

console.log(chat);

describe("Chat Endpoints", function () {
  let db;

  before("make sequelize instance", () => {
    // db = knex({
    //   client: "pg",
    //   connection: process.env.TEST_DATABASE_URL,
    // });
    // app.set("db", db);
    let sequelize;
    if (config.use_env_variable) {
      sequelize = new Sequelize(process.env[config.use_env_variable], config);
    } else {
      sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config
      );
    }
  });

  after("disconnect from db", () => sequelize.close());

  before("clean the table", () =>
    sequelize.query(`TRUNCATE "Messages" RESTART IDENTITY CASCADE`)
  );

  afterEach("cleanup", () =>
    sequelize.query(`TRUNCATE "Messages" RESTART IDENTITY CASCADE`)
  );

  describe(`GET /messages`, () => {
    context(`Given no messages`, () => {
      it(`responds with 200 and an empty list`, () => {
        return sequelize
          .query(`select * from "Messages"`)
          .then((data) => console.log(data));
      });
    });
  });

  //     context("Given there are products in the database", () => {
  //       const testUsers = makeUsersArray();
  //       const testProducts = makeProductsArray();

  //       beforeEach("insert products", () => {
  //         return db
  //           .into("users")
  //           .insert(testUsers)
  //           .then(() => {
  //             return db.into("products").insert(testProducts);
  //           });
  //       });

  //       it("responds with 200 and all of the products", () => {
  //         return supertest(app).get("/api/products").expect(200, testProducts);
  //       });
  //     });

  //     context("Given there are products in the database", () => {
  //       const testUsers = makeUsersArray();
  //       const testProducts = makeProductsArray();

  //       beforeEach("insert products", () => {
  //         return db
  //           .into("users")
  //           .insert(testUsers)
  //           .then(() => {
  //             return db.into("products").insert(testProducts);
  //           });
  //       });

  //       it("responds with 200 and all of the products", () => {
  //         return supertest(app).get("/api/products").expect(200, testProducts);
  //       });
  //     });
  //   });

  //   describe(`GET /api/products/:product_id`, () => {
  //     context(`Given no product`, () => {
  //       it(`responds with 404`, () => {
  //         const productId = 123456;
  //         return supertest(app)
  //           .get(`/api/products/${productId}`)
  //           .expect(404, { error: { message: `Product doesn't exist` } });
  //       });
  //     });

  //     context("Given there are product in the database", () => {
  //       const testUsers = makeUsersArray();
  //       const testProducts = makeProductsArray();

  //       beforeEach("insert products", () => {
  //         return db
  //           .into("users")
  //           .insert(testUsers)
  //           .then(() => {
  //             return db.into("products").insert(testProducts);
  //           });
  //       });

  //       it("responds with 200 and the specified product", () => {
  //         const productId = 2;
  //         const expectedProduct = testProducts[productId - 1];
  //         return supertest(app)
  //           .get(`/api/products/${productId}`)
  //           .expect(200, expectedProduct);
  //       });
  //     });
  //   });
});

// describe("User API", () => {
//   it("should show all users", async () => {
//     const res = await request(app).get("/search-users");
//     expect(res.statusCode).toEqual(200);
//     expect(res.body).toHaveProperty("users");
//   });
// });
