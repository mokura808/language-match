//requires express and creates an app

const express = require('express');
const app = express();

// Parses request to find roomName, nickname, and message
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const path = require('path');
let nodemailer= require('nodemailer');


//app.use(express.static(__dirname + '../public'));

//app.use(express.static(__dirname + '/public'));

//Template code for mustache
const engines = require('consolidate');
app.engine('html', engines.hogan); // tell Express to run .html files through Hogan
app.set('views', __dirname + '/templates');
app.set('view engine', 'html'); // register .html extension as template engine so we can render .html pages
//app.use(express.static(__dirname+'/public'));
app.use(express.static('public'));

// Connection to SQL ***this needs to be updated to AWS database***
const db = require('mysql');
//const url = 'mysql://mokura:cs132@bdognom.cs.brown.edu/mokura_db';
//const conn = db.createConnection(url);
const connection = db.createConnection({
  host     : 'languagematchdb.cty6zyohkstq.us-east-2.rds.amazonaws.com',
 port      :  8081,
  user     : 'languagematchuser',
  password : 'languagematchpass',
  database : 'languagematchdb'

});
conn.connect();

/*

conn.query('DROP TABLE users',function(error, data) {
     if(error){
        console.log(error)
      }else{
        console.log("user deleted");
      }
});
conn.query('DROP TABLE learner',function(error, data) {
     if(error){
        console.log(error);
      }else{
        console.log("learner deleted");
      }
});
conn.query('DROP TABLE teacher',function(error, data) {
     if(error){
        console.log(error)
      }else{
        console.log("teacher deleted");
      }
});
conn.query('DROP TABLE matched_users',function(error, data) {
     if(error){
        console.log(error)
      }else{
        console.log("matched users deleted");
      }
}); */

conn.query('CREATE TABLE if not exists users(firstname TEXT, lastname TEXT, email TEXT, password TEXT, id INTEGER PRIMARY KEY AUTO_INCREMENT, bio TEXT, availability TEXT, matched INTEGER)', function(error, data) {
    if (error) {
        console.log(error)
    } else {}
});

conn.query('CREATE TABLE if not exists learner(learner_id INTEGER, language TEXT ,learner_fluency TEXT)', function(error, data) {
    if (error) {
        console.log(error)
    } else {}
});

conn.query('CREATE TABLE if not exists teacher(teacher_id INTEGER, language TEXT ,teacher_fluency TEXT)', function(error, data) {
    if (error) {
        console.log(error)
    } else {}
});

conn.query('CREATE TABLE if not exists matched_users(learner_id INTEGER, teacher_id INTEGER, language TEXT, learner_fluency TEXT, teacher_fluency TEXT)', function(error, data) {
    if (error) {
        console.log(error)
    } else {}
});
// Variable to determine whether or not the form should be open, value 0 = open, 1 = closed
var open = 0;
app.post('/dateSumbitted', handledate);

function handledate(request, response) {
    open = request.body.open;
    console.log(open);
};

app.get('/admin', function(request, response) {
    response.sendFile(__dirname + "/public/admin.html");
});
app.get('/admin-login', function(request, response) {
    response.sendFile(__dirname + "/public/admin-login.html");
});
app.get('/closed-submissions', function(request, response) {
    if (open == 0) {
        response.sendFile(__dirname + "/public/home.html");
    } else {
        response.sendFile(__dirname + "/public/closed-submissions.html");
    }
});
app.get('/home', function(request, response) {
    response.sendFile(__dirname + "/public/home.html");
});

app.get('/user-login', function(request, response) {
    console.log(open);
    if (open == 0) {
        response.sendFile(__dirname + "/public/user-login.html");
    } else {
        response.sendFile(__dirname + "/public/closed-submissions.html");
    }
});
app.get('/match-not-ready', function(request, response) {
    response.sendFile(__dirname + "/public/match-not-ready.html");
});
app.get('/sign-up-thanks', function(request, response) {
    response.sendFile(__dirname + "/public/sign-up-thanks.html");
});
app.get('/submission_updated', function(request, response) {
    if (open == 0) {
        response.sendFile(__dirname + "/public/submission_updated.html");
    } else {
        response.sendFile(__dirname + "/public/closed-submissions.html");
    }
});

