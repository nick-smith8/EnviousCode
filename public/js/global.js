
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

$('.create-account').click(function(event) {
  window.location.href += 'create'
});

$('.return-to-signin').click(function(event) {
  window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')+1)
});

//Confirm new account
$('.create-submit').click(function(event) {
	event.preventDefault();
	//Post go here
	var user = $('.createform #newuser').val();
	var pass = $('.createform #newpass1').val();
	var confirmpass = $('.createform #newpass2').val();
    // Reset form
	$('.createform #newpass1').val('');
	$('.createform #newpass2').val('');
	$.post( 'users/create_account', {user: user, pass: pass, confirmpass: confirmpass}, function(data) {
		if (data === '0') {
			alert('Account created successfully');
			$('.return-to-signin').click();
		}
		else
			alert(data);
	});
})

