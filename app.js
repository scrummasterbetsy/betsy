'use strict';

//process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');
let request = require('request');
let http = require('http');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

// [START ACTIONS]
app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  //console.log('Request headers: ' + JSON.stringify(req.headers));
  //console.log('Request body: ' + JSON.stringify(req.body));
 
 const Prompts = new Array("What else can I do for you?", 
                          "Is there anything else you want me to do?",
                          "What other changes do you want to make?",
                          "Anything else?");
  
 function SetTaskStatus(assistant) {
   console.log('SetTaskStatus');
   //console.log(assistant.getRawInput());
   let TaskID = assistant.getArgument('TaskID');
   let TaskStatus = assistant.getArgument('TaskStatus');
   
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   assistant.ask('I have updated Task '+TaskID+' to '+TaskStatus+'. '+nextPrompt);
 }
  
  function ProcessIssues(assistant) {
   console.log('Issues');
   //console.log(assistant.getRawInput());
   let IssueID = assistant.getArgument('IssueID');
   let Action = assistant.getArgument('Action');
   
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   assistant.ask('I have updated Issue '+IssueID+' with the action '+Action+'. '+nextPrompt);
 }
  
  
 function UserStories(assistant) {
   console.log('UserStories');
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   assistant.ask('This is the user story intent. '+nextPrompt);
 }

///////////////////////////////////////////////////////  
 function ListItems(assistant) {
   console.log('+++ListItems+++');
   //console.log(assistant.getRawInput());
   let strHeadTail = assistant.getArgument('HeadTail');
   let strListSize = assistant.getArgument('ListSize');
   let strTaskStatus = assistant.getArgument('TaskStatus');
   console.log('HeadTail '+strHeadTail);
   console.log('ListSize '+strListSize);
   console.log('TaskStatus '+strTaskStatus);
   
   // Configure the request
   let strURL = 'https://projectbetsy.atlassian.net/rest/api/2/search?jql=project%3DBETSY';
   if (strTaskStatus) strURL += '+AND+status+in+%28%22'+strTaskStatus+'%22%29';
   console.log(strURL);
   

  let options = {
    headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
    method: 'GET',
    url: strURL
  }

  // Start the request
  let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
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
        if (strJSON.total==1) {
          strOut = 'There is a total of '+strJSON.total+' issue';
        } else {
          strOut = 'There are a total of '+strJSON.total+' issues';
        } // end if
        if (strTaskStatus) strOut += ' with Status '+strTaskStatus;
        strOut +=':';
        for (let nInd=0; nInd<strJSON.total; nInd++) { 
           strOut += ' Issue '+strJSON.issues[nInd].key;
           strOut += ', I.D.: '+strJSON.issues[nInd].id;
           strOut += ', Status: '+strJSON.issues[nInd].fields.status.name;
           strOut += '.';
        } // end for     

        //console.log(strOut);
        assistant.ask(strOut+nextPrompt);
    } // end if (!error && response.statusCode == 200)
  })  // end request 
 }
  ////////////////////////////////////////  
  
         
  let actionMap = new Map();
  actionMap.set('input.settaskstatus', SetTaskStatus);
  actionMap.set('input.issues', ProcessIssues);
  actionMap.set('input.userstories', UserStories);
  actionMap.set('input.listitems', ListItems);
  assistant.handleRequest(actionMap);

});
// [END ACTIONS]

if (module === require.main) {
  // Start the server
  let server = app.listen(process.env.PORT || 8080, function () {
    let port = server.address().port;
    console.log('App listening on port %s', port);
  });
}

module.exports = app;
