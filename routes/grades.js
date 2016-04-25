'use strict';

var express = require('express');
var router = express.Router();

var Grades = require('../models/grades');

router.route('/').get((req, res) => {
    Grades.get((err, assignments) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.send(assignments);
    });
}).post((req, res) => {
    Grades.create(req.body, (err, newAssignment) => {
        if (err) {
            return res.status(400).send(err);
        }

        res.send(newAssignment);
    });
});

router.get('/totalscores', (req, res) => {
    Grades.getScoreTotal((err, result) => {
        if (err) return res.status(400).send(err);

        res.send(result);
    });
});

router.get('/totalpossible', (req, res) => {
    Grades.getPossibleTotal((err, result) => {
        if (err) return res.status(400).send(err);

        res.send(result);
    });
});

router.route('/:id').get((req, res) => {
    var id = req.params.id;

    Grades.getOneById(id, (err, assignment) => {
        if (err || !assignment) {
            return res.status(400).send(err || 'Assignment not found.');
        }

        res.send(assignment);
    });
}).put((req, res) => {
    var id = req.params.id;

    Grades.updateById(id, req.body, err => {
        res.send();
    });
}).delete((req, res) => {
    var id = req.params.id;

    Grades.removeById(id, err => {
        if (err) return res.status(400).send(err);

        res.send();
    });
});

module.exports = router;