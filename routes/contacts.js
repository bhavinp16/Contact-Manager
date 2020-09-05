const express = require('express');

const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Contact = require('../models/Contact');

// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
	try {
		const contacts = await Contact.find({ user: req.user.id }).sort({
			date: -1,
		});
		res.json(contacts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   POST api/contacts
// @desc    Add new contacts
// @access  Private
router.post(
	'/',
	[auth, [check('name', 'Name is required').notEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, phone, type } = req.body;

		//we do mongoose work in try catch
		try {
			const newContact = new Contact({
				name,
				email,
				phone,
				type,
				user: req.user.id,
			});

			const contact = await newContact.save();

			res.json(contact);
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server Error');
		}
	}
);

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', auth, async (req, res) => {
	const { name, email, phone, type } = req.body;

	const contactFields = {};
	if (name) contactFields.name = name;
	if (email) contactFields.email = email;
	if (phone) contactFields.phone = phone;
	if (type) contactFields.type = type;

	try {
		let contacts = await Contact.findById(req.params.id);

		if (!contacts) return res.status(404).json({ msg: 'Contacts not found' });

		//Make sure user owns contacts
		if (contacts.user.toString() !== req.user.id) {
			return res.status(401).json({ msg: 'Not authorized' });
		}

		contacts = await Contact.findByIdAndUpdate(
			req.params.id,
			{ $set: contactFields },
			{ new: true }
		);
		res.json(contacts);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server Error');
	}
});

// @route   DELETE api/users
// @desc    Delete contact
// @access  Private
router.delete('/:id', (req, res) => {
	res.send('Delete contact');
});

module.exports = router;
