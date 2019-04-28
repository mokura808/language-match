

var deadline;
var d = new Date(); 
var currDate = d.getTime();
var open = 1; 

// Sets deadline equal to the closing time entered by the admin
// open = 0 means open, open = 1 means closed 

function setDate(x) {
    deadline = x;
    // default to closed 

    if( (new Date(currDate).getTime() < new Date(deadline).getTime()))
    {
    	open = 0; 
    	// Current Date is before the deadline - keep form open 
    }else{
    	open = 1; 
    	// Current Date is after the deadline - close form 
    }
    // Sends a post request to server every time the date is changed
    $.post('/dateSumbitted',{open: open});
}

var runButton = document.getElementById("run");
runButton.addEventListener("click", function() {
   //send out email

    $.post('/sendEmail');


});

var viewButton = document.getElementById("view-data");
viewButton.addEventListener("click", function(evento) {

    evento.preventDefault();

    $.post('/viewData', function(data, status) {
        if (status == "success") {
            console.log("Post data received in browser");
            var csv = '';
            // add column titles at top of file
            csv += ',Matched Language,Teacher,Teacher Email,Teacher Fluency,Learner,Learner Email,Learner Fluency\n';
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
            let time = today.getHours() + ":" + today.getMinutes();
            let fullDate = date + '-' + time;
            let filename = 'matches-' + fullDate + '.csv';
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
        console.log("gets here");
        if (status == "success") {
            console.log("Post data received in browser");
            var csv = '';
            // add column titles at top of file
            csv += ',Name,Email,Bio,Availability\n';
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
            let time = today.getHours() + ":" + today.getMinutes();
            let fullDate = date + '-' + time;
            let filename = 'allusers-' + fullDate + '.csv';
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
	$.post('/reset');

});