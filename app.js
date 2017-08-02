'use strict';

process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');
let request = require('request');

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
   console.log(assistant.getRawInput());
   let TaskID = assistant.getArgument('TaskID');
   let TaskStatus = assistant.getArgument('TaskStatus');
   
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   assistant.ask('I have updated Task '+TaskID+' to '+TaskStatus+'. '+nextPrompt);
 }
  
  function ProcessIssues(assistant) {
   console.log('Issues');
   console.log(assistant.getRawInput());
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
  
 function BackLogItems(assistant) {
   console.log('BackLogItems');
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   assistant.ask('This is the backlog item intent test. '+nextPrompt);
 }

///////////////////////////////////////////////////////  
 function ListItems(assistant) {
   console.log('ListItems');
   // Set the headers
  var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded'
  }

  // Configure the request
  var options = {
    url: 'https://projectbetsy.atlassian.net/rest/api/2/search',
    method: 'GET',
    headers: headers,
    qs: {'jql': 'project=BETSY'},
    auth : 'Basic YmV0c3k6QmV0c3lCb3Q4MjI=' 
  }

  // Start the request
  request(options, function (error, response, body) {
    console.log('-------------------------------------------------------------'); 
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
        // Print out the response body
        console.log('-------------------------------------------------------------');     
        let strJSON = JSON.parse(body);
        console.log(strJSON);
        console.log('-------------------------------------------------------------');     

    }
  })  // end request 
 
   
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   assistant.ask('This is the list items intent. '+nextPrompt);
 }
  ////////////////////////////////////////  
  
  
  let actionMap = new Map();
  actionMap.set('input.settaskstatus', SetTaskStatus);
  actionMap.set('input.issues', ProcessIssues);
  actionMap.set('input.userstories', UserStories);
  actionMap.set('input.backlogitems', BackLogItems);  
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
