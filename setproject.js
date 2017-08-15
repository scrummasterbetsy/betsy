let jira = require('./app/util/jira').jira;
const util = require('util');

exports.SetProject = function(assistant) {
   //console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID').toUpperCase();
   console.log('+++SetProject ProjectID=' + strProjectID + ' +++');

   jira.listProjects()
    .then(function (body) {
      // Check if current project exists
      body.forEach(function (item) {
        if (strProjectID == item.key.toUpperCase()) {
          assistant.ask('OK. The project is now set to "' + item.key + '". To change the project just say "Set Project". Please tell me what to do.');
          return;
        }
      });

      // Project not found. Hence we need to ask one more time.
      var strOut = 'I could not find project "'+strProjectID+'". \nHere is the list of all available projects: ';
      body.forEach(function (item) {
        strOut += ' \n'+item.key+'.';
      })
      strOut += ' \nWhich one do you want to work with?';

      assistant.setContext('AskForProjectID',1);
      assistant.ask(strOut);

    }).catch(function (err) {
      console.error(err);
      assistant.ask('There was an error in Set Project. '+error +nextPrompt);
      return;
    });
} // end SetProject
