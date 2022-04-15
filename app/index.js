var express = require('express');
const Datastore = require('nedb');

var app = express();

app.use(express.static('src'));
app.use(express.static('../blindauction-contract/build/contracts'));
app.use(express.json({ limit: '1mb' }));

app.get('/', function (req, res) {
  res.render('index.html');
});

app.listen(3000, function () {
  console.log('Auction Dapp listening on port 3000!');
});

const database = new Datastore('database.db');
database.loadDatabase();

app.get('/api', (request, response) => {
  database.find({}, (err, data) => {
    if (err) {
      response.end();
      return;
    }
    response.json(data);
    console.log(response.json(data));
  });
});

app.post('/api', (request, response) => {
  const data = request.body;
  database.insert(data);
  response.json(data);
});