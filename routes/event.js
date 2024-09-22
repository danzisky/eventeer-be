const express = require('express');
const passport = require('passport');
const { Event, User } = require('../models');
const Sequelize = require('sequelize');
const paginate = require('../utils/paginate');

const router = express.Router();

/* @TODO: put logic into controllers and services */

router.get('/', async (req, res) => {
  try {
    const { city, startDate, endDate, searchText, page = 1, pageSize = 3, user = null } = req.query;

    // Build the query conditions
    const whereConditions = {};

    if (city) {
      whereConditions.location = city;
    }

    if (startDate || endDate) {
      whereConditions.date = {};
      if (startDate) {
        whereConditions.date[Sequelize.Op.gte] = new Date(startDate);
      }
      if (endDate) {
        whereConditions.date[Sequelize.Op.lte] = new Date(endDate);
      }
    }

    if (user) {
      whereConditions.creatorId = user;
    }

    if (searchText) {
      whereConditions.title = {
        [Sequelize.Op.iLike]: `%${searchText}%`
      };
    }

    // events based on the conditions
    const events = await paginate(Event, page, pageSize, {
      where: whereConditions,
      include: [{ model: User, as: 'creator' }],
    });

    res.json(events);
  } catch (error) {
    // console.error("Error fetching events:", error);
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

// Create an Event
router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    console.log(req.body);

    const { title, description, date, location, participants } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      participants,
      creatorId: req.user.id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error });
  }
});

// Fetch a single event by ID
router.get('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [{ model: User, as: 'creator' }],
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    // console.error("Error fetching event:", error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an Event
router.put('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is the creator of the event
    if (event.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const { title, description, date, location, participants } = req.body;
    await event.update({
      title,
      description,
      date,
      location,
      participants,
    });

    res.json(event);
  } catch (error) {
    // console.error("Error updating event:", error);
    res.status(400).json({ message: 'Error updating event', error });
  }
});

// Delete an Event
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is the creator of the event
    if (event.creatorId !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    // console.error("Error deleting event:", error);
    res.status(400).json({ message: 'Error deleting event', error });
  }
});

module.exports = router;
