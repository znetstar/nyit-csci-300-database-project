const express = require('express');
const router = express.Router();
const db = require('../../../database/index')
const Agree = require('../../../database/models/db-app/to_supply')
const Item = require('../../../database/models/db-app/item')
const Contract = require('../../../database/models/db-app/contract')
const bodyParser = require('body-parser').json({ type: 'application/json' })
const { asyncMiddleware, getExistingQuan } = require('../../../common');

// Getting all
router.get('/', asyncMiddleware(async (req, res) => {
    let contractItems = await Agree.findAll({
        where: {
            contract_id: req.query.contract || void(0)
        },
        include: [ Item, Contract ]
    });

    contractItems = await Promise.all(contractItems.filter(d => d.item).map(async (d) => {
        d = d.toJSON()
        d.item_name = d.item.name;

        d.contract_amt_remaining = (d.contract_amt || 0) - (await getExistingQuan(d.id));

        return d;
    }));

    res.status(200).json(contractItems)
}));

// Getting one
router.get('/:id', asyncMiddleware(async (req, res) => {
    let d = await Agree.findByPk(req.params.id);

    if (!d) {
        res.status(404).end();
        return;
    }

    d = d.toJSON();
    d.item_name = d.item.name;
    d.contract_amt_remaining = (d.contract_amt || 0) - (await getExistingQuan(d.id));


    res.status(200).json(d)
}));

// Creating one 
router.post('/', asyncMiddleware(async (req,res) => {
    let { contract_id, item_id, contract_amt, contract_price } = req.body

    const agree = await Agree.create({
        contract_id, item_id, contract_amt, contract_price
    }) 
    
    res.status(201)
        .set('Location', `/#/api/db-app/to_supply/${agree.id}`)
        .end();
}));

// Updating one
// In PUT you must replace the entire document
router.put('/:id', asyncMiddleware(async(req, res) => {
    let d = await Agree.findByPk(req.params.id);

    if (!d) {
        res.status(404).end();
        return;
    }

    let allowedFields = [ 'item_id', 'contract_id', 'contract_amt', 'contract_price' ];
    for (let k in req.body) {
        if (allowedFields.includes(k)) {
            d[k] = req.body[k];
        }
    }

    await d.save();

    res.status(204).end();
}));

// Delete one
router.delete('/:id', asyncMiddleware(async (req, res) => {
    let agree = await Agree.findByPk(req.params.id);
    if (!agree) {
        res.status(404).end();
    } else {
        await agree.destroy();

        res.status(204).end();
    }
}));

// Middleware for getting one
async function getAgree(req, res, next) {
    
    let agree

    try{
        agree = await Agree.findAll({
            where: {
                contract_num: req.params.contract_num
            }
        })
        if (agree == null){
            return res.status(404).json({ message: 'Agreement not found'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.agree = agree
    next()
}
module.exports = router;