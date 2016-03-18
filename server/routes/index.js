var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var router = express.Router();
var pg = require('pg');
var quantity = require('../modules/generateRandomNumber.js');

var connectionString = '';

if (process.env.DATABASE_URL != undefined) {
  connectionString = process.env.DATABASE_URL + 'ssl';
} else {
  connectionString = 'postgres://localhost:5432/zoo_animals';
}

router.post('/animals', function(req, res) {
  console.log('body: ', req.body);
pg.connect(connectionString, function(err, client, done){
  if (err) {
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
      done();
    } else {
      var start = client.query('CREATE TABLE IF NOT EXISTS employees (' +
                              'id SERIAL NOT NULL,' +
                              'animal varchar(255) NOT NULL,' +
                              'quantity varchar(255) NOT NULL,' +
                              'CONSTRAINT employees_pkey PRIMARY KEY (id))');

      var animal = req.body.animal;

      var query = client.query('INSERT INTO animals (animal, quantity) VALUES ($1, $2)' +
                                'RETURNING id, animal, quantity', [animal, quantity]);

      var result = [];

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        res.send(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
})


router.get('/animals', function(req, res) {
  //console.log('body: ', req.body);
  var animal = req.body.animal;

  // connect to DB
  pg.connect(connectionString, function(err, client, done){
    if (err) {
      done();
      console.log('Error connecting to DB: ', err);
      res.status(500).send(err);
    } else {
      var result = [];

      var query = client.query('SELECT * FROM animals ORDER BY id DESC;');

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function() {
        done();
        return res.json(result);
      });

      query.on('error', function(error) {
        console.log('Error running query:', error);
        done();
        res.status(500).send(error);
      });
    }
  });
});

router.get('/*', function(req, res){
var filename = req.params[0] || 'views/index.html';
res.sendFile(path.join(__dirname, '../public/', filename));

});


module.exports = router;
