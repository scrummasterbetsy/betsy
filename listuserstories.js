let request = require('request');

exports.ListUserStories = function(assistant) {
   console.log('+++ List User Stories +++');
    const Prompts = new Array("\nWhat else can I do for you?", 
                          "\nIs there anything else you want me to do?",
                          "\nWhat else do you want to do?",
                           "\nAnything else?"); 
   let nextPrompt = Prompts[Math.floor(Math.random() * Prompts.length)];
   assistant.ask('This is the new user story intent. '+nextPrompt);
   
} // end ListUserStories
