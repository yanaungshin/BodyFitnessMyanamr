const express = require('express');
const router = express.Router();

router.get("/", ensureAuthenticated, function(req, res){
  res.render("error", {});
});

module.exports = router;
