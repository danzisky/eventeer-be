const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  User.associate = (models) => {
    // User can create many events
    User.hasMany(models.Event, { as: 'createdEvents', foreignKey: 'creatorId' });

    // Many-to-Many relationship: User can participate in many events
    User.belongsToMany(models.Event, { through: 'EventParticipants', as: 'attendedEvents', foreignKey: 'userId' });
  };

  // Hash password before saving to DB
  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  // Compare passwords
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  return User;
};
