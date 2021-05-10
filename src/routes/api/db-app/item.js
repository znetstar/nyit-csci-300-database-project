const express = require('express');
const router = express.Router();
const db = require('../../../database/index')
const Item = require('../../../database/models/db-app/item')
const bodyParser = require('body-parser').json({ type: 'application/json' })
const { asyncMiddleware, getMiddleware } = require('../../../common');

// Getting all
router.get('/', getMiddleware(Item), (req, res, next) => res.json(res.model));
router.get('/:id', getMiddleware(Item), (req, res, next) => res.json(res.model));


// Creating one
router.post('/', asyncMiddleware(async (req,res) => {
    let { num, name, desc } = req.body

    const item = await Item.create({
        num, name, desc
    });

    res.status(201)
        .set('Location', `/api/db-app/item/${item.id}`)
        .end();
}));


module.exports = router;