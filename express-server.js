const express = require("express");
const app = express();
const PORT = 8080;

const {emailLookUp} = require('./helpers');
const {urlsForUser} = require("./helpers");
const {generateRandomString} = require("./helpers");

const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');


const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const cookieSession = require('cookie-session');


app.use(cookieSession({
  name: 'session',
  keys: ["thisKeyIsSupperSecure", "poShkruajShqipePseJo"],
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));



 

 
///////////Users Database //////////////
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", salt)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", salt)
  }
};
///////////URL Database //////////////
let urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userId:"userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userId: "user2RandomID"}
};
 
 


////////////////////////  GET ////////////////////////
app.get("/urls", (req, res) => {
  const user = req.session.user_id;
  console.log(urlDatabase);
  //check if user not logged
  if (!user) {
    res.redirect("/login");
  } else {
    let templateVars = {
      urls: urlsForUser(user, urlDatabase),
      user: users[req.session.user_id]
    };
    res.render("urls_index", templateVars);
  }
});
 
 
app.get("/urls/new", (req, res) => {
  const user = req.session.user_id;
  //check if user not logged
  if (!user) {
    res.redirect("/login");
  } else {
    let templateVars = {user: users[req.session.user_id]};
    res.render("urls_new", templateVars);
  }
});
 
 
app.get("/urls/:shortURL", (req, res) => {
  const user = req.session.user_id;
  const urlDataUser = urlsForUser(user, urlDatabase);
 
  if (!user) {
    res.redirect("/login");
  } else if (urlDataUser[req.params.shortURL] === undefined) {
    res.send("you don't own this URL please longin");
  } else {
    let templateVars = {
      shortURL: req.params.shortURL,
      longURL: urlDataUser[req.params.shortURL].longURL,
      user: user
    };
   
    res.render("urls_show", templateVars);
  }
});
 
 
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
 

app.get("/login", (req, res) => {
  let templateVars = {user: users[req.session.user_id]};
  res.render("login", templateVars);
});
 
 
app.get("/register", (req, res) => {
  let templateVars = {user: users[req.session.user_id]};
  res.render("register", templateVars);
});
 

////////////////////////  POST ////////////////////////
 
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = {longURL: req.body.longURL, userId: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});
 

//deleting the urls
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = req.session.user_id;
  const urlDataUser = urlsForUser(user, urlDatabase);
 
  if (!user) {
    res.redirect("/login");
  } else if (urlDataUser[req.params.shortURL] === undefined) {
    res.send("You don't own this url")
  } else {
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  }
 
});
 

//updating url
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = {longURL: req.body.newURL, userId: req.session.user_id};
  res.redirect(`/urls/${shortURL}`);
});
 
//login
app.post("/login", (req, res) => {
  const submEmail = req.body.email;
  console.log(submEmail);
  console.log(users);
  const user = emailLookUp(submEmail, users);

  //checking if email excist
  if (user) {
    //comparing passwords
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.user_id = user.id;
      res.redirect("/urls");
    } else {
      res.status(403).send("Email and password did not match");
    }
  } else {
    res.status(400).send("User not found");
  }
});
 
//logout
app.post("/logout", (req, res) => {
  delete req.session.user_id;
  res.redirect("/urls");
});
 
//register
app.post("/register", (req, res) => {
  const userId = generateRandomString();
  //check if email or password empty => Error
  if (req.body.email === "" || req.body.password === '') {
    res.status(400).send("Please fill Email and password");
  }
  //check if email already in the database => Error
  const submEmail = req.body.email;
  const user = emailLookUp(submEmail, users);
  if (user) {
    res.status(409).send("The email adress already registerd");
  }
  //create a new user
  users[userId] = {
    id: userId,
    email: req.body.email,
    
    password: bcrypt.hashSync(req.body.password, salt)
  };
  req.session.user_id = users[userId]["id"];
  res.redirect("/urls");
});
  
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});