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
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  Event.associate = (models) => {
    // Event belongs to a User (creator)
    Event.belongsTo(models.User, { as: 'creator', foreignKey: 'creatorId' });

    // Many-to-Many relationship: Event has many participants (Users)
    Event.belongsToMany(models.User, { through: 'EventParticipants', as: 'participants', foreignKey: 'eventId' });
  };

  return Event;
};
