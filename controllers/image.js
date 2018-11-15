const Clarifai = require('clarifai');

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
  apiKey: '58ed09afad2d4868aab4e192c20a3745'
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
      return res.json(data);
    })
    .catch(err => {
      return res.status(400).json('Unable to work with API');
    });
};
const handleImage = db => (req, res) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(error => res.status(400).json('Unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall
};
