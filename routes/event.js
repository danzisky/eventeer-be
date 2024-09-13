const express = require('express');
const passport = require('passport');
const { Event, User } = require('../models');

const router = express.Router();

// Create an Event
router.post('/create', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    const event = await Event.create({
      title,
      description,
      date,
      location,
      creatorId: req.user.id,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: 'Error creating event', error });
  }
});

// Add participant to Event
router.post('/:eventId/participate', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await event.addParticipant(req.user);  // Add the authenticated user as a participant
    res.status(200).json({ message: 'Successfully joined the event' });
  } catch (error) {
    res.status(400).json({ message: 'Error joining event', error });
  }
});

// Get all Events
router.get('/', async (req, res) => {
  try {
    const events = await Event.findAll({ include: [{ model: User, as: 'creator' }] });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
});

module.exports = router;
