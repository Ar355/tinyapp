const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: "http://www.lighthouselabs.ca" };
  res.render("urls_show", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});