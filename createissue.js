let request = require('request');

exports.CreateIssue = function(assistant) {
	console.log('+++CreateIssue+++');
	//console.log(assistant.getRawInput());
	let strProjectID = assistant.getArgument('ProjectID');
	let strIssueType = assistant.getArgument('IssueType');
	let strSummary = assistant.getArgument('Summary');
	let strDescription  = assistant.getArgument('Description');
	console.log('ProjectID: '+strProjectID);
	console.log('IssueType: '+strIssueType);
	console.log('Summary: '+strSummary);
	console.log('Description: '+strDescription);
  
  const Prompts = new Array("\nWhat else can I do for you?", 
                          "\nIs there anything else you want me to do?",
                          "\nWhat else do you want to do?",
                          "\nAnything else?");
  let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];   
	 
 
	let objIssue = {
		"fields": { "project":  { "key": strProjectID.toUpperCase() },
			    "summary": strSummary, "description": strDescription, "issuetype": {"name": strIssueType.substr(0,1).toUpperCase()+
													strIssueType.substring(1,strIssueType.length).toLowerCase() } }
	}
	console.log(objIssue.fields);
	
				
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
		if (!error && (response.statusCode == 200 || response.statusCode == 201) ) {
		   console.log(body);
		   let strJSON = JSON.parse(body);
		   console.log(strJSON);
		   //assistant.ask(strType+' "'+strJSON.key+'" was successfully created. '+nextPrompt);
		   assistant.ask(strType+' "" was successfully created. '+nextPrompt);
		} else {
		  assistant.ask('There was an error in the execution of Create Issue.'+nextPrompt);
		  return;
		} // end if (!error && response.statusCode == 200)
	})  // end request

	

} // end CreateIssue
