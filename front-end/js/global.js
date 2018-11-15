var url = "https://nwen304onlineshoping.herokuapp.com";
var ERROR_LOG = console.error.bind(console);
$(document).ready(function(e) {
  reload();
  $("#InputPassword").keyup(function() {
    //var strengthBar = $('#strength');
    var strength = 0;
    var password = $("#InputPassword").val();

    if (password.match(/[a-z]+/)) {
      strength += 20;
    }
    if (password.match(/[A-Z]+/)) {
      strength += 20;
    }
    if (password.match(/[0-9]+/)) {
      strength += 20;
    }
    if (password.match(/[<>?~]+/)) {
      strength += 20;
    }
    if (password.match(/[!@#$%^&*()]+/)) {
      strength += 20;
    }
    if (password.length > 5) {
      strength += 20;
    }
    switch (strength) {
      case 20:
        $("#InputText").text("Very weak");
        break;
      case 40:
        $("#InputText").text("Weak");
        break;
      case 60:
        $("#InputText").text("Good");
        break;
      case 80:
        $("#InputText").text("Strong");
        break;
      case 100:
        $("#InputText").text("Very Strong");
        break;
    }

    if (password.length < 6) {
      $("#InputText").removeClass("vaild");
      $("#InputText").text("password must have at least 6 digits");
    } else {
      $("#InputText").addClass("vaild");
    }
    if (password.length == 0) {
      $("#InputText").text("");
    }

    $("#strength").val(strength);
  });

  $("#InputEmail").change(function() {
    var email = $("#InputEmail").val();
    if (email == "") {
      $("#EmailText").text("");
      return;
    }

    var text;
    if (!isEmail(email)) {
      text = "Unvaild Email";
      $("#EmailText").removeClass("vaild");
    } else {
      text = "Vaild";
      $("#EmailText").addClass("vaild");
    }
    $("#EmailText").text(text);
  });

  $("#ConfirmPassword").keyup(function() {
    if ($("#InputPassword").val() == "" || $("#ConfirmPassword").val() == "") {
      $("#ConfirmText").text("");
      return;
    }

    var reply;
    if ($("#InputPassword").val() === $("#ConfirmPassword").val()) {
      reply = "Password match";
      $("#ConfirmText").addClass("vaild");
    } else {
      $("#ConfirmText").removeClass("vaild");
      reply = "Password Unmatch";
    }
    $("#ConfirmText").text(reply);
  });

  $("#submitButton").click(function() {

  	var isChecked = $('#agree').prop('checked');
  	if(!isChecked){
  		alert("You have to agree the Terms and Conditions and Privacy Policy before you submit.");
  		return;
  	}

    var $username = $("#InputUsername").val();
    var $email = $("#InputEmail").val();
    var $password = $("#InputPassword").val();
    var $confirmPassword = $("#ConfirmPassword").val();

    if (
      !isEmail($email) ||
      $password.length < 6 ||
      $password != $confirmPassword
    ) {
      return;
    }

    $.ajax({
      method: "POST",
      url: url + "/register",
      data: JSON.stringify({
        username: $username,
        email: $email,
        password: $password
      }),
      contentType: "application/json",
      datatype: "json"
    }).then(
      function(result) {
        alert(result.feedback);
        if (result.status == 200) {
          window.location.href = url + "/login.html";
        }
      },
      function(error) {
        alert(error.feedback);
      }
    );
    //alert($username+' '+$email+' '+$password);
  });

  $("#resetButton").click(function() {
    var $email = $("#InputEmail").val();
    var $oldpassword = $("#OldPassword").val();
    var $newpassword = $("#InputPassword").val();
    var $confirmPassword = $("#ConfirmPassword").val();

    if (
      !isEmail($email) ||
      $newpassword.length < 6 ||
      $newpassword != $confirmPassword
    ) {
      return;
    }

    $.ajax({
      method: "PUT",
      url: url + "/reset",
      data: JSON.stringify({
        email: $email,
        oldpassword: $oldpassword,
        newpassword: $newpassword
      }),
      contentType: "application/json",
      datatype: "json"
    }).then(
      function(result) {
        alert(result.feedback);
        if (result.status == 200) {
          window.location.href = url + "/login.html";
        }
      },
      function(error) {
        alert(error);
      }
    );
    //alert($username+' '+$email+' '+$password);
  });

  $("#loginButton").click(function() {
    var $email = $("#login_InputEmail").val();
    var $password = $("#login_InputPassword").val();
    //alert($email+' '+$password);
    if (!isEmail($email)) {
      return;
    }

    $.ajax({
      method: "POST",
      url: url + "/login",
      data: JSON.stringify({
        email: $email,
        password: $password
      }),
      contentType: "application/json",
      datatype: "json"
    }).then(
      function(result) {
      	alert(result.feedback);
        if (result.status == 200) {
          window.localStorage.setItem("login_state", "login");
          window.localStorage.setItem("username", result.username);
          window.localStorage.setItem("email", $email);
          window.localStorage.setItem("permission", result.permission);
          window.location.href = "index.html";
        }
      },
      function(error) {
        alert(error);
      }
    );

    //alert($email+' '+$password);
  });

  $('#ForgotResetButton').click(function() {
  	var $email = $("#ForgotInputEmail").val();
  	if (!isEmail($email)) {
  		alert("Is Not Vaild Email")
      	return;
    }

    $.ajax({
    	method: "GET",
    	url: url + "/forgot/"+$email

    }).then(function(result){
    	alert(result.feedback);
    },ERROR_LOG);
  });

  $('#ForgotSummitButton').click(function() {

    var $newpassword = $("#InputPassword").val();
    var $confirmPassword = $("#ConfirmPassword").val();

    if (
      $newpassword.length < 6 ||
      $newpassword != $confirmPassword
    ) {
      return;
    }

    $.ajax({
      method: "PUT",
      url: window.location.href,
      data: JSON.stringify({
        newpassword: $newpassword
      }),
      contentType: "application/json",
      datatype: "json"
    }).then(
      function(result) {
        alert(result.feedback);
        if (result.status == 200) {
          window.location.href = url + "/login.html";
        }
      },
      function(error) {
        alert(error);
      });

  });

  $("#logout").click(function() {
    logout();
  });

  $("#RegisterButton").click(function() {
    window.location.href =
      "https://nwen304onlineshoping.herokuapp.com/register.html";
  });
  $("#loginPageButton").click(function() {
    window.location.href = url + "/login.html";
  });

  $("#HomeButton").click(function() {
    window.location.href = url;
  });
});

var timeout = null;
$(document).on("mousemove keypress scroll", function() {
  var login_state = window.localStorage.getItem("login_state");
  if (login_state == "login") {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      alert("You are stop using the application, automaticly logout");
      logout();
    }, 300000);
  }
});

