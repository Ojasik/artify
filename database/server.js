const express = require('express');
const mongoose = require('mongoose');
const User = require('./User');
const password = encodeURIComponent('Nifertiti25');
const uri = `mongodb+srv://ojasik:${password}@artify.ez4dwrl.mongodb.net/artify?retryWrites=true&w=majority`;
console.log(uri);
const app = express();
mongoose.connect(uri);

app.listen(3001, () => {
  console.log('Server is running');
});
// Test
// const user = new User({ username: 'ojasik', password: 'ojasik', email: 'ojasik@gmail.com' });
// user.save().then(() => console.log('User saved'));
