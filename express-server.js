const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
 
 
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
 
////////////////Functions///////////////
 
//random string
const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
};
 
//checking if the email is already in the database
const EmailLookUp = function(submEmail) {
  for (let user in users) {
    if (submEmail === users[user]["email"]) {
      const userData = users[user];
      return userData;
    }
  }
};
 
//Checking if loged
// const userNotLog = function(user) {
//   if (Object.keys(user).length === 0) {
//     return false;
//   }
// };

const urlsForUser = function(user) {
  const userUrlDatabase = {};
  for (const url in urlDatabase) {
    if (urlDatabase[url].userId === user) {
      userUrlDatabase[url] = {longURL: urlDatabase[url].longURL};
    }
  }
  
  return userUrlDatabase;
};
 
///////////Users Database //////////////
const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
///////////URL Database //////////////
let urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userId:"userRandomID"},
  "9sm5xK": {longURL: "http://www.google.com", userId: "user2RandomID"}
};
 
 
 
 
app.get("/urls", (req, res) => {
  const user = req.cookies.user_id;
  //check if user not logged
  if (!user) {
    res.redirect("/login");
  } else {
    let templateVars = {
      urls: urlsForUser(user),
      user: users[req.cookies.user_id]
    };
    console.log(templateVars);
    res.render("urls_index", templateVars);
  }
   
});
 
 
app.get("/urls/new", (req, res) => {
  const user = req.cookies.user_id;
  //check if user not logged
  if (!user) {
    res.redirect("/login");
  } else {
    let templateVars = {user: users[req.cookies.user_id]};
    res.render("urls_new", templateVars);
  }
});
 
 
app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user: users[req.cookies.user_id]
  };
 
  res.render("urls_show", templateVars);
 
});
 
 
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});
 
app.get("/login", (req, res) => {
  let templateVars = {user: users[req.cookies.user_id]};
  res.render("login", templateVars);
});
 
 
app.get("/register", (req, res) => {
  let templateVars = {user: users[req.cookies.user_id]};
  res.render("register", templateVars);
});
 
 
 
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect(`/urls/${shortURL}`);
});
 
 
//deleting the urls
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});
 
//updating url
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.newURL;
  res.redirect(`/urls/${shortURL}`);
});
 
//login
app.post("/login", (req, res) => {
  const userEmail = req.body.email;
  const user = EmailLookUp(userEmail);
  //checking if email excist
  if (user) {
    //comparing passwords
    if (req.body.password === user.password) {
      res.cookie("user_id", user.id);
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
  res.clearCookie("user_id");
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
  const userEmail = req.body.email;
  const user = EmailLookUp(userEmail);
  if (user) {
    res.status(409).send("The email adress already registerd");
  }
  //create a new user
  users[userId] = {
    id: userId,
    email: req.body.email,
    password: req.body.password
  };
  
  res.cookie("user_id", users[userId]["id"]);
  res.redirect("/urls");
});
  
  
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});