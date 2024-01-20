import * as express from 'express';
import * as path from 'path';
export var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname, '../views', 'index.html'));
});

// module.exports = router;
