'use strict';

const PORT = process.env.PORT || 3000;

var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var Grades = require('./models/grades');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.set('view engine', 'ejs');

app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
    Grades.get((err, assignments) => {
        if (err) {
            res.status(400).send(err);
        } else {
            Grades.getScoreTotal((err, totalScores) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    Grades.getPossibleTotal((err, totalPossible) => {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.render('index', {assignments: assignments, totalScores: totalScores, totalPossible: totalPossible});
                        }
                    });
                }
            });
        }
    });
});

app.listen(PORT, err => {
    console.log(err || `Server listening on port ${PORT}`);
});