import * as express from 'express';
import * as path from 'path';
export var router = express.Router();
import { __dirname } from '../app.js';

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(__dirname);
  let resolved_path = path.resolve(__dirname, 'views', 'index.html');
  res.sendFile(resolved_path);
});

// module.exports = router;


