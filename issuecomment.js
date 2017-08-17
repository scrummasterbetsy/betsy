let request = require('request');

exports.IssueComment = function(assistant) {
   console.log('+++IssueComment+++');
   //console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID');
   let strIssueID = assistant.getArgument('IssueID');
   let strComment = assistant.getArgument('Comment');
   let strDecisionYesNo = assistant.getArgument('strDecisionYesNo');	
   console.log('ProjectID: '+strProjectID);
   console.log('IssueID: '+strIssueID);
   console.log('Comment: '+strComment);
   console.log('DecisionYesNo: '+strDecisionYesNo);
	
   const Prompts = new Array("\nWhat else can I do for you?", 
                          "\nIs there anything else you want me to do?",
                          "\nWhat else do you want to do?",
                          "\nAnything else?");
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];   

   // Abort
   if (strDecisionYesNo.toUpperCase() == 'NO') {
	assistant.ask('Understood. I did not make any changes. \n'+nextPrompt);
	return;
   } // end if

  // Add Comment
  console.log('START COMMENT');
  let objComment = {"body": strComment};
			
   let strURL = 'https://projectbetsy.atlassian.net/rest/api/2/issue/'+strProjectID+'-'+strIssueID+'/comment';
   console.log(strURL);
   
  let options = {
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
	   assistant.ask('The comment "'+strComment+'" has been added to "'+strProjectID+'-'+strIssueID+'". \n'+nextPrompt);
	} else {
	  assistant.ask('There was an error in the execution of AddComment.'+nextPrompt);
	  return;
	} // end if (!error && response.statusCode == 200)
  })  // end request



 } // end IssueComment	
