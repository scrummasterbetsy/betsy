let request = require('request');

exports.ListIssues = function(assistant) {
   console.log('+++ListIssues+++');
   //console.log(assistant.getRawInput());
   let strProjectID = assistant.getArgument('ProjectID');
   let strHeadTail = assistant.getArgument('HeadTail');
   let strListSize = assistant.getArgument('ListSize');
   let strTaskStatus = assistant.getArgument('TaskStatus');
   console.log('ProjectID '+strProjectID);
   console.log('HeadTail '+strHeadTail);
   console.log('ListSize '+strListSize);
   console.log('TaskStatus '+strTaskStatus);
   
   
   const Prompts = new Array("\nWhat else can I do for you?", 
                          "\nIs there anything else you want me to do?",
                          "\nWhat else do you want to do?",
                          "\nAnything else?");
  let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
  
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

  request(options, function (error, response, body) {
    if (error) {
      console.log(error);
        assistant.ask('There was an error in List Issues. '+error +nextPrompt);
        return;
    } // end if
    console.log(response.statusCode); 
    if (!error && response.statusCode == 200) {
        let strJSON = JSON.parse(body);
        console.log(strJSON);
      
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
          strOut += ' These are the '+strHeadTail+' '+parseInt(strListSize)+' issues on the list: ';          
        } else if (strHeadTail=='first') {
          nEnd = nStart+1;
          strOut += ' This is the '+strHeadTail+' issue on the list: ';          
        } else if (strHeadTail=='last' && strListSize) {
          nStart = Math.max(nStart,nEnd-parseInt(strListSize));
          strOut += ' These are the '+strHeadTail+' '+parseInt(strListSize)+' issues on the list: ';          
        } else if (strHeadTail=='last') {
          nStart = nEnd-1;
          strOut += ' This is the '+strHeadTail+' issues on the list: ';          
        } // end
      
        for (let nInd=nStart; nInd<nEnd; nInd++) { 
           //strOut += ' \nIssue '+strJSON.issues[nInd].key;
          // strOut += ', I.D.: '+strJSON.issues[nInd].id;
           strOut += ' \n'+strJSON.issues[nInd].key;
           strOut += ': '+strJSON.issues[nInd].fields.summary;
           strOut += ', Status: '+strJSON.issues[nInd].fields.status.name;
           strOut += '.';
        } // end for     

        //console.log(strOut);
        assistant.ask(strOut+nextPrompt);
    } // end if (!error && response.statusCode == 200)
  })  // end request 
 } // end ListIssues
