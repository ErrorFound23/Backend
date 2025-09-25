const express = require("express"); // commonjs import
require("dotenv").config();

const app = express();
const port = process.env.PORT;
const githubData = {
  login: "yashrana23",
  id: 218101253,
  node_id: "U_kgDODP_2BQ",
  avatar_url: "https://avatars.githubusercontent.com/u/218101253?v=4",
  gravatar_id: "",
  url: "https://api.github.com/users/yashrana23",
  html_url: "https://github.com/yashrana23",
  followers_url: "https://api.github.com/users/yashrana23/followers",
  following_url:
    "https://api.github.com/users/yashrana23/following{/other_user}",
  gists_url: "https://api.github.com/users/yashrana23/gists{/gist_id}",
  starred_url: "https://api.github.com/users/yashrana23/starred{/owner}{/repo}",
  subscriptions_url: "https://api.github.com/users/yashrana23/subscriptions",
  organizations_url: "https://api.github.com/users/yashrana23/orgs",
  repos_url: "https://api.github.com/users/yashrana23/repos",
  events_url: "https://api.github.com/users/yashrana23/events{/privacy}",
  received_events_url:
    "https://api.github.com/users/yashrana23/received_events",
  type: "User",
  user_view_type: "public",
  site_admin: false,
  name: "Yash Rana",
  company: null,
  blog: "",
  location: "Surat, Gujarat, India",
  email: null,
  hireable: null,
  bio: null,
  twitter_username: null,
  public_repos: 6,
  public_gists: 0,
  followers: 1,
  following: 0,
  created_at: "2025-06-26T13:55:02Z",
  updated_at: "2025-09-03T07:11:50Z",
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/demo", (req, res) => {
  res.send("This is demo page.");
});

app.get("/login", (req, res) => {
  res.send("<h1>Please login at chai aur code</h1>");
});

app.get("/youtube", (req, res) => {
  res.send("<h2>This is youtube</h2>");
});

app.get("/github", (req, res) => {
  res.json(githubData)
})
// listen server constanly without terminating to it.
app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});

// azur, aws, digitalocean
