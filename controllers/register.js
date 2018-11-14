const handleRegister = (db, bcrypt) => (req, res) => {
  const { email, name, password } = req.body;

  // Store hash in your password DB
  const hash = bcrypt.hashSync(password);

  // Transactions are used to rollback any commits to a DB that would otherwise result in an error.
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(error => res.status(400).json('Unable to register user'));
};

module.exports = {
  handleRegister: handleRegister
};
