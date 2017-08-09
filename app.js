'use strict';

//process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');
let request = require('request');



let userstories = require('./userstories.js');
let issuecomment = require('./issuecomment.js');
let issueassign = require('./issueassign.js');
let changeissuestatus = require('./changeissuestatus.js');
//let issueassign = require('./issueassign.js');
//let issueassign = require('./issueassign.js');


let app = express();
app.use(bodyParser.json({type: 'application/json'}));

// [START ACTIONS]
app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  //console.log('Request headers: ' + JSON.stringify(req.headers));
  //console.log('Request body: ' + JSON.stringify(req.body));


  
///////////////////////////////////////////////////////  
 function ListItems(assistant) {
   console.log('+++ListItems+++');
   //console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID');
   let strHeadTail = assistant.getArgument('HeadTail');
   let strListSize = assistant.getArgument('ListSize');
   let strTaskStatus = assistant.getArgument('TaskStatus');
   console.log('ProjectID '+strProjectID);
   console.log('HeadTail '+strHeadTail);
   console.log('ListSize '+strListSize);
   console.log('TaskStatus '+strTaskStatus);
   
   // Configure the request
   let strURL = 'https://projectbetsy.atlassian.net/rest/api/2/search?jql=project%3D'+strProjectID.toUpperCase();
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
        assistant.ask('There was an error in List Items. '+error +nextPrompt);
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
 } // end ListItems

///////////////////////////////////////////////////////  
 function ListUsers(assistant) {
   console.log('+++ListUsers+++');
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
         //  strOut += ' I.D.: '+strJSON[key].name; // these are the IDs used in Jira
        } // end for     
        strOut += '.';

        //console.log(strOut);
        assistant.ask(strOut+nextPrompt);
    } // end if (!error && response.statusCode == 200)
  })  // end request 
 } // end ListUsers
  
         
  let actionMap = new Map();
  actionMap.set('input.userstories', userstories.UserStories);
  actionMap.set('input.issuecomment', issuecomment.IssueComment);
  actionMap.set('input.issueassign', issueassign.IssueAssign);
  actionMap.set('input.changeissuestatus', .changeissuestatus.ChangeIssueStatus);	
  actionMap.set('input.listitems', ListItems);
  actionMap.set('input.listusers', ListUsers);	
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
