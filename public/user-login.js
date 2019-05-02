
/*var loginButton = document.getElementById("log-in-button");
loginButton.addEventListener("click", function() {
	if(document.getElementById("password").value == "password"){
	 	window.location.href = "/home";
	}else{
		alert("Email password combination incorrect, please try again");
	}
});*/

var homeButton = document.getElementById("home-button");
homeButton.addEventListener("click", function() {
    window.location.href = "/home";
	}
);



var loginButton = document.getElementById("log-in-button");
loginButton.addEventListener("click", function() {
	const email = document.getElementById("email").value;
	const password = document.getElementById("password").value;

	// add ajax/jquery script to html
	// use callback to display any issues with login


	

	$.post('/checklogin', {email: email, password: password}, function(userExists) {
		// callback

		//console.log(userExists);

		// CASE 1: User is not found in database; either email/password combo is incorrect,
		// 	or they do not exist in the database (they have not signed up)
		//	- display alert that this is the case
		if (!userExists[0]) {
			alert("Email/password combination incorrect, or you have not yet signed up. Please try again");
		} else {
			if(userExists[0] == false && userExists[1] == false){
			 	window.location.href = "/match-not-ready";

			}else{
				var user_id = userExists[2];
				//console.log("fitst cooke")				
			//	document.cookie = "userid=${user_id}";
				//console.log(document.cookie);

				window.location.href = "/partner-display/" + user_id;
				//$.get('/partner-display/' + user_id);
				//$.post('/partner-display2/', {user_id:user_id});
			}
			// do nothing (shouldn't get here); new page should get rendered
			// OR set window.location to be partner-display.html, with the packed data entailing user id
			
		}

		// CASE 2: User is found, and matches have not been made yet
		//	- display message that they should check back/keep an eye out for an email
		//		when their language partner has been selected

		// CASE 3: User is found, and matches have been made, but they have no matches
		//	- display "teaching" and "learning" lists, but I guess check if the callback
		//		data is empty (no matches)
		//	- display message that they have no matches (maybe provide contact for Jane or something)

		// CASE 4: User is found, and matches have been made, and they have 1+ matches!
		//	- display "teaching" and "learning" lists, where each list is populated with
		//		their language partner(s) for a given language, and the partner's information
	});

});