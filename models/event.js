const sequelizePaginate = require('sequelize-paginate');

module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    participants: {
      type: DataTypes.JSONB,
      defaultValue: [],
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Event.associate = (models) => {
    // Event belongs to a User (creator)
    Event.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });
  };

  sequelizePaginate.paginate(Event);

  return Event;
};