app.post('/viewData', function(request, response) {
    conn.query('SELECT c.language, c.firstname AS tfirst, c.lastname AS tlast, c.email AS temail, c.teacher_fluency, b.firstname AS lfirst, b.lastname AS llast, b.email AS lemail, c.learner_fluency FROM users AS b JOIN (SELECT a.firstname, a.lastname, a.email, matched_users.learner_id, matched_users.language, matched_users.teacher_fluency, matched_users.learner_fluency FROM \
        users AS a JOIN matched_users WHERE a.id=matched_users.teacher_id) AS c WHERE b.id=c.learner_id', function(error, data) {
        console.log(data);
        response.json(data);
    });
});
// to view all users who are signed up
app.post('/viewAllUsers', function(request, response) {
    console.log("Post request for all users received");
    conn.query('SELECT firstname AS tfirst, lastname, email, bio, availability FROM users', function(error, data) {
        console.log(data)
        response.json(data);
        console.log("Sent all users data to browser");
    });
});


app.get('/partner-display/:userId', function(request, response) {
    console.log("hello");
    console.log(request.params.userId);
    console.log("sandwith")
    //response.send("404");
    //console.log("get request")
    //console.log(request.body.firstname);


    conn.query('SELECT firstname, lastname, email FROM users WHERE id=?', [request.params.userId], function(error, data) {

        data.forEach(function(element) {
            response.render('partner-display.html', {
                firstname: element['firstname'],
                lastname: element['lastname'],
                email: element['email'],
                user_id: request.params.userId
            });
        });
    });
});
app.post('/displayPartners', displayPartners);

