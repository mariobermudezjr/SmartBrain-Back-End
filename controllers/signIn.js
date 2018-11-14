const handleSignIn = (db, bcrypt) => (req, res) => {
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      // Load hash from your password DB.
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash); // true

      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('Unable to get user'));
      } else {
        return res.status(400).json('Incorrect username and/or password');
      }
    })
    .catch(err => res.status(400).json('Wrong credentials'));
};

module.exports = {
  handleSignIn: handleSignIn
};
