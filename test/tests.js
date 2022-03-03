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
        .get("http://localhost:8080/api/posts/health,tech")
        .then((res) => {
          const posts = res.data;
          const postIds = new Set();
          const ids = [];
          // Gets all post ids
          for (const post of posts) {
            postIds.add(post.id);
            ids.push(post.id);
          }
          expect(postIds.size).to.equal(posts.length);
        })
        .catch((error) => {
          console.log(error);
        });
      done();
    });
    it("Should pass if posts are sorted by the param", function (done) {
      axios
        .get("http://localhost:8080/api/posts/tech,health/likes/asc")
        .then((res) => {
          let posts = res.data;
          let likesChecker = 1;
          for (let i = 0; i < posts.length; i++) {
            if (i > 0 && posts[i].likes >= posts[i - 1].likes) {
              likesChecker++;
            }
          }
          expect(likesChecker).to.equal(posts.length);
        })
        .catch((error) => {
          console.log(error);
        });
      done();
    });
    it("Should pass if values are are sorted in a correct direction", function (done) {
      axios
        .get("http://localhost:8080/api/posts/tech,history/likes/desc")
        .then((res) => {
          let posts = res.data;
          // console.log(res.data);
          let likesChecker = 1;
          for (let i = 0; i < posts.length - 1; i++) {
            if (posts[i].likes >= posts[i + 1].likes) {
              likesChecker++;
            }
          }
          expect(likesChecker).to.equal(posts.length);
        })
        .catch((error) => {
          console.log(error);
        });
      done();
    });
  });
});
