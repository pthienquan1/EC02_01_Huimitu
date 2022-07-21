const User = require("../app/models/User");

async function isUserExit(email) {
    const check =  await User.findOne({
      email: email,
      raw: true,
    });
    return check;
  }

module.exports = { isUserExit };

