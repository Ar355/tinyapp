

const emailLookUp = function(submEmail, database) {
  for (let user in database) {
    if (submEmail === database[user]["email"]) {
      const userData = database[user];
      return userData;
    }
  }
};

module.exports = {emailLookUp};