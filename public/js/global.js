
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

//Confirm login
$('.login-submit').click(function(event) {
  event.preventDefault();
  //Post go here
  alert("BOO");
});

//Confirm new account
$('.create-submit').click(function(event) {
	event.preventDefault();
	//Post go here

	$.post( 'users/create_account', {name: "Falcon"}, function(data) {
		alert(data);
	});
})