function displayPartners(request, response) {
    let ready1 = 0;
    let whoYouTeach_list = [];
    let whoYouTeach_final = [];
    //finds matches where user is learner
    let yourTeachers_list = [];
    let yourTeachers_final = [];
    console.log("testing id");
    console.log(request.body.user_id);


    conn.query('SELECT learner_id, language, learner_fluency FROM matched_users WHERE teacher_id = ?', [request.body.user_id], function(err, teach, fields) {
        for (let k in teach) {
            let tempList = [];
            tempList.push(teach[k].learner_id);
            tempList.push(teach[k].language);
            tempList.push(teach[k].learner_fluency);
            whoYouTeach_list.push(tempList);
        }
        conn.query('SELECT teacher_id, language , teacher_fluency FROM matched_users WHERE learner_id = ?', [request.body.user_id], function(err, learn) {
            for (let p in learn) {
                let tempList = [];
                tempList.push(learn[p].teacher_id);
                tempList.push(learn[p].language);
                //this needs to be added to added to matched table
                tempList.push(learn[p].teacher_fluency);
                yourTeachers_list.push(tempList);
            }
            //there might need to be some sort of callback function here
            //finds the info for those matches
            //at this point the ids, langugage and fluency of those you will teach are in whoYouTeach

            //CASE1: Both are not empty, run both
            let c1 = 0;
            let c2 = 0;
            let check_if_first_loop_done = 0;
            if (whoYouTeach_list.length > 0 && yourTeachers_list.length > 0) {
                console.log("case1")
                for (let j in whoYouTeach_list) {
                    let k = whoYouTeach_list[j][0];
                    conn.query('SELECT * from users WHERE id = ?', [k], function(error, data) {
                        if (error) {
                            console.log(error)
                        } else {
                            info = {};
                            data.forEach(function(element) {
                                info.firstname = element['firstname'];
                                info.lastname = element['lastname'];
                                info.email = element['email'];
                                info.bio = element['bio'];
                                info.matched = element['matched'];
                                info.availability = element['availability'];
                                info.language = whoYouTeach_list[j][1];
                                info.Fluency = whoYouTeach_list[j][2];
                                whoYouTeach_final.push(info);
                            });

                            check_if_first_loop_done = check_if_first_loop_done + 1;

                        }

                     //   console.log("before loop")
                       // console.log(yourTeachers_list)

                        if(check_if_first_loop_done == whoYouTeach_list.length){
                            for (let z in yourTeachers_list) {
                                let l = yourTeachers_list[z][0];
                                conn.query('SELECT * from users WHERE id = ?', [l], function(error, data) {
                                    if (error) {
                                        console.log(error)
                                    } else {
                                        info = {};
                                        data.forEach(function(element) {
                                            info.firstname = element['firstname'];
                                            info.lastname = element['lastname'];
                                            info.email = element['email'];
                                            info.bio = element['bio'];
                                            info.matched = element['matched'];
                                            info.availability = element['availability'];
                                            info.language = yourTeachers_list[z][1];
                                            info.Fluency = yourTeachers_list[z][2];
                                            yourTeachers_final.push(info);
                                        });
                                    }
                                      c1 = c1 + 1;
                                      if(c1 == yourTeachers_list.length){
                                        response.send([whoYouTeach_final,yourTeachers_final]);
                                     }
                                });
                            }
                    }
                    });
                }
            }
            //CASE 2: Only teaching
            let teacherlistlength = 0;
            if (whoYouTeach_list.length > 0 && yourTeachers_list.length == 0) {
                                console.log("case2")

                for (let j in whoYouTeach_list) {
                    let k = whoYouTeach_list[j][0];
                    conn.query('SELECT * from users WHERE id = ?', [k], function(error, data) {
                        if (error) {
                            console.log(error)
                        } else {
                            info = {};
                            data.forEach(function(element) {
                                info.firstname = element['firstname'];
                                info.lastname = element['lastname'];
                                info.email = element['email'];
                                info.bio = element['bio'];
                                info.matched = element['matched'];
                                info.availability = element['availability'];
                                info.language = whoYouTeach_list[j][1];
                                info.Fluency = whoYouTeach_list[j][2];
                                whoYouTeach_final.push(info);
                            });
                        }
                        teacherlistlength = teacherlistlength + 1;
                         if(teacherlistlength == whoYouTeach_list.length){
                            response.send([whoYouTeach_final,yourTeachers_final]);
                        }
                    });
                }

            }
            let counter = 0;
            //CASE 3: Only learning
            if (whoYouTeach_list.length == 0 && yourTeachers_list.length > 0) {
                                console.log("case3")

                for (let j in yourTeachers_list) {
                    let k = yourTeachers_list[j][0];
                    conn.query('SELECT * from users WHERE id = ?', [k], function(error, data) {
                        if (error) {
                            console.log(error)
                        } else {
                            info = {};
                            data.forEach(function(element) {
                                info.firstname = element['firstname'];
                                info.lastname = element['lastname'];
                                info.email = element['email'];
                                info.bio = element['bio'];
                                info.matched = element['matched'];
                                info.availability = element['availability'];
                                info.language = yourTeachers_list[j][1];
                                info.Fluency = yourTeachers_list[j][2];
                                yourTeachers_final.push(info);

                            });
                        }
                        counter = counter + 1;
                        if( counter == yourTeachers_list.length){
                            response.send([whoYouTeach_final,yourTeachers_final]);
                        }
                    });
                }
            }

        });
    });
}

// response.render('partner-display.html', {firstname:"Jamie", lastname: "A", email: "email", user_id: "id",password:"pass"});
//response.sendFile(__dirname + "/templates/partner-display.html");


app.get('/*', function(request, response) {
    response.sendFile(__dirname + "/public/404.html");
});

// log into user account
app.post('/checklogin', checklogin);

