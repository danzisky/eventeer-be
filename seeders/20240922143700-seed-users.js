'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcryptjs');
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const hashedPassword = await bcrypt.hash('password123', 10); // Use a default password

    // Insert sample users
    return await queryInterface.bulkInsert('Users', [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'jane_doe',
        email: 'jane@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'admin_user',
        email: 'admin@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    return await queryInterface.bulkDelete('Users', null, {});
  }
};
