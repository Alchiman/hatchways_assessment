const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();
const bodyParser = require("body-parser");
// const fetch = require("cross-fetch");
const axios = require("axios");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// route 1
app.get("/api/ping", (req, res) => {
  return res.status(200).json({ success: true });
});

// route 2
app.get("/api/posts/:tags/:sortBy?/:direction?", (req, res) => {
  const { tags, sortBy, direction } = req.params;
  const listOfSortParams = ["id", "reads", "likes", "popularity", undefined];
  const orderParams = ["asc", "desc", undefined];

  // handle unvalid sort params and order direction
  if (listOfSortParams.indexOf(sortBy) === -1) {
    return res.status(400).send({
      error: "sortBy parameter is invalid",
    });
  }
  if (orderParams.indexOf(direction) === -1) {
    return res.status(400).send({
      error: "sortBy parameter is invalid",
    });
  }

  // handle the requests with more than one tag
  if (tags.indexOf(",") !== -1) {
    let tagArray = tags.split(",");
    let getPaths = tagArray.map((tag) => {
      return axios.get(
        `http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`
      );
    });
    axios
      .all([...getPaths])

      .then(
        axios.spread((tag1, tag2, tag3, tag4, tag5, tag6, tag7, tag8, tag9) => {
          let data = [
            tag1 ? tag1.data.posts : "",
            tag2 ? tag2.data.posts : "",
            tag3 ? tag3.data.posts : "",
            tag4 ? tag4.data.posts : "",
            tag5 ? tag5.data.posts : "",
            tag6 ? tag6.data.posts : "",
            tag7 ? tag7.data.posts : "",
            tag8 ? tag8.data.posts : "",
            tag9 ? tag9.data.posts : "",
          ];
          // getting rid of duplicates using post id as the key

          let post = {};
          let posts = [];
          for (let i = 0; i < data.length; i++) {
            let blog = data[i];
            for (let i = 0; i < blog.length; i++) {
              post[blog[i].id] = blog[i];
            }
          }
          for (let key in post) {
            posts.push(post[key]);
          }
          if (sortBy) {
            if (direction === "desc") {
              posts = posts.sort((a, b) => (b[sortBy] > a[sortBy] ? 1 : -1));
            } else {
              posts = posts.sort((a, b) => (b[sortBy] < a[sortBy] ? 1 : -1));
            }
          }
          res.status(200).send(posts);
        })
      )
      .catch((error) => {
        res.status(400).send({
          error: "tags parameter is required",
        });
        console.log(error);
      });
  } else {
    axios
      .get(
        `http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`
      )
      .then((request) => {
        let data = request.data.posts;
        if (sortBy) {
          if (direction === "desc") {
            data = data.sort((a, b) => (b[sortBy] > a[sortBy] ? 1 : -1));
          } else {
            data = data.sort((a, b) => (b[sortBy] < a[sortBy] ? 1 : -1));
          }
        }
        return res.status(200).send(data);
      })
      .catch((error) => {
        res.status(400).send({
          error: "tags parameter is required",
        });
        console.log(error);
      });
  }
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
