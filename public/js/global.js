var highscoreData = [];


//Working on how to fix this issue...
$(document).ready(function() {
	var tableContent = '';
	$.getJSON( 'users/get_highscores', function(data) {
		highscoreData = data;
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td>' + this.username + '</td>';
			tableContent += '<td>' + this.score + '</td>';
			tableContent += '<td>' + this.rank + '</td>';
			tableContent += '</tr>';
		});
		$('#highscore table tbody').html(tableContent);
	});
});


$('#login').submit(function(event) {
  event.preventDefault();

});


