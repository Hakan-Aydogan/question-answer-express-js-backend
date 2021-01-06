const bcryt = require("bcryptjs");
const validateUserInput = (email, password) => {
  return email && password;
};
const comparePasswords = (password, hashedPasword) => {
  return bcryt.compareSync(password, hashedPasword);
};
module.exports = { validateUserInput, comparePasswords };
