

var deadline;
var d = new Date(); 
var currDate = d.getTime();
var open = 1; 



// Sets deadline equal to the closing time entered by the admin
// open = 0 means open, open = 1 means closed 
var username = prompt("Enter the admin username");
var password = prompt("Enter the admin password");
document.getElementById("banner").style.display = "";


$.post('/getDeadline',function(data){
    if (!data[0]) {

    }else{
        console.log("setting admin deadline to:")
        deadline = data[0];

        var dateControl = document.querySelector('input[type="date"]');
        dateControl.value = deadline['date'];

        if( (new Date(currDate) < new Date(deadline['date']))){
            open = 0; 
            console.log("open")
            // Current Date is before the deadline - keep form open 
        }else{
            open = 1; 
            console.log("closed")
            // Current Date is after the deadline - close form 
        }
    }

});




if(username == 'admin' && password =='matchme'){
    document.getElementById("hider").style.display = "none";

    var logoutButton = document.getElementById("log-out-button");
    logoutButton.addEventListener("click", function() {
       window.location.href = "/home";
      }
    );
function setDate(x) {
    deadline = x;
    // default to closed 
    alert("Deadline has been set");
    if( (new Date(currDate).getTime() < new Date(deadline).getTime()))
    {
        open = 0; 
        // Current Date is before the deadline - keep form open 
    }else{
        open = 1; 
        // Current Date is after the deadline - close form 
    }
    // Sends a post request to server every time the date is changed
    $.post('/dateSumbitted',{open:open, deadline:deadline});
}

var runButton = document.getElementById("run");
runButton.addEventListener("click", function() {
   //send out email
    if(open == 0){
        // Current Date is before the deadline - keep form open 
        alert("Deadline has not passed yet, please wait to email or change the deadline");

    }else{
   
        if (confirm("Are you sure you want to email all users?")) {

        // Current Date is after the deadline - close form 
            alert("Users have been emailed");
            $.post('/sendEmail');
        }

    }
});

var viewButton = document.getElementById("view-data");
viewButton.addEventListener("click", function(evento) {

    evento.preventDefault();

    $.post('/viewData', function(data, status) {
        if (status == "success") {
            console.log("Post data received in browser");
            var csv = '';
            // add column titles at top of file
            csv += ',Matched Language,Teacher,Teacher Email,Learner Class,Teacher Fluency,Learner,Learner Email,Learner Class,Learner Fluency\n';
            //csv += ',Key,Room Name\n';
            var counter = 1;
            data.forEach(function(element) {
              // for each entry, write it to a line of the csv file
              var parsedData = counter.toString() + ',' + convertToCSVRow(element);
              csv += parsedData;
              counter = counter + 1;
            });
            console.log(csv);

            // start of download csv portion; maybe put all of this in the js and just send over the relevant data
            let today = new Date();
            let date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
            let time = today.getHours() + "-" + today.getMinutes();
            let fullDate = date + '_' + time;
            let filename = 'matches_' + fullDate + '.csv';
            console.log("New file name: " + filename);

            //var data, filename, link;
            //if (csv == null) return;
            //filename = filename || 'export.csv';

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            console.log("Updated csv content: " + csv);

            updatedData = encodeURI(csv);

            link = document.createElement('a');
            link.setAttribute('href', updatedData);
            link.setAttribute('download', filename);
            link.click();

        } else {
            console.log("Error retrieving data from server");
        }
    });
});

var viewAllUsersButton = document.getElementById("view-all");
viewAllUsersButton.addEventListener("click", function(evento) {
    evento.preventDefault();

    $.post('/viewAllUsers', function(data, status) {

        if (status == "success") {
            console.log("Post data received in browser");
            var csv = '';
            // add column titles at top of file
            csv += ',Name,Email,Bio,Availability,Class Year\n';
            //csv += ',Key,Room Name\n';
            var counter = 1;
            data.forEach(function(element) {
              // for each entry, write it to a line of the csv file
              var parsedData = counter.toString() + ',' + convertToCSVRow(element);
              csv += parsedData;
              counter = counter + 1;
            });

            // start of download csv portion; maybe put all of this in the js and just send over the relevant data
            let today = new Date();
            let date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
            let time = today.getHours() + "-" + today.getMinutes();
            let fullDate = date + '_' + time;
            let filename = 'allusers_' + fullDate + '.csv';
            console.log("New file name: " + filename);

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }

            let updatedData = encodeURI(csv);

            link = document.createElement('a');
            link.setAttribute('href', updatedData);
            link.setAttribute('download', filename);
            link.click();

        } else {
            console.log("Error retrieving data from server");
        }
    });
});

