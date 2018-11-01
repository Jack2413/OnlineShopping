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
		if(!isEmail(email)){
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
		var $confirmPassword = $('#ConfirmPassword').val();

		if(!isEmail($email)||$password.length<6||$password!=$confirmPassword){
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
				datatype: "json"

		}).then (
		function(result){
			alert(result.feedback);
			if(result.status==200){
				window.location.href = url+"/login.html";
			}
			
		}, 
		function(error){
			alert(error);

		});
		//alert($username+' '+$email+' '+$password);
	});

	$('#resetButton').click(function() {

		var $email = $('#InputEmail').val();
		var $oldpassword = $('#OldPassword').val();
		var $newpassword = $('#InputPassword').val();
		var $confirmPassword = $('#ConfirmPassword').val();

		if(!isEmail($email)||$newpassword.length<6||$newpassword!=$confirmPassword){
			return;
		}

		$.ajax({
				method: 'POST',
				url: url+'/reset',
				data: JSON.stringify({
					email: $email,
					oldpassword: $oldpassword,
					newpassword: $newpassword
				}),
				contentType: "application/json",
				datatype: "json"

		}).then (
		function(result){
			alert(result.feedback);
			if(result.status==200){
				window.location.href = url+"/login==.html";
			}
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
		if(!isEmail($email)){

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
				datatype: "json"

		}).then (
		function(result){
			alert(result.feedback);
			if(result.status==200){
				var HTML =  '<ul class="navbar-nav ml-auto">';
					HTML += '<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>';
	          		HTML += '<li class="nav-item"><a class="nav-link" href="cart.html">Cart</a></li>';
	          		HTML += '<li class="nav-item"><a class="nav-link" href="#">username</a></li>';
	          		HTML += '<li class="nav-item" id = logout>logout</li></ul>';
          		$('#navbarResponsive').remove();
				$('#navbarResponsive').prepend(HTML);
				window.location.href = window.location.href = url+"/index.html";;
			}
			
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
		window.location.href = url+"/login.html";
	}); 
});

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}