function checklogin(request, response) {
    // check database for username and password
    const email = request.body.email;
    const password = request.body.password;

    // perform some check against user input here!!! Before performing query

    conn.query('SELECT id, firstname, lastname FROM users WHERE email=? AND password=?', [email, password], function(error, data) {
        let numUsers = 0;
        let user_id;
        let firstname;
        let lastname;
        data.forEach(function(element) {
            numUsers = numUsers + 1;
            user_id = element['id'];
            firstname = element['firstname'];
            lastname = element['lastname'];
        });
        if (numUsers > 1) { // this should never happen
            console.log("There are multiple users with the same email and password! :(");
        } else if (numUsers > 0) { // this means a user was found with the matching credentials

            // get the user's information and display it in the rendered page
            // query for all of the user's matches
            if (open == 0) { // matching algorithm hasn't taken place yet
                // render results page displaying message that they should check back/keep
                // an eye out for an email for when their language partner has been selected
                //response.sendFile(__dirname + "/public/match-not-ready.html");
                //response.render('partner-display.html', {firstname: firstname, lastname: lastname, email: email, user_id: user_id});
                //response.locals = firstname: firstname;
                // response.send("hi");
                response.send([true, false, user_id]);
                // response.redirect(301, `/partner-display?user_id${user_id}`);
                // response.set('Content-Type', 'text/html');
                // response.render('partner-display.html', {firstname:firstname, lastname: lastname, email: email, user_id: user_id});
                //response.end();
                //response.send([true,false, user_id, firstname, lastname]);

                //  response.sendFile('/public/match-not-ready.html',{root: __dirname});


            } else { // matching has taken place; find matches in matched_users database

                // IDEA: render partner-display.html, and in the partner-display js, make post request
                // to retrieve the partner data
                response.send([true, true, user_id]);

                //response.send([true,true,user_id, firstname, lastname]);
                //response.render('partner-display.html', {})

            }

        } else { // no user was found! send info in callback
            // either incorrect email/password or doesn't exist in database
            // send "userExists" as parameter
            response.send([false, false, user_id, firstname, lastname]);
        }
    });
}


// Post for Users Info
app.post('/submission_pressed', saveUser);

