'use strict';

var db = require('../config/db');

db.run('CREATE TABLE IF NOT EXISTS grades (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, score INTEGER, total INTEGER)');

exports.get = function(cb) {
    db.all('SELECT * FROM grades', cb);
};

exports.getOneById = function(id, cb) {
    db.get('SELECT * FROM grades WHERE id = ?', id, cb);
};

exports.getScoreTotal = function(cb) {
    db.get('SELECT sum(score) AS "Total Score" FROM grades', cb);
};

exports.getPossibleTotal = function(cb) {
    db.get('SELECT sum(total) AS "Total Possible" FROM grades', cb);
};

exports.create = function(assignment, cb) {
    if (!assignment.name || !assignment.score || !assignment.total) {
        return cb('Missing required field.');
    }

    db.run('INSERT INTO grades (name, score, total) VALUES (?, ?, ?)', assignment.name, assignment.score, assignment.total, (err) => {
        if (err) return cb(err);

        db.get('SELECT * FROM grades WHERE id = (SELECT MAX(id) FROM grades)', cb);
    });
};

exports.removeById = function(id, cb) {
    if (!id) return cb('Assignment id required.');

    db.run(`DELETE FROM grades WHERE id='${id}'`, function(err) {
        cb(err);
    });
};

exports.updateById = function(id, newAssignment, cb) {
    if (!id) return cb('Assignment id required.');

    if (!newAssignment.name || !newAssignment.score || !newAssignment.total) {
        return cb('Missing required field.');
    }

    db.run('UPDATE grades SET name = $name, score = $score, total = $total WHERE id = $id', {
        $name: newAssignment.name,
        $score: newAssignment.score,
        $total: newAssignment.total,
        $id: id
    }, cb);
};