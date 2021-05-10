const express = require('express');
const router = express.Router();
const db = require('../../../database/index')
const Made = require('../../../database/models/db-app/made')
const Item = require('../../../database/models/db-app/item')
const Agree = require('../../../database/models/db-app/to_supply')
const Order = require('../../../database/models/db-app/order')
const bodyParser = require('body-parser').json({ type: 'application/json' })
const { asyncMiddleware, getExistingQuan } = require('../../../common');
const sequelize = require('sequelize');


// Getting all
router.get('/', asyncMiddleware(async (req, res) => {
    let where = {
        order_id: req.query.order || void(0),
        to_supply_id: req.query.to_supply || void(0)
    };
    for (let k in where) {
        if (typeof(where[k]) === 'undefined') {
            delete where[k];
        }
    }
    let orderItems = await Made.findAll({
        where,
        include: [
            Agree, Order
        ],
        order: [
            [Agree, 'id'],
            [Agree, 'item_id'],
        ]
    });

    let itemCache = new Map();
    orderItems = await Promise.all(orderItems.filter(d => d.to_supply).map(async (d) => {
        let item = itemCache.get(d.to_supply.item_id) || (await Item.findByPk(d.to_supply.item_id)).toJSON();


        itemCache.set(d.to_supply.item_id, item);

        d = d.toJSON();
        d.to_supply.item = item;

        d.to_supply_price = d.to_supply.contract_price;
        d.to_supply_name = d.to_supply.item.name;
        d.item_id = d.to_supply.item.id;

        return d;
    }));

    res.status(200).json(orderItems)
}));

// Getting one
router.get('/:id', asyncMiddleware(async (req, res) => {
    let d = await Made.findByPk(req.params.id);

    if (!d) {
        res.status(404).end();
        return;
    }

    d = d.toJSON();
    d.item_name = d.item.name;

    res.status(200).json(d)
}));

// Creating one 
router.post('/', asyncMiddleware(async (req,res) => {
    let { order_id, to_supply_id, order_quan } = req.body

    let existing_quan = await getExistingQuan(to_supply_id);
    let max_quan = (await Agree.findByPk(to_supply_id)).contract_amt;

    if ((existing_quan + Number(order_quan)) > max_quan) {
        throw [ 400, `Quantity ${order_quan} exceeds maximum of ${max_quan}` ];
    }

    const made = await Made.create({
        order_id, to_supply_id, order_quan
    })

    res.status(201)
        .set('Location', `/#/api/db-app/made/${made.id}`)
        .end();
}));

// Updating one
// In PUT you must replace the entire document
router.put('/:id', asyncMiddleware(async(req, res) => {
    let d = await Made.findByPk(req.params.id);

    if (!d) {
        res.status(404).end();
        return;
    }

    let { to_supply_id, order_quan } = d;

    let existing_quan = (await getExistingQuan(req.body.to_supply_id || to_supply_id)) - order_quan;
    let max_quan = (await Agree.findByPk(req.body.to_supply_id || to_supply_id)).contract_amt;

    if ((existing_quan + Number(req.body.order_quan)) > max_quan) {
        throw [ 400, `Quantity ${req.body.order_quan} exceeds maximum of ${max_quan}` ];
    }

    let allowedFields = [ 'order_id', 'to_supply_id', 'order_quan' ];
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
    let made = await Made.findByPk(req.params.id);
    if (!made) {
        res.status(404).end();
    } else {
        await made.destroy();
        res.status(204).end();
    }
}));

// Middleware for getting one
async function getMade(req, res, next) {

    let made

    try{
        made = await Made.findAll({
            where: {
                order_num: req.params.order_num
            }
        })
        if (made == null){
            return res.status(404).json({ message: 'Madement not found'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.Made = Made
    next()
}
module.exports = router;