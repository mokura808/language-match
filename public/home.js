var loginButton = document.getElementById("log-in-button");
loginButton.addEventListener("click", function() {
   // window.location.href = "user-login.html";
   console.log("login sent");
   // $.get('/loginuser',function(request, response){
    //});	
    window.location.href = "/user-login";
	}
);

var SignUpButton = document.getElementById("submit-button");
SignUpButton.addEventListener("click", function() {
    window.location.href = "/submission_updated";
	}
);