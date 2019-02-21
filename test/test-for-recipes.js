const { app, runServer, closeServer } = require("../server");
const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;

//use chai-http plugin
chai.use(chaiHttp);

//Integration tests

describe("recipe integration tests", function() {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it("test get recipe", function() {
    return chai
      .request(app)
      .get("/recipes")
      .then(function(res) {
        // console.log(res);
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body.length).to.be.greaterThan(0);
      });
  });

  it("test post recipe", function() {
    return chai
      .request(app)
      .post("/recipes")
      .send({ name: "testName", ingredients: ["ing1", "ing2"] })
      .then(function(res) {
        // console.log(res.body);
        expect(res).to.have.status(201);
      });
  });

  it("test put recipe", function() {
    const updateItem = {
      name: "name1",
      ingredients: ["ingredient1", "ingredient2"]
    };

    //get request to get id
    return chai
      .request(app)
      .get(`/recipes`)
      .then(function(res) {
        // console.log(res.body[0].id);
        updateItem.id = res.body[0].id;
        console.log(updateItem);
        return chai
          .request(app)
          .put(`/recipes/${updateItem.id}`)
          .send(updateItem)
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.deep.equal(updateItem);
            console.log(res.body);
          });
      });
  });

  it("test delete recipe", function() {
    //get id first
    return chai
      .request(app)
      .get("/recipes")
      .then(function(res) {
        const id = res.body[0].id;
        return chai
          .request(app)
          .delete(`/recipes/${id}`)
          .then(function(res) {
            expect(res).to.have.status(204);
          });
      });
  });
});
