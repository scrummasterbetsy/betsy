let request = require('request');

exports.AddCommentConfirmation = function(assistant) {
   console.log('+++AddCommentConfirmation+++');
   //console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID');
   let strIssueID = assistant.getArgument('IssueID');
   let strComment = assistant.getArgument('Comment');
   console.log('ProjectID '+strProjectID);
   console.log('IssueID '+strIssueID);
   console.log('Comment '+strComment);
   
  
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
        assistant.ask('There was an error in AddCommentConfirmation. '+error +nextPrompt);
        return;
    } // end if
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
        let strJSON = JSON.parse(body);
        console.log(strJSON);
		if (strJSON.total==1) {
			
        assistant.setContext('AddCommentConfirmation',1);
		let strOut = 'You want to add the following comment to '+strJSON.issues[0].fields.issuetype.name+' "'+strProjectID+'-'+strIssueID+'": \n'+strComment+'. \n Is this correct?';
		

			
		} else {
           strOut = 'Issue "'+strProjectID+'-'+strIssueID+'" does not exist. ';
           assistant.ask(strOut+nextPrompt);
           return;
        }
    } else {
      assistant.ask('There was an error in the execution of AddCommentConfirmation.'+nextPrompt);
      return;
    } // end if (!error && response.statusCode == 200)
  })  // end request

} // end AddCommentConfirmation	
