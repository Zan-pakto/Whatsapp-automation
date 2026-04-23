const Contact = require('../models/Contact');

exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ businessId: req.user.businessId._id });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createContact = async (req, res) => {
  const { name, waId, tags, email, address, notes } = req.body;
  try {
    const contact = await Contact.create({
      businessId: req.user.businessId._id,
      name,
      waId,
      tags,
      email,
      address,
      notes
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.bulkCreateContacts = async (req, res) => {
  const { contacts } = req.body;
  try {
    const contactsToInsert = contacts.map(c => ({
      ...c,
      businessId: req.user.businessId._id
    }));
    const result = await Contact.insertMany(contactsToInsert, { ordered: false });
    res.status(201).json(result);
  } catch (error) {
    if (error.writeErrors) {
      return res.status(201).json({ message: 'Partial success', inserted: error.insertedDocs });
    }
    res.status(500).json({ message: error.message });
  }
};
