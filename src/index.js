const {send} = require('micro');
const auth = require('basic-auth');

require('dotenv').config();

const ALLOWED_HTTP_METHOD = 'POST';
const USER_PASS = process.env.password;

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Request-Method", ALLOWED_HTTP_METHOD);
  const {method} = req;

  if (method !== ALLOWED_HTTP_METHOD) {
    send(res, 405);
  }

  const user = auth(req);

  if (user.pass === USER_PASS) {
    send(res, 200, 'Success');
  } else {
    send(res, 401);
  }
}
