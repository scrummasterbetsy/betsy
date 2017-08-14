'use strict';

//process.env.DEBUG = 'actions-on-google:*';
let Assistant = require('actions-on-google').ApiAiAssistant;
let express = require('express');
let bodyParser = require('body-parser');
let request = require('request');



let userstories = require('./userstories.js');
let createissue = require('./createissue.js');
let issuecomment = require('./issuecomment.js');
let issueassign = require('./issueassign.js');
let changeissuestatus = require('./changeissuestatus.js');
let listissues = require('./listissues.js');
let listusers = require('./listusers.js');
let setproject = require('./setproject.js');
let listprojects = require('./listprojects.js');

let app = express();
app.use(bodyParser.json({type: 'application/json'}));

// [START ACTIONS]
app.post('/', function (req, res) {
  const assistant = new Assistant({request: req, response: res});
  //console.log('Request headers: ' + JSON.stringify(req.headers));
  //console.log('Request body: ' + JSON.stringify(req.body));
  
// define the actions map         
  let actionMap = new Map();
  actionMap.set('input.userstories', userstories.UserStories);
  actionMap.set('create.issue', createissue.CreateIssue);
  actionMap.set('input.issuecomment', issuecomment.IssueComment);
  actionMap.set('input.issueassign', issueassign.IssueAssign);
  actionMap.set('input.changeissuestatus', changeissuestatus.ChangeIssueStatus);	
  actionMap.set('list.listissues', listissues.ListIssues);
  actionMap.set('list.listusers', listusers.ListUsers);
  actionMap.set('input.setproject', setproject.SetProject);	
  actionMap.set('list.projects', listprojects.ListProjects);	
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
