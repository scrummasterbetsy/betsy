var JiraApi = require('jira-client');

// Initialize
exports.jira = new JiraApi({
  protocol: 'https',
  host: 'projectbetsy.atlassian.net',
  username: 'betsy',
  password: 'BetsyBot822',
  apiVersion: '2',
  strictSSL: true
});
