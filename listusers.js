let request = require('request');

exports.ListUsers = function(assistant) {
   console.log('+++ListUsers+++');

const Prompts = new Array("\nWhat else can I do for you?", 
                          "\nIs there anything else you want me to do?",
                          "\nWhat else do you want to do?",
                          "\nAnything else?");   
  let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   
   // Configure the request
  let options = {
    headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
    method: 'GET',
    url:  'https://projectbetsy.atlassian.net/rest/api/2/user/assignable/search?project=BETSY'
  }

  // Start the request
  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
        assistant.ask('There was an error in List Itens. '+error +nextPrompt);
        return;
    } // end if
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
        let strJSON = JSON.parse(body);
        //console.log(strJSON);
      
        // Prepare output 
        let strOut = ' ';
	      for (var key in strJSON) {
           strOut += ' \nUser '+key+': '+strJSON[key].displayName;
           strOut += ' I.D.: '+strJSON[key].name; // these are the IDs used in Jira
        } // end for     
        strOut += '.';

        //console.log(strOut);
        assistant.ask(strOut+nextPrompt);
    } // end if (!error && response.statusCode == 200)
  })  // end request 
 } // end ListUsers
 
