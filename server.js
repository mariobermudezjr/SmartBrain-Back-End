const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

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

const dataBase = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Mike',
      email: 'mike@gmail.com',
      password: 'cookie',
      entries: 0,
      joined: new Date()
    },
    {
      id: '125',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '987',
      hash: '',
      email: 'john@gmail.com'
    }
  ]
};

app.get('/', (req, res) => {
  res.send(dataBase.users);
});

// Signin user given the correct object (manually for now)
app.post('/signin', (req, res) => {
  // Load hash from your password DB.
  bcrypt.compare('apples', '$2a$10$TYpP1w3iyH3jAaIwyNfEUuTvv6pyIUlyJgbq8alCHAzgqJckyOXBW', function(
    err,
    res
  ) {
    console.log('First Guess: ', res);
  });
  bcrypt.compare(
    'veggies',
    '$2a$10$TYpP1w3iyH3jAaIwyNfEUuTvv6pyIUlyJgbq8alCHAzgqJckyOXBW',
    function(err, res) {
      console.log('Second Guess: ', res);
    }
  );

  if (
    req.body.email === dataBase.users[0].email &&
    req.body.password === dataBase.users[0].password
  ) {
    res.json(dataBase.users[0]);
  } else {
    res.status(400).json('Error logging in');
  }
  res.json('Sign In');
});

// Register user given all fields
app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  db('users')
    .returning('*')
    .insert({
      email: email,
      name: name,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch(error => res.status(400).json('Unable to register user'));
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json('Not found');
      }
    })
    .catch(error => res.status(400).json('Unable to get user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;

  dataBase.users.forEach(user => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json('User not found');
  }
});

// // Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });

app.listen(3000, () => {
  console.log('App is running on app 3000');
});
