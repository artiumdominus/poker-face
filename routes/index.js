var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Poker face', description: 'Poker hand comparing tool' });
});

/* POST poker queries. */
router.post('/poker-compare', (req, res) => {
  
  return res.json({ winner: "player1" });
});

module.exports = router;
