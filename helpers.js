
/////////// look up for user by Emal
const emailLookUp = function(submEmail, database) {
  for (let user in database) {
    if (submEmail === database[user]["email"]) {
      const userData = database[user];
      return userData;
    }
  }
};

////generate radom String
const generateRandomString = function() {
  return Math.random().toString(36).substring(2,8);
};

//checking if the email is already in the database

const urlsForUser = function(user, database) {
  const userUrlDatabase = {};
  for (const url in database) {
    if (database[url].userId === user) {
      userUrlDatabase[url] = {longURL: database[url].longURL, userId: database[url].userId};
    }
  }
  
  return userUrlDatabase;
};

module.exports = {emailLookUp, generateRandomString, urlsForUser};
// module.exports = {generateRandomString};
// module.exports = {urlsForUser};