const octokit = require('@octokit/rest')();
const _ = require('lodash');
const dbInterface = require('./dbInterfaces');

module.exports = {
  createIssue: async (req, res) => {
    const title = _.toString(req.body.title).trim();
    const body = _.toString(req.body.body).trim();
    const userId = req.userId;

    try {
      if (_.isEmpty(title) || _.isEmpty(body)) {
        throw new Error('All fields are required.');
      }

      const user = await dbInterface.getUsersById(userId);

      // basic authentication
      octokit.authenticate({
        type: 'basic',
        username: process.env.GITHUB_USERNAME,
        password: process.env.GITHUB_PASSWORD
      });

      const owner = '22arw';
      const repo = 'megaphone';

      const issueBody = `${body}\n\nSubmitted by: ${user[0].email}`;
      console.log(`issueBody:`, issueBody);

      const assignee = undefined;
      const milestone = undefined;
      const labels = ['Requires Review', 'Submitted By Form'];

      octokit.issues.create({ owner, repo, title, body: issueBody, assignee, milestone, labels }).then(result => {
        return res.json({
          token: req.token,
          success: true
        });
      });
    } catch (err) {
      console.error(err);
      return res.json({
        token: req.token,
        success: false,
        error: err.message
      });
    }
  }
};
