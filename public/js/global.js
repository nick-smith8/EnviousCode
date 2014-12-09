/**
 * @file Manages UI event interaction throughout the app
 */

/**
 * Makes an AJAX call to get the highscore data and populates it visually
 */
$(document).ready(function() {
	var tableContent = '';
	$.getJSON( 'users/get_highscores', function(data) {
		highscoreData = data;
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td>' + this.username + '</td>';
			tableContent += '<td>' + this.score + '</td>';
			tableContent += '</tr>';
		});
		$('#highscore table tbody').html(tableContent);
	});
});

/**
 * Submit login attempt and act based on response
 */
$('.login-submit').click(function(event) {
  event.preventDefault();
  var user = $('.loginform #user').val();
  var pass = $('.loginform #pass').val();
  $('.loginform #password').val('');

  $.post( 'users/login', {user: user, pass: pass}, function(data) {
  	if (data === '0') {
  		// Load lobby
  		console.log('logged in');
  		window.location.href += 'lobby';
  	}
  	else
  		swal({
  			title: data,
  			timer: 3000
  		});
  });

});

/**
 * Submit new account request and act based on response
 */
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
			swal('Account created successfully');
			$('.return-to-signin').click();
		}
		else
			swal({
				title: data,
				timer: 3000
			});
	});
})

/**
 * Directs to create account screen
 */
$('.create-account').click(function(event) {
  window.location.href += 'create';
});

/**
 * Directs to game screen
 */
$('.start-game').click(function(event) {
  window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')+1) + 'game';
});

/**
 * Directs to sign-in screen
 */
$('.return-to-signin').click(function(event) {
  window.location.href = window.location.href.substring(0, window.location.href.lastIndexOf('/')+1);
});
