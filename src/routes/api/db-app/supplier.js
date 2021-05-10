const express = require('express');
const router = express.Router();
const db = require('../../../database/index')
const Supplier = require('../../../database/models/db-app/supplier')
const bodyParser = require('body-parser').json({ type: 'application/json' })
const { asyncMiddleware, getMiddleware, postMiddleware } = require('../../../common');

const getSupplier = getMiddleware(Supplier);

// Getting all
router.get('/', getSupplier, (req, res, next) => res.json(res.model));

// Getting one
router.get('/:id', getSupplier, asyncMiddleware(async (req, res) => {
    res.json(res.model.toJSON())
}));

// Creating one 
router.post('/', asyncMiddleware(async (req,res) => {
    let { num, name, supplier_add } = req.body

    const supplier = await Supplier.create({
        num, name, supplier_add
    }) 
    
    res.status(201)
        .set('Location', `/api/db-app/supplier/${supplier.id}`)
        .end('');
}));


module.exports = router;