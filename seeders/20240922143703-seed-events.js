'use strict';

/** @type {import('sequelize-cli').Migration} */
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

    // Fetch users to assign events to them
    const users = await queryInterface.sequelize.query(
      `SELECT id from "Users";`
    );

    const userRows = users[0];

    // Insert sample events
    return queryInterface.bulkInsert('Events', [
      {
        title: 'Community Meetup X',
        description: 'A casual meetup for the community members.',
        date: new Date(),
        location: 'New York City',
        participants: JSON.stringify(['John Doe', 'Jane Doe' ]),
        creatorId: userRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Community Meetup',
        description: 'A casual meetup for the community members.',
        date: new Date(),
        location: 'New York City',
        participants: JSON.stringify(['John Doe', 'Jane Doe' ]),
        creatorId: userRows[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Tech Conference X',
        description: 'A big conference for developers and tech enthusiasts.',
        date: new Date(),
        location: 'San Francisco',
        participants: JSON.stringify(['Mark', 'Sara']),
        creatorId: userRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Tech Conference',
        description: 'A big conference for developers and tech enthusiasts.',
        date: new Date(),
        location: 'San Francisco',
        participants: JSON.stringify(['Mark', 'Sara']),
        creatorId: userRows[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Startup Pitch X',
        description: 'An event where startups pitch their ideas to investors.',
        date: new Date(),
        location: 'Los Angeles',
        participants: JSON.stringify(['Alice', 'Bob']),
        creatorId: userRows[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Startup Pitch',
        description: 'An event where startups pitch their ideas to investors.',
        date: new Date(),
        location: 'Los Angeles',
        participants: JSON.stringify(['Alice', 'Bob']),
        creatorId: userRows[2].id,
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
    return queryInterface.bulkDelete('Events', null, {});
  }
};
