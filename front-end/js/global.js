var url = 'https://nwen304onlineshoping.herokuapp.com';
var ERROR_LOG = console.error.bind(console);
$(document).ready(function(e) {

	$('#InputPassword').keyup(function () {
		//var strengthBar = $('#strength');
		var strength = 0;
		var password = $('#InputPassword').val();

		
		if (password.match(/[a-z]+/)){
			strength += 20
		}
		if (password.match(/[A-Z]+/)){
			strength += 20
		}
		if (password.match(/[0-9]+/)){
			strength += 20
		}
		if (password.match(/[<>?~]+/)){
			strength += 20
		}
		if (password.match(/[!@#$%^&*()]+/)) {
			strength += 20
		}
		if(password.length > 5){
			strength += 20
		}
		switch(strength){
			case 20: $('#InputText').text('Very weak'); break
			case 40: $('#InputText').text('Weak'); break
			case 60: $('#InputText').text('Good'); break
			case 80: $('#InputText').text('Strong'); break
			case 100: $('#InputText').text('Very Strong'); break
		}

		if(password.length<6){
			$('#InputText').removeClass("vaild");
			$('#InputText').text('password must have at least 6 digits');
		}else{
			$('#InputText').addClass("vaild");
		}
		if(password.length==0){
			$('#InputText').text('');
		}

		$('#strength').val(strength);
	});

	$('#InputEmail').change(function(){
		var email = $('#InputEmail').val();
		if(email==''){
			$('#EmailText').text('');
			return;
		}

		var text;
		if(!email.match(/[@]+/)){
			text = 'Unvaild Email';
			$('#EmailText').removeClass("vaild");
		}else{
			text = 'Vaild';
			$('#EmailText').addClass("vaild");
		}
		$('#EmailText').text(text);
		
	});

	$('#ConfirmPassword').keyup(function(){
		if($('#InputPassword').val()==''||$('#ConfirmPassword').val()==''){
			$('#ConfirmText').text('');
			return;
		}

		var reply;
		if($('#InputPassword').val()===$('#ConfirmPassword').val()){
			reply = 'Password match';
			$('#ConfirmText').addClass("vaild");
		}else{
			$('#ConfirmText').removeClass("vaild");
			reply ='Password Unmatch';
		}
		$('#ConfirmText').text(reply);
	});

	$('#submitButton').click(function() {
		var $username = $('#InputUsername').val();
		var $email = $('#InputEmail').val();
		var $password = $('#InputPassword').val();

		if(!$email.match(/[@]+/)||$password.length<6){
			return;
		}

		$.ajax({
				method: 'POST',
				url: url+'/register',
				data: JSON.stringify({
					username: $username,
					email: $email,
					password: $password
				}),
				contentType: "application/json",

		}).then (
		function(feedback){
			alert(feedback);
			window.location.href = url;
			
		}, 
		function(error){
			alert(error);

		});
		//alert($username+' '+$email+' '+$password);
	});

	$('#loginButton').click(function() {
		var $email = $('#login_InputEmail').val();
		var $password = $('#login_InputPassword').val();
		//alert($email+' '+$password);
		if(!$email.match(/[@]+/)||$password.length<6){
			return;
		}

		$.ajax({
				method: 'POST',
				url: url+'/login',
				data: JSON.stringify({
					email: $email,
					password: $password
				}),
				contentType: "application/json",

		}).then (
		function(feedback){
			alert(feedback);
		}, 
		function(error){
			alert(error);
		});

		//alert($email+' '+$password);
	});

	$('#RegisterButton').click(function(){
		window.location.href = 'https://nwen304onlineshoping.herokuapp.com/register.html';
	});
	$('#loginPageButton').click(function(){
		window.location.href = url;
	});
});



