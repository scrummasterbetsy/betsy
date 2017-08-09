let request = require('request');

exports.ChangeIssueStatus = function(assistant) {
   console.log('+++ChangeItemStatus+++');
   //console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID');
   let strIssueID = assistant.getArgument('IssueID');
   let strStatusTarget = assistant.getArgument('TaskStatus');
   console.log('ProjectID '+strProjectID);
   console.log('IssueID '+strIssueID);
   console.log('StatusTarget '+strStatusTarget);

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
        assistant.ask('There was an error in List Items. '+error +nextPrompt);
        return;
    } // end if
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
        let strJSON = JSON.parse(body);
        console.log(strJSON);
        if (strJSON.total==1) {
          let strStatusCur = ' ' ;
          strStatusCur = strJSON.issues[0].fields.status.name;
          strOut = 'Current status of '+strProjectID+'-'+strIssueID+' is '+strStatusCur;
          console.log(strOut);

   		  //////// Now modify the status
		  console.log('START MODIFY');
		  let objModify = {};
		  strStatusCur = strStatusCur.toUpperCase();
		  strStatusTarget = strStatusTarget.toUpperCase();
		  if (strStatusCur=='TO DO' && strStatusTarget=='IN PROGRESS') {
			objModify = {"update":{"comment":[{"add":{"body":"Work has been started."}}]},"transition":{"id":"351"}};   
		  } else if (strStatusCur=='TO DO' && strStatusTarget=='DONE') {
			objModify = {"update":{"comment":[{"add":{"body":"Work has been cancelled."}}]},"transition":{"id":"411"}};
		  } else if (strStatusCur=='IN PROGRESS' && strStatusTarget=='TO DO') {
			objModify = {"update":{"comment":[{"add":{"body":"Work has been started."}}]},"transition":{"id":"371"}};
		  } else if (strStatusCur=='IN PROGRESS' && strStatusTarget=='DONE') {
			objModify = {"update":{"comment":[{"add":{"body":"Work has been completed."}}]},"transition":{"id":"421"}};
		  } else if (strStatusCur=='IN PROGRESS' && strStatusTarget=='BLOCKED') {
			objModify = {"update":{"comment":[{"add":{"body":"Work has been blocked."}}]},"transition":{"id":"431"}};
		  } else if (strStatusCur=='BLOCKED' && strStatusTarget=='IN PROGRESS') {
			objModify = {"update":{"comment":[{"add":{"body":"Work has been started."}}]},"transition":{"id":"401"}};
		  } else if (strStatusCur=='DONE' && strStatusTarget=='TO DO') {
			objModify = {"update":{"comment":[{"add":{"body":"Work has been reopened."}}]},"transition":{"id":"361"}};
		  } else if (strStatusCur==strStatusTarget) {
			  assistant.ask('The current status of'+strProjectID+'-'+strIssueID+' is already set to '+strStatusCur+'. No need for a change.'+nextPrompt);
			  return;
		  } else {
			  assistant.ask('Error: Transition from'+strStatusCur+' to '+strStatusTarget+'not defined.'+nextPrompt);
			  return;
		  } // end if
			
		   strURL = 'https://projectbetsy.atlassian.net/rest/api/2/issue/'+strProjectID+'-'+strIssueID+'/transitions?expand=transitions.fields';
		   console.log(strURL);
		   
		  options = {
			headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
			method: 'POST',
			url: strURL,
			json: objModify
		  }
		  console.log(options);

		  // Start the request
		  request(options, function (error, response, body) {
			if (error) {
			  console.log(error);
				assistant.ask('There was an error in Change Issue Status. '+error +nextPrompt);
				return;
			} // end if
			console.log('Modify status code: '+response.statusCode); 
			if (!error && response.statusCode >= 200 && response.statusCode <=299) { // all 2xx codes are OK
			   // NO BODY console.log(body);
			   assistant.ask('Issue '+strProjectID+'-'+strIssueID+' successfully changed from '+strStatusCur+' to '+strStatusTarget+'. '+nextPrompt);
		   	} else {
			  assistant.ask('There was an error in the execution of ChangeIssueStatus.'+nextPrompt);
			  return;
			} // end if (!error && response.statusCode == 200)
		  })  // end request

		} else {
           strOut = 'No issue with name '+strProjectID+'-'+strIssueID+' found. ';
           assistant.ask(strOut+nextPrompt);
           return;
        }
    } else {
      assistant.ask('There was an error in the execution of ChangeIssueStatus.'+nextPrompt);
      return;
    } // end if (!error && response.statusCode == 200)
  })  // end request

 } // end ChangeIssueStatus
 
