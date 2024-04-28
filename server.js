const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const artworksRoute = require('./routes/artworks');
const cartRoute = require('./routes/cart');
const cron = require('./cron');
require('dotenv').config();

const password = encodeURIComponent(process.env.DB_PASSWORD);
const uri = `mongodb+srv://ojasik:${password}@artify.ez4dwrl.mongodb.net/artify?retryWrites=true&w=majority`;

const app = express();

app.use(cors());
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(uri);

app.use('/api/artworks', artworksRoute);
app.use('/api/users', usersRoute);
app.use('/api/cart', cartRoute);

cron();

const PORT = process.env.PORTD;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
