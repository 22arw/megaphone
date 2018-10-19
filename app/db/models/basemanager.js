'use strict';
module.exports = (sequelize, DataTypes) => {
  const BaseManager = sequelize.define(
    'BaseManager',
    {
      baseId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER
    },
    {}
  );
  BaseManager.associate = function(models) {
    // associations can be defined here
  };
  return BaseManager;
};

/**
 * Reference for composite key enforcement: https://gist.github.com/lucasscariot/5b8747fbc8a6948a805c646fae4ceef8
 */
