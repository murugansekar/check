const path = require('path');
const fs = require('fs')
const express = require('express');
const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser');
var cors = require('cors')
const app = express();
app.use(cors())
const routes = require('./routes/general');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());   
app.use(express.static(path.join(__dirname, 'public')));
app.use(routes);
app.use((req, res) => {
  res.sendFile(path.join(__dirname,`public/${req.url}`))
});
app.listen(3000);