function saveUser(request, response) {
    const firstname = request.body.firstname;
    //console.log(firstname);
    const lastname = request.body.lastname;
    //console.log(lastname);
    const email = request.body.email;
    //console.log(email);
    const password = request.body.password;
    //console.log(password);
    const bio = request.body.bio;
    // 0 = non matched 1 = matched 
    const matched = 0;
    //console.log(bio);
    const availability = request.body.availability;
    //console.log(availability);

    //target list stores target langugages users want
    const targetlist = request.body.targetlist;

    // spoken list stores languages the users speak and the number of partners the user wants
    //const spokenlist = [];
    const spokenlist = request.body.spokenlist;

    let id_number;


    conn.query('INSERT INTO users (firstname, lastname, email, password, bio, availability, matched) VALUES(?,?,?,?,?,?,?)', [firstname, lastname, email, password, bio, availability,matched], function(error, data) {
        if (error) {
            console.log(error);
        }
        conn.query('SELECT * FROM users', function(error, data4) {
            if (error) {
                console.log(error)
            } else {
                console.log(data4);
            }
        });
        conn.query('SELECT LAST_INSERT_ID();', function(error, data2) {
            id_number = data2[0]['LAST_INSERT_ID()'];
            console.log(id_number);
             console.log("targetlist learner")
             console.log(targetlist);
             if(targetlist != undefined){
            for (let i = 0; i < targetlist.length; i++) {
                // each entry is a language and proficiency

                let language = targetlist[i][0];
                let learner_fluency = targetlist[i][1];

                /* NEW check if there is a matching teacher */
                conn.query('SELECT teacher_id, language, teacher_fluency FROM teacher WHERE language=? LIMIT 1', [language], function(error, data) {
                  // if a match has been made:
                  // - add new match to matched_users
                  // - remove teacher from teacher table
                  let counter = 0;
                  let teacher_id;
                  let teacher_fluency;

                  data.forEach(function(element) {
                    teacher_id = element['teacher_id'];
                    teacher_fluency = element['teacher_fluency'];
                    counter = counter + 1;
                  });

                  // match has been found; add match to matched_users
                  if (counter > 0) {

                    conn.query('INSERT INTO matched_users VALUES(?,?,?,?,?)', [id_number, teacher_id, language, learner_fluency, teacher_fluency], function(error, data) {
                      if (error) {
                        console.log("Error inserting a new match into database");
                        console.log(error);
                      } else {
                        console.log("updating matched number")
                        conn.query('UPDATE users SET matched = ? WHERE id =?', [1,id_number], function(error, data) {
                              if (error) {
                                console.log("Error updating matched number");
                                console.log(error);
                                } else {
                                console.log("updating succces")
                            }
                        });
                        conn.query('UPDATE users SET matched = ? WHERE id =?', [1,teacher_id], function(error, data) {
                              if (error) {
                                console.log("Error updating matched number");
                                console.log(error);
                                } else {
                                console.log("updating succces")
                            }
                        });
                        console.log("New matched pair created: " + teacher_id.toString() + ", " + id_number.toString());
                      }
                    });
                    // remove teacher from teacher table
                    conn.query('DELETE FROM teacher WHERE teacher_id=? AND language=? LIMIT 1', [teacher_id, language], function(error, data) {
                      if (error) {
                        console.log("Error removing teacher from teacher database");
                        console.log(error);
                      } else {
                        console.log("Teacher removed from database: " + teacher_id.toString());
                      }
                    });
                  // if no match, add new user to learners table
                  } else {
                    conn.query('INSERT INTO learner VALUES(?,?,?)', [id_number, language, learner_fluency], function(error, data) {
                      if (error) {
                        console.log("Error adding learner to learner database");
                      } else {
                        console.log("No teacher found; new learner added to database: " + id_number.toString());
                      }
                    });
                  }

                });
            }
        }
            
         //TEACHERS 
          console.log("spokenlist teacher")
          if(spokenlist != undefined){
            for (let i = 0; i < spokenlist.length; i++) {
                // each entry is a language, fluency, max number of matches
                let language = spokenlist[i][0];
                let teacher_fluency = spokenlist[i][1];

                let max_matches = parseInt(spokenlist[i][2]);

                // NEW check if there is a matching learner 
         
           
                conn.query('SELECT learner_id, language, learner_fluency FROM learner WHERE language=? LIMIT ?', [language, max_matches], function(error, data) {
                  // if a match has been made:
                  // - add new match to matched_users
                  // - remove learner from learner table
                  let learner_id;
                  let learner_fluency;
                  let counter = max_matches;

                  // add each matching pair to matched_users
                     console.log("data")
                     console.log(data)
                  data.forEach(function(element) {

                    learner_id = element['learner_id'];
                    learner_fluency = element['learner_fluency'];
                    conn.query('INSERT INTO matched_users VALUES(?,?,?,?,?)', [learner_id, id_number, language, learner_fluency, teacher_fluency], function(error, data) {
                      if (error) {
                        console.log("Error inserting a new match into database");
                        console.log(error);
                      } else {
                            conn.query('UPDATE users SET matched = ? WHERE id =?', [1,id_number], function(error, data) {
                              if (error) {
                                console.log("Error updating matched number 2");
                                console.log(error);
                                } else {
                                console.log("updating succces 2")
                            }
                        });
                                 conn.query('UPDATE users SET matched = ? WHERE id =?', [1,learner_id], function(error, data) {
                              if (error) {
                                console.log("Error updating matched number");
                                console.log(error);
                                } else {
                                console.log("updating succces")
                            }
                        });
                        console.log("New matched pair created 2: " + learner_id.toString() + ", " + id_number.toString());
                      }
                    });
                    // remove learner from learner table
                    conn.query('DELETE FROM learner WHERE learner_id=? AND language=?', [learner_id, language], function(error, data) {
                      if (error) {
                        console.log("Error removing learner from learner database");
                        console.log(error);
                      } else {
                        console.log("Learner removed from database: " + learner_id.toString());
                      }
                    });
                    counter = counter - 1;
                    console.log("counter early " + counter)

                  });
                 // console.log("counter")
                  //console.log(counter)
                  //var j = counter; 
                  // if any leftover entries (no matches), add new user to teacher table
                  console.log("counter " + counter)
                  for (let j = counter; j > 0; j--) {
                    conn.query('INSERT INTO teacher VALUES(?,?,?)', [id_number, language, teacher_fluency], function(error, data) {
                      if (error) {
                        console.log("Error adding teacher to teacher database");
                      } else {
                        console.log("No learner found; new teacher added to database: " + id_number.toString());
                      }
                    });
                  }
                });
            }
        }

            console.log("updated learner:")
            conn.query('SELECT * FROM learner', function(error, data5) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(data5);
                }
            });
            console.log("updated teacher:")

            conn.query('SELECT * FROM teacher', function(error, data6) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(data6);
                }
            });

            console.log("matched users:")

            conn.query('SELECT * FROM matched_users', function(error, data6) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(data6);
                }
            });

        });
    });

    response.status(204).send();
};

