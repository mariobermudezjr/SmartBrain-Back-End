const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signIn = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'macbookpro',
    password: '',
    database: 'smart-brain'
  }
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('It is working');
});

// Signin user given the correct object (manually for now)
app.post('/signin', signIn.handleSignIn(db, bcrypt));

// Register user given all fields
app.post('/register', register.handleRegister(db, bcrypt));

// Load user profile information such as name and entries
app.get('/profile/:id', profile.handleProfile(db));

// Hanlde increasing the entries
app.put('/image', image.handleImage(db));
app.post('/imageurl', (req, res) => {
  image.handleApiCall(req, res);
});

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT} or 3000`);
});
