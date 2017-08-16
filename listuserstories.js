let request = require('request');

exports.ListUserStories = function(assistant) {
   console.log('+++ List User Stories +++');
   let strProjectID = assistant.getArgument('ProjectID');   
   console.log('ProjectID: '+strProjectID);
   
   const Prompts = new Array("\nWhat else can I do for you?", 
                          "\nIs there anything else you want me to do?",
                          "\nWhat else do you want to do?",
                          "\nAnything else?");
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];   
	 
   // Check is the parent exists
   let strURL = 'https://projectbetsy.atlassian.net/rest/api/2/search?jql=project%3D'+strProjectID.toUpperCase()+'+and+type%3DStory';
   console.log(strURL);
   let options = {
     headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
     method: 'GET',
     url: strURL
   }
  
  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
        assistant.ask('There was an error in List User Stories. '+error +nextPrompt);
        return;
    } // end if
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
        let strJSON = JSON.parse(body);
        console.log(strJSON);
			// Prepare output 
				let strOut = ' ';
				if (strJSON.total==0) {
				  strOut = 'There are no User Stories in Project "'+strProjectID+'"';
				  assistant.ask(strOut+nextPrompt);
				  return;
				} else if (strJSON.total==1) {
				  strOut = 'There is a total of '+strJSON.total+' User Story';
				} else {
				  strOut = 'There are a total of '+strJSON.total+' User Stories';
				} // end if
				strOut +=':';
       
				for (let nInd=0; nInd<strJSON.total; nInd++) { 
				   strOut += ' \n'+strJSON.issues[nInd].key;
				   strOut += ': '+strJSON.issues[nInd].fields.summary;
				   strOut += ', Status: '+strJSON.issues[nInd].fields.status.name;
				   strOut += '.';
				} // end for  
				assistant.ask(strOut+nextPrompt);
       
    } else {
      assistant.ask('There was an error in the execution of List User Stories.'+nextPrompt);
      return;
    } // end if (!error && response.statusCode == 200)
  })  // end request

} // end ListUserStories	
