'use strict';

$(document).ready(function() {
    $('.add-form').submit(addAssignment);
    $('.assignments').on('click', '.delete-btn', deleteAssignment);
    $('.assignments').on('click', '.edit-btn', editAssignment);
    $('.edit-form').submit(saveAssignment);
});

function addAssignment(event) {
    event.preventDefault();

    var assignment = {
        name: $('#name').val(),
        score: $('#score').val(),
        total: $('#total').val()
    };

    $('#name').val('');
    $('#score').val('');
    $('#total').val('');

    $.ajax({
        url: '/api/grades',
        method: 'POST',
        data: assignment,
        success: function(newAssignment) {
            var $assignment = $('.template').clone();
            $assignment.removeClass('template');

            $assignment.find('.name').text(newAssignment.name);
            $assignment.find('.score').text(newAssignment.score);
            $assignment.find('.total').text(newAssignment.total);
            $assignment.find('.grade').text(calculateLetterGrade(newAssignment.score / newAssignment.total));
            $assignment.find('.edit-btn').attr('data-id', newAssignment.id);
            $assignment.find('.delete-btn').attr('data-id', newAssignment.id);

            $('.assignments').append($assignment);

            updateTotals();
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function updateTotals() {
    $.get('/api/grades/totalscores', function (scoreData) {
        $('.total-scores').text(scoreData['Total Score']);

        $.get('/api/grades/totalpossible', function(totalData) {
            $('.total-possible').text(totalData['Total Possible']);
            
            $('.total-grade').text(calculateLetterGrade(scoreData['Total Score'] / totalData['Total Possible']));
        });
    });
}

function calculateLetterGrade(score) {
    if (score >= .9) {
        return 'A';
    } else if (score >= .8) {
        return 'B';
    } else if (score >= .7) {
        return 'C';
    } else if (score >= .6) {
        return 'D';
    } else {
        return 'F';
    }
}

function deleteAssignment() {
    var id = $(this).attr('data-id');
    var $assignment = $(this);

    $.ajax({
        url: '/api/grades/' + id,
        method: 'DELETE',
        success: function() {
            $assignment.closest('tr').remove();
            updateTotals();
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}

function editAssignment() {
    var id = $(this).attr('data-id');

    $.ajax({
        url: '/api/grades/' + id,
        method: 'GET',
        success: function(data) {
            $('#edit-name').val(data.name);
            $('#edit-score').val(data.score);
            $('#edit-total').val(data.total);
            $('#edit-id').val(data.id);
        }
    });
}

function saveAssignment(event) {
    event.preventDefault();

    var id = $('#edit-id').val();

    var assignment = {
        name: $('#edit-name').val(),
        score: $('#edit-score').val(),
        total: $('#edit-total').val()
    };

    $.ajax({
        url: '/api/grades/' + id,
        method: 'PUT',
        data: assignment,
        success: function() {
            var $assign = $('.assignments').find('[data-id="' + id + '"]');
            var $prevRow = $assign.closest('tr').prev();

            $assign.closest('tr').remove();

            var $assignment = $('.template').clone();
            $assignment.removeClass('template');

            $assignment.find('.name').text(assignment.name);
            $assignment.find('.score').text(assignment.score);
            $assignment.find('.total').text(assignment.total);
            $assignment.find('.grade').text(calculateLetterGrade(assignment.score / assignment.total));
            $assignment.find('.edit-btn').attr('data-id', id);
            $assignment.find('.delete-btn').attr('data-id', id);

            $prevRow.after($assignment);

            updateTotals();

            $('#edit-name').val('');
            $('#edit-score').val('');
            $('#edit-total').val('');
            $('#edit-id').val('');

            $('#editModal').modal('hide');
        },
        error: function(err) {
            console.error('error:', err);
        }
    });
}