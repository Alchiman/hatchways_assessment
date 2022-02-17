const expect = require("chai").expect;
const request = require("request");
const axios = require("axios");

describe("back-end api assesment ", function () {
  describe("route 1", function () {
    it("Should return the correct body for route 1", function (done) {
      request(
        "http://localhost:8080/api/ping",
        function (error, response, body) {
          expect(body).to.equal('{"success":true}');
          done();
        }
      );
    });
    it("Should return the correct status code for route 1 when route is correct", function (done) {
      request(
        "http://localhost:8080/api/ping",
        function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        }
      );
    });
    it("Should return the correct status code for route 1 when route is incorrect", function (done) {
      request(
        "http://localhost:8080/api/pings",
        function (error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
        }
      );
    });
  });
  describe("route 2", function () {
    it("Should return the proper status code for route 2 when the route is correct", function (done) {
      request(
        "http://localhost:8080/api/posts/tech",
        function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        }
      );
    });
    it("Should return the correct status code for when route 2 is incorrect", function (done) {
      request(
        "http://localhost:8080/api/post/tech",
        function (error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
        }
      );
    });
    it("Should return the correct status code for route 2 when route does not have any tag", function (done) {
      request(
        "http://localhost:8080/api/posts",
        function (error, response, body) {
          expect(response.statusCode).to.equal(404);
          done();
        }
      );
    });
    it("Should return the correct status code for route 2 when the user uses all three parameters", function (done) {
      request(
        "http://localhost:8080/api/posts/health,tech/likes/desc",
        function (error, response, body) {
          expect(response.statusCode).to.equal(200);
          done();
        }
      );
    });
    it("Should pass if all posts are unique by checking unique ids", function (done) {
      axios
        .get("http://localhost:8080/api/posts/tech,health")
        .then((res) => {
          let post = res.data;
          let postID = [];
          let postObj = {};
          let test = true;
          // Gets all post ids
          for (let i = 0; i < post.length; i++) {
            postID.push(post[i].id);
          }
          postID.forEach((blog) => {
            postObj[blog] = postObj[blog] ? postObj[blog] + 1 : 1;
          });
          for (let key in postObj) {
            if (postObj[key] > 1) {
              test = false;
            }
          }
          expect(test).to.equal(true);
        })
        .catch((error) => {
          console.log(error);
        });
      done();
    });
    it("Should pass if all posts are unique by checking unique ids using all route parameters", function (done) {
      axios
        .get("http://localhost:8080/api/posts/tech,health/likes/asc")
        .then((res) => {
          let post = res.data;
          let postID = [];
          let postObj = {};
          let test = true;
          for (let i = 0; i < post.length; i++) {
            postID.push(post[i].id);
          }
          postID.forEach((blog) => {
            postObj[blog] = postObj[blog] ? postObj[blog] + 1 : 1;
          });
          for (let key in postObj) {
            if (postObj[key] > 1) {
              test = false;
            }
          }
          expect(test).to.equal(true);
        })
        .catch((error) => {
          console.log(error);
        });
      done();
    });
    it("Should pass if values are are sorted correctly", function (done) {
      axios
        .get("http://localhost:8080/api/posts/tech,history/likes/desc")
        .then((res) => {
          let post = res.data;
          let postLikes = [];
          let test = true;
          for (let i = 0; i < post.length; i++) {
            postLikes.push(post[i].likes);
          }
          for (let i = 0; i < postLikes.length; i++) {
            if (postLikes[i] < postLikes[i + 1]) {
              test = false;
            }
          }
          expect(test).to.equal(true);
        })
        .catch((error) => {
          console.log(error);
        });
      done();
    });
    it("Should pass if the values are sorted correctly with the default parameters(when the user does not use them)", function (done) {
      axios
        .get("http://localhost:8080/api/posts/tech,history")
        .then((res) => {
          let post = res.data;
          let postID = [];
          let test = true;
          for (let i = 0; i < post.length; i++) {
            postID.push(post[i].id);
          }

          for (let i = 0; i < postID.length; i++) {
            if (postID[i] > postID[i + 1]) {
              test = false;
            }
          }
          expect(test).to.equal(true);
        })
        .catch((error) => {
          console.log(error);
        });
      done();
    });
  });
});
