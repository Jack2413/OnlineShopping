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
		if(password.length > 6){
			strength += 20
		}
		switch(strength){
			case 20: $('#InputText').text('Very weak'); break
			case 40: $('#InputText').text('Weak'); break
			case 60: $('#InputText').text('Good'); break
			case 80: $('#InputText').text('Strong'); break
			case 100: $('#InputText').text('Very Strong'); break
		}

		$('#strength').val(strength);
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
});
