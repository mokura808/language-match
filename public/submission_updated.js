// JavaScript Document

var idSpokenLang = 1;
var idTargetLang = 1;
// dict of spoken languages, matched to [proficiency, maxmatches] (ids)
let spokenDict = {};
// dict of target languages, matched to proficiency (ids)
let targetDict = {};

var targetDropDown = document.getElementById("targetlanguage1");
getLanguages(targetDropDown);
var spokenDropDown = document.getElementById("spokenlanguage1");
getLanguages(spokenDropDown);

function getLanguages(dropdownElement) {
	$.get("/getLanguages", function(data, status) {
		if (status === "success") {
			data.forEach(function(element) {
				var addOption = document.createElement("option");
				addOption.value = element['language'].toLowerCase();
				//console.log("new option: " + element['language']);
				//console.log(addOption.value);
				addOption.innerHTML = element['language'];
				dropdownElement.appendChild(addOption);
			});
		}
	});
}


var loginButton = document.getElementById("log-in-button");
loginButton.addEventListener("click", function() {
	 window.location.href = "/home";
	}

);

var addSpokenButton = document.getElementById("add-spoken");
var addTargetButton = document.getElementById("add-target");

spokenDict["spokenlanguage1"] = ["spokenprof1", "maxmatches1"];
targetDict["targetlanguage1"] = "targetprof1";


