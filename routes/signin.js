import * as express from 'express';
import * as path from 'path';
export var router = express.Router();
import { __dirname } from '../app.js';
import { db_client } from '../middleware/db.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("HITTING LOGIN");
  let resolved_path = path.resolve(__dirname, 'views', 'signin.html');
  res.sendFile(resolved_path);
});

router.post('/', function(req, res, next) {
  console.log("SIGN IN POST");

  let username = req.body.username,
      password = req.body.password;

  console.log(`Username: ${username}, Password: ${password}`);
  
  db_client.db(process.env.DB).collection("users").insertOne({
    username: username,
    password: password
  }).then(result => {
    console.log(`Inserted user: ${username}\npassword: ${password}`);
    res.statusCode = 200;
    return res;
  }).catch(error => {
    console.error(error);
    res.statusCode = 500;
    return res;
  });

  
});

// module.exports = router;


