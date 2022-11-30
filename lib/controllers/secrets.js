const { Router } = require('express');
const Secret = require('../models/Secret');

module.exports = Router()
  .get('/', async (req, res, next) => {
    try {
      const resp = await Secret.getAll();
      res.json(resp);
    } catch (e) {
      next(e);
    }
  });