addSpokenButton.addEventListener("click", function() {
	idSpokenLang = idSpokenLang + 1;
  var spokenContainer = document.getElementById("spoken-container");

	// create langdiv element
	var newLangDiv = document.createElement("li");
	newLangDiv.className += "langdiv";
	newLangDiv.style = "border-top: 1px solid #f68e56; padding-top: 25px; padding-bottom: 10px";
  newLangDiv.id = "spokenListItem" + idSpokenLang.toString();

	// create language input div
	var newFormInput = document.createElement("div");
	newFormInput.className += "form-inputs";

	// create language input field
	// var newTextBox = document.createElement("input");
	// newTextBox.type += "text";
	// newTextBox.name += "spokenlanguage" + idSpokenLang.toString();
  // newTextBox.id = "spokenlanguage" + idSpokenLang.toString();

	var newTextBox = document.createElement("select");
	newTextBox.className += "dropdown";
	newTextBox.name += "spokenlanguage" + idSpokenLang.toString();
  	newTextBox.id = "spokenlanguage" + idSpokenLang.toString();
	newTextBox.innerHTML = '<option value="default">Select one</option>' 
	/*'<option value="albanian">Albanian</option>' +
	'<option value="arabic">Arabic</option>' +
	'<option value="asl">ASL</option>' +
	'<option value="cantonese">Cantonese</option>' +
	'<option value="english">English</option>' +
	'<option value="french">French</option>' +
	'<option value="german">German</option>' +
	'<option value="hindi">Hindi</option>' +
	'<option value="japanese">Japanese</option>' +
	'<option value="korean">Korean</option>' +
	'<option value="malay">Malay</option>' +
	'<option value="mandarin">Mandarin</option>' +
	'<option value="portuguese">Portuguese</option>' +
	'<option value="russian">Russian</option>' +
	'<option value="spanish">Spanish</option>' +
	'<option value="tagalog">Tagalog</option>' +
	'<option value="vietnamese">Vietnamese</option>' +
	'<option value="urdu">Urdu</option>' */+
	'<option value="other">Other</option>';
	getLanguages(newTextBox);

	newFormInput.innerHTML = "Language:";
	newFormInput.appendChild(newTextBox);


	var newInLangDiv = document.createElement("div");

	newInLangDiv.className += "langdivinternal";

	var newProfDiv = document.createElement("div");
	newProfDiv.innerHTML = "Proficiency:";
	newProfDiv.style = "padding:10px";

	var newDropDown = document.createElement("select");
	newDropDown.className += "dropdown";
	newDropDown.name += "spokenprof" + idSpokenLang.toString();
  	newDropDown.id = "spokenprof" + idSpokenLang.toString();
	newDropDown.innerHTML = '<option value="default">Select one</option>' +
	'<option value="intermediate">Intermediate</option>' +
	'<option value="advanced">Advanced</option>' +
	'<option value="native">Native</option>';

	newProfDiv.appendChild(newDropDown);

	var newMatchesDiv = document.createElement("div");
	newMatchesDiv.style = "padding:10px";

	newMatchesDiv.innerHTML = "Max # of Matches:*";

	// var newMaxMatches = document.createElement("input");
	// newMaxMatches.type += "text";
	// newMaxMatches.name += "maxmatches" + idSpokenLang.toString();
  // newMaxMatches.id = "maxmatches" + idSpokenLang.toString();
	// newMaxMatches.style = "max-width:30px";

	var newMaxMatches = document.createElement("select");
	newMaxMatches.name += "maxmatches" + idSpokenLang.toString();
  newMaxMatches.id = "maxmatches" + idSpokenLang.toString();
	newMaxMatches.className += "dropdown";
	newMaxMatches.innerHTML = '<option value="default">Select one</option>' +
	'<option value="1">1</option>' +
	'<option value="2">2</option>' +
	'<option value="3">3</option>' +
	'<option value="4">4</option>' +
	'<option value="5">5</option>';

	newMatchesDiv.appendChild(newMaxMatches);
	newInLangDiv.appendChild(newProfDiv);
	newInLangDiv.appendChild(newMatchesDiv);

	// set up remove button
	var removeButton = document.createElement("button");
	removeButton.innerHTML = "Remove";
	removeButton.className += "remove-button";
	removeButton.id += "removeSpoken" + idSpokenLang.toString();
	removeButton.addEventListener("click", function(evento) {
		var parentContainer = document.getElementById("spoken-container");
		var children = parentContainer.getElementsByTagName("li");
		for (var i = 0; i < children.length; i++) {
			if (children[i].id == newLangDiv.id) {
				var idNum = children[i].id[children[i].id.length - 1];
				delete spokenDict["spokenlanguage" + idNum];
				//console.log("removed " + "spokenlanguage" + idNum + " from dict");
				parentContainer.removeChild(children[i]);
				//console.log("Language entry successfully removed:", newLangDiv.id);
				break;
			}
		}
	});

	newLangDiv.appendChild(newFormInput);
	newLangDiv.appendChild(newInLangDiv);
	newLangDiv.appendChild(removeButton);

	spokenContainer.appendChild(newLangDiv);

  // add relevant info to spoken dictionary
  spokenDict[newTextBox.id] = [newDropDown.id, newMaxMatches.id];
	//console.log("Language added to spoken languages");
});
/*
	if(document.getElementById('nospeak').checked){
 		document.getElementById("spoken-container").style.display = "none";
 		document.getElementById("add-spoken").style.display = "none";
 	}
*/
var speakCheck = document.getElementById("nospeak");
speakCheck.addEventListener( 'change', function() {
	// If checked, the interval will be overridden 
    if(this.checked) {
    	document.getElementById("spoken-container").style.display = "none";
 		document.getElementById("add-spoken").style.display = "none";
    } else {
       document.getElementById("spoken-container").style.display = "";
 		document.getElementById("add-spoken").style.display = "";
    }
});
var teachCheck = document.getElementById("noteach");
teachCheck.addEventListener( 'change', function() {
	// If checked, the interval will be overridden 
    if(this.checked) {
    	document.getElementById("target-container").style.display = "none";
 		document.getElementById("add-target").style.display = "none";
    } else {
    	document.getElementById("target-container").style.display = "";
 		document.getElementById("add-target").style.display = "";
    }
});


