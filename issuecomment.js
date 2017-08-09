exports.IssueComment = function(assistant) {
   console.log('+++IssueComment+++');
   console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID');
   let strIssueID = assistant.getArgument('IssueID');
   let strComment = assistant.getArgument('Comment');
   console.log('ProjectID '+strProjectID);
   console.log('IssueID '+strIssueID);
   console.log('Comment '+strComment);

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
  // Start the Find current status request
  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
        assistant.ask('There was an error in Issue Comment. '+error +nextPrompt);
        return;
    } // end if
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
        let strJSON = JSON.parse(body);
        console.log(strJSON);
        if (strJSON.total==1) {

   		  //////// Now add the comment
		  console.log('START COMMENT');
		  let objComment = {"body": strComment};
					
		   strURL = 'https://projectbetsy.atlassian.net/rest/api/2/issue/'+strProjectID+'-'+strIssueID+'/comment';
		   console.log(strURL);
		   
		  options = {
			headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
			method: 'POST',
			url: strURL,
			json: objComment
		  }
		  console.log(options);

		  // Start the request
		  request(options, function (error, response, body) {
			if (error) {
			  console.log(error);
				assistant.ask('There was an error in AddComment. '+error +nextPrompt);
				return;
			} // end if
			console.log('Modify status code: '+response.statusCode); 
			if (!error && response.statusCode >= 200 && response.statusCode <=299) { // all 2xx codes are OK
			   // NO BODY console.log(body);
			   assistant.ask('The comment "'+strComment+'" has been added to issue '+strProjectID+'-'+strIssueID+'. '+nextPrompt);
		   	} else {
			  assistant.ask('There was an error in the execution of AddComment.'+nextPrompt);
			  return;
			} // end if (!error && response.statusCode == 200)
		  })  // end request

		} else {
           strOut = 'Issue "'+strProjectID+'-'+strIssueID+'" does not exist. ';
           assistant.ask(strOut+nextPrompt);
           return;
        }
    } else {
      assistant.ask('There was an error in the execution of ChangeIssueStatus.'+nextPrompt);
      return;
    } // end if (!error && response.statusCode == 200)
  })  // end request

 } // end IssueComment	
