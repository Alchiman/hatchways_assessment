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
  const directionParams = ["asc", "desc", undefined];

  // here we check to see if sorParam is valid
  if (!listOfSortParams.includes(sortBy)) {
    return res.status(400).send({
      error: "sortBy parameter is invalid",
    });
  }
  // here I check if the directionParam is valid
  if (!directionParams.includes(direction)) {
    return res.status(400).send({
      error: "sortBy parameter is invalid",
    });
  }

  // here I check if multiple tags are used
  if (tags.includes(",")) {
    let tagArray = tags.split(",");
    let getPaths = tagArray.map((tag) => {
      return axios.get(
        `http://hatchways.io/api/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`
      );
    });
    axios
      .all([...getPaths])

      .then(
        axios.spread((...allTags) => {
          let posts = [];
          for (const tag of allTags) {
            posts = [...posts, ...tag.data.posts];
            if (sortBy) {
              if (direction === "desc") {
                posts = posts.sort((a, b) => b[sortBy] - a[sortBy]);
              } else {
                posts = posts.sort((a, b) => a[sortBy] - b[sortBy]);
              }
            }
          }
          // here I get rid of duplicates
          const uniqueValueSet = new Set();
          const filteredArr = posts.filter((obj) => {
            const isPresentInSet = uniqueValueSet.has(obj.id);
            uniqueValueSet.add(obj.id);
            return !isPresentInSet;
          });
          return res.status(200).send(filteredArr);
        })
      )
      .catch((error) => {
        res.status(400).send({
          error: "tags parameter is required",
        });
        console.log(error);
      });
  } else {
    // here I handle single tag request
    axios
      .get(
        `http://hatchways.io/api/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`
      )
      .then((request) => {
        let posts = request.data.posts;
        if (sortBy) {
          // console.log(sortBy);
          if (direction === "desc") {
            posts = posts.sort((a, b) => b[sortBy] - a[sortBy]);
          } else {
            posts = posts.sort((a, b) => a[sortBy] - b[sortBy]);
          }
        }
        return res.status(200).send(posts);
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