addTargetButton.addEventListener("click", function() {
  idTargetLang = idTargetLang + 1;
	var targetContainer = document.getElementById("target-container");

	// create langdiv element
	var newLangDiv = document.createElement("li");
	newLangDiv.className += "lang-div";
	newLangDiv.style = "border-top: 1px solid #f68e56; padding-top: 25px; padding-bottom: 10px";
  newLangDiv.id = "targetListItem" + idTargetLang.toString();

	// create language input div
	var newFormInput = document.createElement("div");
	newFormInput.className += "form-inputs";

	// create language input field
	var newTextBox = document.createElement("select");
	newTextBox.className += "dropdown";
	newTextBox.name += "targetlanguage" + idTargetLang.toString();
  newTextBox.id = "targetlanguage" + idTargetLang.toString();
	newTextBox.innerHTML = '<option value="default">Select one</option>' 
	/*'<option value="albanian">Albanian</option>' +
	'<option value="arabic">Arabic</option>' +
	'<option value="asl">ASL</option>' +
	'<option value="cantonese">Cantonese</option>' +
	'<option value="english">English</option>' +
	'<option value="french">French</option>' +
	'<option value="german">German</option>' +
	'<option value="hindi">Hindi</option>' +
	'<option value="japanese">Japanese</option>' +
	'<option value="korean">Korean</option>' +
	'<option value="malay">Malay</option>' +
	'<option value="mandarin">Mandarin</option>' +
	'<option value="portuguese">Portuguese</option>' +
	'<option value="russian">Russian</option>' +
	'<option value="spanish">Spanish</option>' +
	'<option value="tagalog">Tagalog</option>' +
	'<option value="vietnamese">Vietnamese</option>' +
	'<option value="urdu">Urdu</option>' */+
	'<option value="other">Other</option>';
	getLanguages(newTextBox);
	newFormInput.innerHTML = "Language:";

	newFormInput.appendChild(newTextBox);

	var newInLangDiv = document.createElement("div");
	newInLangDiv.className += "langdivinternal";

	var newProfDiv = document.createElement("div");
	newProfDiv.innerHTML = "Proficiency:";
	newProfDiv.style = "padding:10px";

	var newDropDown = document.createElement("select");
	newDropDown.className += "dropdown";
	newDropDown.name += "targetprof" + idTargetLang.toString();
  newDropDown.id = "targetprof" + idTargetLang.toString();
	newDropDown.innerHTML = '<option value="default">Select one</option>'+
	'<option value="basic">Novice</option><option value="intermediate">Intermediate</option>';

	newProfDiv.appendChild(newDropDown);

	newInLangDiv.appendChild(newProfDiv);

	// set up remove button
	var removeButton = document.createElement("button");
	removeButton.innerHTML = "Remove";
	removeButton.className += "remove-button";
	removeButton.id += "removeTarget" + idTargetLang.toString();
	removeButton.addEventListener("click", function(evento) {
		var parentContainer = document.getElementById("target-container");
		var children = parentContainer.getElementsByTagName("li");
		for (var i = 0; i < children.length; i++) {
			if (children[i].id == newLangDiv.id) {
				var idNum = children[i].id[children[i].id.length - 1];
				delete targetDict["targetlanguage" + idNum];
				//console.log("removed " + "targetlanguage" + idNum + " from dict");
				parentContainer.removeChild(children[i]);
				//console.log("Language entry successfully removed:", newLangDiv.id);
				break;
			}
		}
	});

	newLangDiv.appendChild(newFormInput);
	newLangDiv.appendChild(newInLangDiv);
	newLangDiv.appendChild(removeButton);

	targetContainer.appendChild(newLangDiv);

  // add relevant info to target dictionary
  targetDict[newTextBox.id] = newDropDown.id;

	//console.log("Language added to target languages");
});

 function showPass() {
	var x = document.getElementById("password");
	var y = document.getElementById("password-confirm");
 	if (x.type === "password") {
    	x.type = "text";
    	y.type = "text";
  	} else {
    	x.type = "password";
    	y.type = "password";
  	}
}
function checkDuplicates(array) {

	let length = array.length;

	if (length > 1) {
		for (let i = 0; i < length; i++) {
			let arraySlice = array.slice(i + 1, length);
			if (memberOf(array[i], arraySlice)) {
				return true;
			}
		}
	}
	
	return false;

}

function memberOf(item, array) {
	let length = array.length;
	for (let i = 0; i < length; i++) {
		if (item == array[i]) {
			return true;
		}
	}
	return false;
}

function checkDupsTwoArrs(array1, array2) {

	let length = array1.length;
	for (let i = 0; i < length; i++) {
		if (memberOf(array1[i], array2)) {
			return true;
		}
	}
	return false;
}

