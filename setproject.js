let request = require('request');

exports.SetProject = function(assistant) {
   console.log('+++SetProject+++');
   //console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID');
   console.log('ProjectID '+strProjectID); 
   
  
   // Configure the request
  let options = {
    headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
    method: 'GET',
    url:  'https://projectbetsy.atlassian.net/rest/api/2/project'
  }

  // Start the request
  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
        assistant.ask('There was an error in Set Project. '+error +nextPrompt);
        return;
    } // end if
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
	 console.log(body);
        let strJSON = JSON.parse(body);
        //console.log(strJSON);
        
        // Check if current project exists
        for (var key in strJSON) {
          if (strProjectID.toUpperCase() == strJSON[key].key.toUpperCase()) {
            assistant.ask('\nOK. The project is now set to "'+strProjectID+'". To change the project just say "Set Project". Please tell me what to do.');
            return;
          } // end 
        } // end for
         
         // Project not found. Hence we need to ask one more time.
        // Prepare output 
        let strOut = 'I could not find project "'+strProjectID+'". \nHere is the list of all available projects: ';
	      for (var key in strJSON) {
           strOut += ' \n'+strJSON[key].key+'.';
        } // end for     
        strOut += ' \nWhich one do you want to work with?';

        //console.log(strOut);
        assistant.setContext('AskForProject',1);
        assistant.ask(strOut);
    } // end if (!error && response.statusCode == 200)
}) // end request 
} // end SetProject
