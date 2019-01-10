const fs = require('fs');
const mime = require('mime');
const {send} = require('micro');
const auth = require('basic-auth');

require('dotenv').config();

const ALLOWED_HTTP_METHOD = 'POST';
const USER_PASS = process.env.password;

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Request-Method', ALLOWED_HTTP_METHOD);
  const {method, url} = req;

  if (method === ALLOWED_HTTP_METHOD) {
    const user = auth(req);
    const file = `./tmp/${url}`;

    if (user.pass === USER_PASS) {
      fs.access(file, fs.constants.F_OK, error => {
        if (error) {
          send(res, 404);
        }

        fs.readFile(file, (error, data) => {
          if (error) {
            send(res, 500);
          } else {
            res.setHeader('Content-type', mime.getType(file));
            send(res, 200, data);
          }
        });
      });
    } else {
      send(res, 401);
    }
  } else {
    send(res, 405);
  }
};
