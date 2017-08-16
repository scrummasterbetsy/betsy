let request = require('request');

exports.ListSubtasks = function(assistant) {
   console.log('+++ListSubtasks+++');
   //console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID');
   let strIssueID = assistant.getArgument('IssueID');
   let strTaskStatus = assistant.getArgument('TaskStatus');
   console.log('ProjectID: '+strProjectID);
   console.log('IssueID: '+strIssueID);
   console.log('Task Status: '+strTaskStatus);

   let strOut = ' ';

   const Prompts = new Array("\nWhat else can I do for you?", 
                          "\nIs there anything else you want me to do?",
                          "\nWhat else do you want to do?",
                          "\nAnything else?");
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];   
	 
   // Find current status
   let strURL = 'https://projectbetsy.atlassian.net/rest/api/2/search?jql=project%3D'+strProjectID.toUpperCase()+'+AND+issueKey%3D'+strProjectID+'-'+strIssueID;
   console.log(strURL);
   let options = {
     headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
     method: 'GET',
     url: strURL
   }
  // Find out is the parent exists
  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
        assistant.ask('There was an error in List Subtasks. '+error +nextPrompt);
        return;
    } // end if
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
        let strJSON = JSON.parse(body);
        console.log(strJSON);
        if (strJSON.total==1) {

   		  //////// Start listing of subtasks
		  console.log('START LIST SUBTASKS');				
		  strURL = 'https://projectbetsy.atlassian.net/rest/api/2/search?jql=project%3D'+strProjectID.toUpperCase()+'+and+parent+in+("'+strProjectID+'-'+strIssueID+'")';
                  if (strTaskStatus) strURL += '+AND+status+in+%28%22'+strTaskStatus+'%22%29';
		  console.log(strURL);
		   
		  options = {
			headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
			method: 'GET',
			url: strURL
		  }
		  console.log(options);

		  // Start the request
		  request(options, function (error, response, body) {
			if (error) {
			  console.log(error);
				assistant.ask('There was an error in List Subtasks. '+error +nextPrompt);
				return;
			} // end if
			console.log(response.statusCode); 
			if (!error && response.statusCode == 200) {
				let strJSON = JSON.parse(body);
				console.log(strJSON);
			  
				// Prepare output 
				let strOut = ' ';
				if (strJSON.total==0) {
				  strOut = 'There are no subtasks for "'+strProjectID+'-'+strIssueID+'"';
				  assistant.ask(strOut+nextPrompt);
				  return;
				} else if (strJSON.total==1) {
				  strOut = 'There is a total of '+strJSON.total+' subtasks';
				} else {
				  strOut = 'There are a total of '+strJSON.total+' subtasks';
				} // end if
				if (strTaskStatus) strOut += ' with Status '+strTaskStatus;
				strOut +=':';

				for (let nInd=0; nInd<strJSON.total; nInd++) { 
				   strOut += ' \n'+strJSON.issues[nInd].key;
				   strOut += ': '+strJSON.issues[nInd].fields.summary;
				   strOut += ', Status: '+strJSON.issues[nInd].fields.status.name;
				   strOut += '.';
				} // end for     

				//console.log(strOut);
				assistant.ask(strOut+nextPrompt);
			} // end if (!error && response.statusCode == 200)
			}) // end request 
		} else {
           strOut = 'Story "'+strProjectID+'-'+strIssueID+'" does not exist. ';
           assistant.ask(strOut+nextPrompt);
           return;
        }
    } else {
      assistant.ask('There was an error in the execution of List Subtasks.'+nextPrompt);
      return;
    } // end if (!error && response.statusCode == 200)
  })  // end request

} // end ListSubtasks	
