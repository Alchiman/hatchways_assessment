const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();
const bodyParser = require("body-parser");
const fetch = require("cross-fetch");
// const axios = require("axios");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/ping", (req, res) => {
  return res.status(200).json({ success: true });
});

app.get("/api/posts", (req, res) => {
  // const { tag } = req.body;
  fetch(`https://api.hatchways.io/assessment/blog/posts?tag=tech`).then(
    async (response) => {
      const data = await response.json();
      return res.status(200).send(data);
    }
  );
});

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
