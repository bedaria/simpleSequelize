var express = require('express');
var app = express();
require('./models.js')

app.listen(3000, () => console.log("Listening on port 3000"))
