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
 
 const Prompts = new Array("\nWhat else can I do for you?", 
                          "\nIs there anything else you want me to do?",
                          "\nWhat else you want to do?",
                          "\nAnything else?");
 
  
 function UserStories(assistant) {
   console.log('UserStories');
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   assistant.ask('This is the user story intent. '+nextPrompt);
 }

///////////////////////////////////////////////////////  
 function ChangeIssueStatus(assistant) {
   console.log('+++ChangeItemStatus+++');
   console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID');
   let strIssueID = assistant.getArgument('IssueID');
   let strStatusTarget = assistant.getArgument('TaskStatus');
   console.log('ProjectID '+strProjectID);
   console.log('IssueID '+strIssueID);
   console.log('StatusTarget '+strStatusTarget);
   let strStatusCur = ' ' ;
   let strOut = ' ';
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   
   // Find current status
   // Configure the request
   let strURL = 'https://projectbetsy.atlassian.net/rest/api/2/search?jql=project%3DBETSY+AND+issueKey%3D'+strProjectID+'-'+strIssueID;
   console.log(strURL);
   let options = {
     headers: {'Content-Type':'application/json', 'Authorization':'Basic YmV0c3k6QmV0c3lCb3Q4MjI='},
     method: 'GET',
     url: strURL
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
        console.log(strJSON);
        if (strJSON.total==1) {
          strStatusCur = strJSON.issues[0].fields.status.name;
          strOut = 'Current status of '+strProjectID+'-'+strIssueID+' is '+strStatusCur;
          console.log(strJSON);
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

   
  //////// Now modify the status
  let strModify = ' ';
  strStatusCur = strStatusCur.toUpperCase();
  strStatusTarget = strStatusTarget.toUpperCase();
  if (strStatusCur=='TO DO' && strStatusTarget=='IN PROGRESS') {
    strModify = '"update":{"comment":[{"add":{"body":"Work has been started."}}]},"transition":{"id":"351"}';   
  } else if (strStatusCur=='TO DO' && strStatusTarget=='DONE') {
    strModify = '"update":{"comment":[{"add":{"body":"Work has been cancelled."}}]},"transition":{"id":"411"}';
  } else if (strStatusCur=='IN PROGRESS' && strStatusTarget=='TO DO') {
    strModify = '"update":{"comment":[{"add":{"body":"Work has been started."}}]},"transition":{"id":"371"}';
  } else if (strStatusCur=='IN PROGRESS' && strStatusTarget=='DONE') {
    strModify = '"update":{"comment":[{"add":{"body":"Work has been completed."}}]},"transition":{"id":"421"}';
  } else if (strStatusCur=='IN PROGRESS' && strStatusTarget=='BLOCKED') {
    strModify = '"update":{"comment":[{"add":{"body":"Work has been blocked."}}]},"transition":{"id":"431"}';
  } else if (strStatusCur=='BLOCKED' && strStatusTarget=='IN PROGRESS') {
    strModify = '"update":{"comment":[{"add":{"body":"Work has been started."}}]},"transition":{"id":"401"}';
  } else if (strStatusCur=='DONE' && strStatusTarget=='TO DO') {
    strModify = '"update":{"comment":[{"add":{"body":"Work has been reopened."}}]},"transition":{"id":"361"}';
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
    json: { strModify }
  }

  // Start the request
  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
        assistant.ask('There was an error in Change Issue Status. '+error +nextPrompt);
        return;
    } // end if
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
       let strJSON = JSON.parse(body);
       console.log(strJSON);
       assistant.ask('Issue '+strProjectID+'-'+strIssueID+' successfully changed from '+strStatusCur+' to '+strStatusTarget+'. '+nextPrompt);
   } else {
      assistant.ask('There was an error in the execution of ChangeIssueStatus.'+nextPrompt);
      return;
    } // end if (!error && response.statusCode == 200)
  })  // end request
 } // end ChangeIssueStatus
  
  
///////////////////////////////////////////////////////  
 function ListItems(assistant) {
   console.log('+++ListItems+++');
   console.log(assistant.getRawInput());
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
      
        let nStart = 0;
        let nEnd = strJSON.total;
        if (strHeadTail=='first' && strListSize) {
          nEnd = Math.min(nEnd,parseInt(strListSize));
          strOut += ' These are the '+strHeadTail+' '+parseInt(strListSize)+' items on the list: ';          
        } else if (strHeadTail=='first') {
          nEnd = nStart+1;
          strOut += ' This is the '+strHeadTail+' item on the list: ';          
        } else if (strHeadTail=='last' && strListSize) {
          nStart = Math.max(nStart,nEnd-parseInt(strListSize));
          strOut += ' These are the '+strHeadTail+' '+parseInt(strListSize)+' items on the list: ';          
        } else if (strHeadTail=='last') {
          nStart = nEnd-1;
          strOut += ' This is the '+strHeadTail+' item on the list: ';          
        } // end
      
        for (let nInd=nStart; nInd<nEnd; nInd++) { 
           strOut += ' \nIssue '+strJSON.issues[nInd].key;
          // strOut += ', I.D.: '+strJSON.issues[nInd].id;
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
  actionMap.set('input.userstories', UserStories);
  actionMap.set('input.changeissuestatus', ChangeIssueStatus);
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