// Post for Reseting User Data
app.post('/reset', resetData);

function resetData(request, response) {

    conn.query('DROP TABLE IF EXISTS matched_users', function(error, data) {
        if (error) {
            console.log(error)
        } else {
            console.log("All matches reset");
        }
    });
    conn.query('DROP TABLE IF EXISTS users', function(error, data) {
        if (error) {
            console.log(error)
        } else {
            console.log("All users reset");
        }
    });
    conn.query('DROP TABLE IF EXISTS learner', function(error, data) {
        if (error) {
            console.log(error)
        } else {
            console.log("All learners reset");
        }
    });
    conn.query('DROP TABLE IF EXISTS teacher', function(error, data) {
        if (error) {
            console.log(error)
        } else {
            console.log("All teachers reset");
        }
    });

    conn.query('CREATE TABLE if not exists users(firstname TEXT, lastname TEXT, email TEXT, password TEXT, id INTEGER PRIMARY KEY AUTO_INCREMENT, bio TEXT, availability TEXT, matched INTEGER)', function(error, data) {
        if (error) {
            console.log(error)
        } else {}
    });

    conn.query('CREATE TABLE if not exists learner(learner_id INTEGER, language TEXT ,learner_fluency TEXT)', function(error, data) {
        if (error) {
            console.log(error)
        } else {}
    });

    conn.query('CREATE TABLE if not exists teacher(teacher_id INTEGER, language TEXT ,teacher_fluency TEXT)', function(error, data) {
        if (error) {
            console.log(error)
        } else {}
    });

    conn.query('CREATE TABLE if not exists matched_users(learner_id INTEGER, teacher_id INTEGER, language TEXT, learner_fluency TEXT, teacher_fluency TEXT)', function(error, data) {
        if (error) {
            console.log(error)
        } else {}
    });

    response.status(204).send();
};

app.post('/sendEmail', sendOut);

    function sendOut() {
    let emails = 'SELECT email FROM users WHERE matched = 1';
    let to_list = []

    conn.query(emails, function(err, email, fields){
        console.log(email);
        for(k in email){
            to_list.push(email[k].email)
          }
      });
      
      

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            //for the real one, we'll probably replace this with a noReply email
            user: 'melokura3@gmail.com',
            pass: 'SmileyfacE'
        }
    });

    var mailOptions = {
        from: 'melokura3@gmail.com',
        to: to_list,
        subject: 'Your Language Match Partner',
        //text: 'nothing'
        html: '<h1>Hey, your language match has been made!</h1> <p>Click <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">here</a> to see who your partner is!</p>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};





app.listen(8081, function() {
    console.log('yeet - Server listening on port 8081');
    //console.log('ver.1');
});
