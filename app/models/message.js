const message = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    message: {
      type: DataTypes.STRING
    }
  });
  return Message;
};

module.exports = message;
