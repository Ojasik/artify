const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const artworksRoute = require('./routes/artworks');
const cartRoute = require('./routes/cart');
const shippingRateRoute = require('./routes/shippingrates');
const ordersRoute = require('./routes/orders');
const cron = require('./cron');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const password = encodeURIComponent(process.env.DB_PASSWORD);
const uri = `mongodb+srv://ojasik:${password}@artify.ez4dwrl.mongodb.net/artify?retryWrites=true&w=majority`;

const app = express();
app.use(cookieParser());

const corsOptions = {
  origin: 'https://elaborate-cassata-915979.netlify.app/',
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(uri);

app.use('/api/artworks', artworksRoute);
app.use('/api/users', usersRoute);
app.use('/api/cart', cartRoute);
app.use('/api/shippingrates', shippingRateRoute);
app.use('/api/orders', ordersRoute);

app.use(express.static(path.join(__dirname, 'build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

cron();

const port = process.env.PORT || 8000; // Use the environment port or default to 8000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
