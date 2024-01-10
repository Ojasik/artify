const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
require('dotenv').config();

const password = encodeURIComponent(process.env.DB_PASSWORD);
const uri = `mongodb+srv://ojasik:${password}@artify.ez4dwrl.mongodb.net/artify?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(uri);

app.use('/api/users', usersRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
