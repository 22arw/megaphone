const jwt = require('jsonwebtoken');
const secret = process.env.SESSION_SECRET;

const TOKEN = {
  generate(user) {
    let generated = jwt.sign(
      {
        data: user
      },
      secret,
      {
        expiresIn: 60 * 200
      }
    );
    return generated;
  },
  isValid(token, res, callback) {
    return jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        return res.sendStatus(401);
      }
      callback && callback(decoded);
    });
  }
};
module.exports = TOKEN;
