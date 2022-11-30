const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router()
  .get('/', [authenticate], async (req, res, next) => {
    try {
      const resp = await Secret.getAll();
      res.json(resp);
    } catch (e) {
      next(e);
    }
  })
  
  .post('/', [authenticate], async (req, res, next) => {
    try {
      const secret = await Secret.insert({ 
        title: req.body.title,
        description: req.body.description,
      });
      res.json(secret);
    } catch (e) {
      next(e);
    }
  });
