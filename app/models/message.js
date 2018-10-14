const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    message: {
      type: DataTypes.STRING
    }
  });

  Message.associate = models => {
    // m:1 User
    Message.belongsTo(models.User);
    // m:1 Organization
    Message.belongsTo(models.Organization);
  };

  return Message;
};

module.exports = message;
