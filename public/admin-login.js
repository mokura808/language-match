
var loginButton = document.getElementById("log-in-button");
loginButton.addEventListener("click", function() {
	// Sends user to the control panel if their password matches what was set
	if(document.getElementById("admin_password").value == "password"){
		window.location.href = "/admin";
	}else{

		alert("Password incorrect, please try again");
	}

});