function logout() {
  window.localStorage.clear();
  window.location.href = "index.html";
}

function isEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function reload() {
  var login_state = window.localStorage.getItem("login_state");
  var username = window.localStorage.getItem("username");
  var HTML;

  if (login_state == "login") {
    HTML = '<ul class="navbar-nav ml-auto">';
    HTML +=
      '<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>';
    HTML +=
      '<li class="nav-item"><a class="nav-link" href="cart.html">Cart</a></li>';
    HTML +=
      '<li class="nav-item"><a class="nav-link" href="#">' +
      username +
      "</a></li>";
    HTML +=
      '<li class="nav-item"><a class="nav-link" href="reset_password.html">Reset Password</a></li>';
    HTML +=
      '<li class="nav-item" id = logout><a class="nav-link">logout</li></ul>';
  } else {
    HTML = '<ul class="navbar-nav ml-auto">';
    HTML +=
      '<li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>';
    HTML +=
      '<li class="nav-item"><a class="nav-link" href="cart.html">Cart</a></li>';
    HTML +=
      '<li class="nav-item"><a class="nav-link" href="login.html">Sign in</a></li>';
    HTML +=
      '<li class="nav-item"><a class="nav-link" href="register.html">Sign up</a></li></ul>';
  }

  $("#navbarResponsive").empty();
  $("#navbarResponsive").prepend(HTML);
}
