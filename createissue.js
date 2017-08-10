let request = require('request');

exports.CreateIssue = function(assistant) {
	console.log('+++CreateIssue+++');
	//console.log(assistant.getRawInput());
	let strProjectID = assistant.getArgument('ProjectID');
	let strType = assistant.getArgument('Type');
	let strSummary = assistant.getArgument('Summary');
	let strDescription  = assistant.getArgument('strDescription');
	console.log('ProjectID: '+strProjectID);
	console.log('Type: '+strType);
	console.log('Summary: '+strSummary);
	console.log('Description: '+strDescription);
  
  const Prompts = new Array("\nWhat else can I do for you?", 
                          "\nIs there anything else you want me to do?",
                          "\nWhat else do you want to do?",
                          "\nAnything else?");
  let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];   
	 
 
	let objIssue = {
		"fields": {
			"project":  { "key": strProjectID },
			"summary": strSummary, "description": strDescription, "issuetype": {"name": strType }
		}
	}
				
	strURL = 'https://projectbetsy.atlassian.net/rest/api/2/issue/';
	console.log(strURL);
	   
	let options = {
		headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
		method: 'POST',
		url: strURL,
		json: objIssue
	}
	console.log(options);

	// Start the request
	request(options, function (error, response, body) {
		if (error) {
		  console.log(error);
			assistant.ask('There was an error in Create Issue. '+error +nextPrompt);
			return;
		} // end if
		console.log('Create Issue status code: '+response.statusCode); 
		if (!error && response.statusCode == 200) {
		   NO BODY console.log(body);
		   let strJSON = JSON.parse(body);
		   assistant.ask(strType+' "'+strJSON.key+'" was successfully created. '+nextPrompt);
		} else {
		  assistant.ask('There was an error in the execution of Create Issue.'+nextPrompt);
		  return;
		} // end if (!error && response.statusCode == 200)
	})  // end request

	

} // end CreateIssue