let numberList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
function isBadPassword(password) {

	let containsNum = false;
	let goodLength = (password.length >= 8);
	let containsLower = (password.toUpperCase() != password);
	let containsUpper = (password.toLowerCase() != password);

	numberList.forEach(function(num) {
		if(memberOf(num, password)) {
			containsNum = true;
		}
	});

	let returnString = "";

	if (!goodLength) {
		returnString += "Password must be at least 8 characters long\n";
	}
	if (!containsNum) {
		returnString += "Password must contain at least 1 number\n";
	}
	if (!containsLower) {
		returnString += "Password must contain at least 1 lower-case character\n";
	}
	if (!containsUpper) {
		returnString += "Password must contain at least 1 upper-case character";
	}

	if (returnString != "") {
		// bad password
		return [true, returnString];
	} else {
		// good password
		return [false, returnString];
	}

}
// for form submission
document.getElementById("submit-button").addEventListener("click", function(evento) {
  evento.preventDefault();
  const firstname = document.getElementById("firstname").value.trim();
  const lastname = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.toLowerCase().trim();
  const password = document.getElementById("password").value;
  const classyear = document.getElementById("classyear").value;
  const passwordConfirm = document.getElementById("password-confirm").value;
  let spokenLangs = [];

   // for spoken languages, store language, proficiency, max Matches
  let spokenDictValues = [];

  // If any values are null, spoken Counter will prevent the submit 
  var spokenCounter = 0; 
  var x= "default"
  for (var key in spokenDict) {
  	spokenCounter = 0;
    var language = document.getElementById(key).value;
    var proficiency = document.getElementById(spokenDict[key][0]).value;
    var maxmatches = document.getElementById(spokenDict[key][1]).value;
    // might change this to a dictionary? whatever is easiest to send to server
    spokenDictValues.push([language, proficiency, maxmatches]);
    spokenLangs.push(language);
    if(language == x || proficiency == x || maxmatches == x){

    	spokenCounter = 1; 
    }
  };
  var targetCounter = 0; 
  // for target languages, store language, proficiency

let targetLangs = [];
  let targetDictValues = [];
  for (var key in targetDict) {
    var language = document.getElementById(key).value;
    var proficiency = document.getElementById(targetDict[key]).value;
    // might change this to a dictionary? whatever is easiest to send to server
    targetDictValues.push([language, proficiency]);
    targetLangs.push(language);
    if(language == x || proficiency == x){
    	targetCounter = 1; 
    }
  };
// check how good password is
  let isBadPass = isBadPassword(password);
  const bio = document.getElementById("bio").value;
  const availability = document.getElementById("availability").value;
  if(firstname == '' || lastname == '' || email == '' || password == '' || passwordConfirm == '' || bio == '' || availability == '' ||classyear == x ||(spokenCounter == 1 && targetCounter == 1)) {
	alert("Please fill out all input fields. You must either teach or learn");
  	evento.preventDefault();
  } else if (isBadPass[0]) {

  	alert(isBadPass[1]);
  	evento.preventDefault();

  } else if (password != passwordConfirm) {
  	alert("Passwords do not match");
  	evento.preventDefault();

  } else if (email.length < 11) {
  		alert("Must use a valid Brown email");
  		evento.preventDefault();

  // check if there are double languages
  } else if (!(document.getElementById('nospeak').checked) && checkDuplicates(spokenLangs)) {
  	alert("Uh oh! You've listed the same language twice in \"Spoken Language(s)\". Please remove one");
  	evento.preventDefault();

  } else if (!(document.getElementById('noteach').checked) && checkDuplicates(targetLangs)) {
  	alert("Uh oh! You've listed the same language twice in \"Target Language(s)\". Please remove one");
  	evento.preventDefault();

  // check if teaching and learning the same language
  } else if (checkDupsTwoArrs(spokenLangs, targetLangs)) {
  	alert("You can't learn and teach the same language");
  	evento.preventDefault();
  }else if(!document.getElementById('termscheck').checked){
		alert("Please agree to the terms of agreement before signing up");	
		evento.preventDefault();
  	
  } else  {

	  	if(document.getElementById('nospeak').checked){
	 		//Only want to learn
	 		//console.log("no speak")
	 		spokenDictValues = [];

	 	} 
	 	if(document.getElementById('noteach').checked){
	 		//console.log("no teach")
	 		// Only want to teach 
	 		targetDictValues = [];

	 	}
		// $.post('/submission_pressed', {firstname: firstname, lastname: lastname, email: email,
		// 		password: password, spokenlist: spokenDictValues, targetlist: targetDictValues,
		// 		bio: bio, availability: availability});

		/********** NEW *************/
		let emailEnd = email.slice(-10);
		//console.log("email end: " + emailEnd);

	  	if (emailEnd != "@brown.edu") {
	  		alert("Must use a valid Brown email");
	  		evento.preventDefault();
	  	} else {
	  		$.post('/submission_pressed', {firstname: firstname, lastname: lastname, email: email,
			password: password, spokenlist: spokenDictValues, targetlist: targetDictValues,
			bio: bio, availability: availability, classyear:classyear}, function(emailInDatabase) {

				// callback
				if (emailInDatabase) {
					alert("The email " + email + " is already in use. Please use a different email");
				} else {
					// nothing
					window.location.href = "/sign-up-thanks";
				}
			});

	  	}
	}
});