// view unmatched learners
var viewUnmatchedLearnersButton = document.getElementById("view-learners");
viewUnmatchedLearnersButton.addEventListener("click", function(evento) {
    evento.preventDefault();
    $.post('/viewUnmatchedLearners', function(data, status) {
        if (status == "success") {
            console.log("Post data received in browser");
            var csv = '';
            // add column titles at top of file
            csv += ',Name,Email,Language,Fluency,Class Year\n';
            var counter = 1;
            data.forEach(function(element) {
              // for each entry, write it to a line of the csv file
              var parsedData = counter.toString() + ',' + convertToCSVRow(element);
              csv += parsedData;
              counter = counter + 1;
            });

            // start of download csv portion; maybe put all of this in the js and just send over the relevant data
            let today = new Date();
            let date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
            let time = today.getHours() + "-" + today.getMinutes();
            let fullDate = date + '_' + time;
            let filename = 'unmatchedlearners_' + fullDate + '.csv';
            console.log("New file name: " + filename);

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }

            let updatedData = encodeURI(csv);

            link = document.createElement('a');
            link.setAttribute('href', updatedData);
            link.setAttribute('download', filename);
            link.click();

        } else {
            console.log("Error retrieving data from server");
        }
    });
});

// view unmatched teachers
var viewUnmatchedTeachersButton = document.getElementById("view-teachers");
viewUnmatchedTeachersButton.addEventListener("click", function(evento) {
    evento.preventDefault();
    $.post('/viewUnmatchedTeachers', function(data, status) {
        if (status == "success") {
            console.log("Post data received in browser");
            var csv = '';
            // add column titles at top of file
            csv += ',Name,Email,Language,Fluency,Class Year\n';
            var counter = 1;
            data.forEach(function(element) {
              // for each entry, write it to a line of the csv file
              var parsedData = counter.toString() + ',' + convertToCSVRow(element);
              csv += parsedData;
              counter = counter + 1;
            });

            // start of download csv portion; maybe put all of this in the js and just send over the relevant data
            let today = new Date();
            let date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear();
            let time = today.getHours() + "-" + today.getMinutes();
            let fullDate = date + '_' + time;
            let filename = 'unmatchedteachers_' + fullDate + '.csv';
            console.log("New file name: " + filename);

            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }

            let updatedData = encodeURI(csv);

            link = document.createElement('a');
            link.setAttribute('href', updatedData);
            link.setAttribute('download', filename);
            link.click();

        } else {
            console.log("Error retrieving data from server");
        }
    });
});


var languagesBox = document.getElementById("update-lang-text");
$.get('/getLanguages', function(data, status) {

    if (status === 'success') {
        let languageStr = "";
        data.forEach(function(element) {
            languageStr += element['language'] + ',';
        });
        languagesBox.value = languageStr;
    }

});

var updateLangButton = document.getElementById("update-lang-button");
updateLangButton.addEventListener("click", function(evento) {

    if (confirm("Are you sure you want to update the languages offered?")) {
        let intermediateLanguages = languagesBox.value.split(",");
        intermediateLanguages.sort();
        let newLanguages = [];
        intermediateLanguages.forEach(function(element) {
            newLanguages.push([element]);
        });

        $.post('/updateLanguages', {languages: newLanguages}, function() {
            // callback
        });
    }

});


function convertToCSVRow(dataEntry) {
    // dataEntry is a row of the table entailing all match data
    var columnDelim = ',';
    var lineDelim = '\n';

    // make an array out of the data
    var result = '';
    for (var key in dataEntry) {
    if (key == "tfirst" || key== "lfirst") {
        // don't add columnDelim
        result += dataEntry[key] + " ";
    } else {
        result += dataEntry[key] + columnDelim;
    }
    }
    result += lineDelim;
    return result;
}

var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", function() {
    let c = confirm("Are you sure you want to reset all data?");
        if (c == true) {
         $.post('/reset');
        alert("All data has been reset");        
        } else {
        }
});

}else{
    document.getElementById("hider").style.display = "";
    document.getElementById("banner").style.display = "none";

    alert("Username/password combination incorrect. Please try again");
    window.location.href = "/home";
}

