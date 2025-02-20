if(String(localStorage.permissions) !== '"Technician"')
	{
	 alert("Access Denied!");
	 window.location.href = "error.html";
	}


window.onload = function ()
{
//This is a function that loads the temp data from the ticket request; it will be removed later. 
setData();

var username = localStorage.getItem('username');
	
//Prepping header for API call to obtain most recent tech and status.

var tech_2;
var status_2;
var comment;
var status_1;
var assigned_tech;

//Obtaining url for ticket ID number:
var url = window.location.href;

//Obtaining portion after "?" towards the end:
var parameters = url.substring(url.indexOf('?'));

//Obtaining ticket numbe, which is situated between "id=" and "&":
const idIndex = url.indexOf("id=") + 3; // add 3 to skip "id="
const ampersandIndex = url.indexOf("&", idIndex); // find the next "&" after "id="
const id = url.substring(idIndex, ampersandIndex); // extract the substring between "id=" and "&"

var ticket_number = id;


//Function to set description, subject, and floor of ticket:
function setcomments(ticket)
{
	        // instantiate a headers object
            var myHeaders = new Headers();
            // add content type header to object
            myHeaders.append("Content-Type", "application/json");
            // using built in JSON utility package turn object to string and store in a variable
            var raw = JSON.stringify({"id":ticket});
            // create a JSON object with parameters for API call and store in a variable
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            // make API call with parameters and use promises to get response
            fetch("https://4yvfdyzeyh.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
            .then(response => response.json())
            .then(data => {
				document.getElementById("Description").value = data.data;
				document.getElementById("Risk").value = data.subject;
				document.getElementById("Exhibit").value = data.floor;
			})
            .catch(error => console.log('error', error));
}

//Calling API to set ticket comments.
setcomments(ticket_number);

function dashboard_update(firstName, lastName)
{
        // define the callAPI function that takes a first name and last name as parameters
            var myHeaders = new Headers();
            // add content type header to object
            myHeaders.append("Content-Type", "application/json");
            // using built in JSON utility package turn object to string and store in a variable
            var raw = JSON.stringify({"firstName":firstName,"lastName":lastName});
            // create a JSON object with parameters for API call and store in a variable
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            // make API call with parameters and use promises to get response
            fetch("https://pdgpdv7npk.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
            .then(response => response.text())
            .catch(error => console.log('error', error));
}

function load_thread()
{
            // instantiate a headers object
            var myHeaders = new Headers();
            // add content type header to object
            myHeaders.append("Content-Type", "application/json");
            // using built in JSON utility package turn object to string and store in a variable
            var raw = JSON.stringify({"firstName":"Steven","lastName":"Nevins"});
            // create a JSON object with parameters for API call and store in a variable
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };
            // make API call with parameters and use promises to get response
            fetch("https://ea1qb9r20b.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
			.then(response => response.json())
			.then(data => {
				dataarray = JSON.parse(data);
				
				dataarray.forEach(obj => {
					if(obj.Ticket_Number === ticket_number)
					{
						if(obj.Subtype === "Comment")
						{
							update_comments(obj.Date, obj.Info, obj.User);
						}
						if(obj.Subtype === "Status Change")
						{
							update_status(obj.Date, obj.Info, obj.User);
						}
						if(obj.Subtype === "Tech Change")
						{
							update_tech(obj.Date, obj.Info, obj.User);
						}
					}
					else{
						console.log("Nothing");
					}
				});
			})
			.catch(error => console.log('error', error));
}



function load_state()
{
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
// using built in JSON utility package turn object to string and store in a variable
var raw = JSON.stringify({"id":ticket_number});
var requestOptions = {
		method: 'POST',
		headers: myHeaders,
		body: raw,
		redirect: 'follow'
	};
	
// make API call with parameters and use promises to get response
fetch("https://uaysrnlktj.execute-api.us-west-2.amazonaws.com/dev", requestOptions)
.then(response => response.json())
.then(data => {
		tech_2 = data.tech;
		status_2 = data.status;
		
		document.getElementById("Status").value = status_2;
	
		document.getElementById("technician").value = tech_2;
		
		loadInitial(tech_2, status_2);

})
.catch(error => console.log('error', error));
}

load_thread();
load_state();

function loadInitial(t, s)
{
comment = "";
status_1 = s;
assigned_tech = t;
}

document.getElementById("reset_button").addEventListener("click", reset_all);

function reset_all()
{	
	document.getElementById("Status").value = status_1;
	
	document.getElementById("technician").value = assigned_tech;
	
	document.getElementById("comments").value = "";
}

//Code to update status section after change is validated. 

function update_status(date, input, user)
{
	//Updating database:
	console.log("Passing ticket " + ticket_number + " to database. Status change = " + input);
	dashboard_update(ticket_number, input);
	
	var timestamp = date;
	
	status_1 = input;
	
	//Creating new elements. 
	
	var box = document.createElement("fieldset");
	
	var legend = document.createElement("legend");
	var legend = document.createElement("legend");
	
	var space = document.createElement("p");
	
	var tag = document.createElement("textarea");
	
	var element = document.getElementById("thread");
	
	//Formatting new elements. 
	
	space.innerHTML = "\n" + "\n";
	
	legend.innerHTML = "@" + user + " - - - - - - " + timestamp;
	
	tag.rows = 5;
	
	tag.cols = 45;
	
	tag.innerHTML = "Action:\n" + "\n" + "Ticket Status = " + input + ".";
	
	//Adding elements to file.
	
	element.prepend(space);
	
	element.prepend(box);
	
	box.appendChild(legend);
	
	box.appendChild(tag);
	
	//Resetting username back to local value:
	username = localStorage.getItem('username');
	
}

//Code to update technician section after change is validated. 

function update_tech(date, input, user)
{
	assigned_tech = input;
	
	var timestamp = date;
	
	//Creating new elements. 
	
	var box = document.createElement("fieldset");
	
	var legend = document.createElement("legend");
	
	var space = document.createElement("p");
	
	var tag = document.createElement("textarea");
	
	var element = document.getElementById("thread");
	
	//Formatting new elements. 
	
	space.innerHTML = "\n" + "\n";
	
	legend.innerHTML = "@" + user + " - - - - - - " + timestamp;
	
	tag.rows = 5;
	
	tag.cols = 45;
	
	tag.innerHTML = "Action:\n" + "\n" + "Assigned Technician = " + input + ".";
	
	//Adding elements to file.
	
	element.prepend(space);
	
	element.prepend(box);
	
	box.appendChild(legend);
	
	box.appendChild(tag);
	
	//Resetting username back to local value:
	username = localStorage.getItem('username');
	
}

//Code to update comments section after change is validated. 

function update_comments(date, input, user)
{
	var timestamp = date;
	
	comment = input;
	
	//Creating new elements. 
	
	var box = document.createElement("fieldset");
	
	var legend = document.createElement("legend");
	
	var space = document.createElement("p");
	
	var tag = document.createElement("textarea");
	
	var element = document.getElementById("thread");
	
	//Formatting new elements. 
	
	space.innerHTML = "\n" + "\n";
	
	legend.innerHTML = "@" + user + " - - - - - - " + timestamp;
	
	tag.rows = 5;
	
	tag.cols = 45;
	
	tag.innerHTML = "Comment:\n" + "\n" + input;
	
	//Adding elements to file.
	
	element.prepend(space);
	
	element.prepend(box);
	
	box.appendChild(legend);
	
	box.appendChild(tag);
	
	document.getElementById("comments").value = "";
	
	//Resetting username back to local value:
	username = localStorage.getItem('username');
	
}

//Code for handling submit button. 

document.getElementById("submit_button").addEventListener("click", handleClick);

function handleClick()
{
	check_comment();
	check_status();
	check_tech();
}

//TICKET STATUS SECTION//

function check_status()
{
	//Formatting time stamp. 
	
	var date = new Date();
	
	var timestamp = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()} @ ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
	
	input = document.getElementById("Status").value;
	
	if(input != status_1)
	{
		callAPI(username ,document.getElementById('Status').value, "Action", "Status Change", "3");
		
		update_status(timestamp, input, username);
	}
	
}	

//ASSIGNED TECH SECTION//
function check_tech()
{
	//Formatting time stamp. 
	
	var date = new Date();
	
	var timestamp = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()} @ ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
	
	input = document.getElementById("technician").value;
	
	if(input != assigned_tech)
	{
		callAPI(username ,document.getElementById('technician').value, "Action", "Tech Change", "2");
		
		update_tech(timestamp, input, username);
	}
	
}

//COMMENTS SECTION//
function check_comment()
{
	//Formatting time stamp. 
	
	var date = new Date();
	
	var timestamp = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()} @ ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}`;
	
	//Grabbing input data.
	
	input = document.getElementById("comments").value;
	
	if((input != comment) && (input != ""))
	{
		callAPI(username ,document.getElementById('comments').value, "Comment", "Comment", "1");
		
		update_comments(timestamp, input, username);
	}
}

}