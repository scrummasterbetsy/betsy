# Dependencies

* homebrew (https://brew.sh/)
* node.js (`brew install node`)
* ngrok (`brew cask install ngrok`)

# Set up



# Running locally

## Once, or when you change dependencies
* `npm install`

## As needed
* `npm start`
* `ngrok http 8080`
* Change the app.ai webook to point to the ngrok.io forwarding address

# Clean up
* **Don't forget to reset the webhook to https://scrumbetsy.herokuapp.com/ when you're done!**

# Mike's notes

* We should be using the [node-jira](https://github.com/steves/node-jira) package instead of trying to roll our own.
* We should find a way to build unit/integration tests using mocha.
