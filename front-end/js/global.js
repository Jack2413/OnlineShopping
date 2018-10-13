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
			$('#InputText').text('password must have at least 6 digits');
			
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
		var text = !email.match(/[@]+/)?'Unvaild Email':'Vaild'
		$('#EmailText').text(text);
		
	});

	$('#ConfirmPassword').keyup(function(){
		if($('#InputPassword').val()==''||$('#ConfirmPassword').val()==''){
			$('#ConfirmText').text('');
			return;
		}
			var reply = $('#InputPassword').val()===$('#ConfirmPassword').val()?
			'Password match':'Password Unmatch'
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
				dataType: "json",

		});//.then(feedback, ERROR_LOG);
		alert($username+' '+$email+' '+$password);
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
				dataType: "json",

		}).then (feedback, ERROR_LOG);
		alert($email+' '+$password);
	});

	$('#RegisterButton').click(function(){
		//var text = "123";
		//var text= $.md5('123');
		//var rand = '22';//crypto.randomBytes('csprng');
		//alert(bytes);
		window.open('./register.html');

		//window.location.replace('./register.html');
		//window.location.href='./register.html';
	
	});

	function feedback(tasks){
		console.log(tasks);
		alert(tasks);
	}
});



