const dbInterface = require('./dbInterfaces');
const utils = require('../utils');
const _ = require('lodash');

module.exports = {
  send: async (req, res) => {
    process.stdout.write('Attempting to send a message... ');
    const userId = req.userId;
    const orgId = _.toNumber(req.body.orgId);
    const message = _.toString(req.body.message).trim();

    try {
      if (isNaN(orgId) || _.isEmpty(message)) {
        throw new Error('Invalid data in request.');
      }

      const doesOrgExist = await dbInterface.doesOrgExist(orgId);
      if (!doesOrgExist) return new Error('You cannot send from this org.');

      const org = await dbInterface.getOrgById(orgId);

      const subscribers = await dbInterface.getSubscribers(orgId);
      if (_.isEmpty(subscribers)) {
        return new Error('There are no subscribers for this organization');
      }

      const base = await dbInterface.getBaseById(org.baseId);

      const status = utils.sendMessage(userId, subscribers, org, message, base);
      if (status instanceof Error) throw status;
      console.log('Success!');
      res.json({
        token: req.token,
        success: true
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  },
  allMessagesEver: async (req, res) => {
    // admin only
    process.stdout.write('Attempting to get all messages ever!... ');
    try {
      const { Message } = require('../db/models');

      const messages = await Message.findAll();

      if (_.isEmpty(messages)) {
        console.log('No messages found.');
        return res.json({
          token: req.token,
          success: true,
          messages: []
        });
      }

      const filteredMessages = messages.map(msg => {
        return {
          userId: msg.userId,
          orgId: msg.userId,
          message: msg.message,
          sent: msg.createdAt
        };
      });

      console.log('Success!');
      res.json({
        token: req.token,
        success: true,
        messages: filteredMessages
      });
    } catch (error) {
      console.error(error);
      res.json({
        token: req.token,
        success: false,
        error: error.message
      });
    }
  }
};
