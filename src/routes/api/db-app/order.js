const express = require('express');
const router = express.Router();
const db = require('../../../database/index')
const Order = require('../../../database/models/db-app/order')
const Project = require('../../../database/models/db-app/project')
const Contract = require('../../../database/models/db-app/contract')
const ToSupply = require('../../../database/models/db-app/to_supply')
const Made = require('../../../database/models/db-app/made')
const bodyParser = require('body-parser').json({ type: 'application/json' })
const { asyncMiddleware } = require('../../../common');

// Getting all
router.get('/', asyncMiddleware(async (req, res) => {
    let orders;
    if (req.query.contract) {
        orders = await Order.findAll({
            where: {
                contract_id: req.query.contract
            },
            include: [Project, Contract]
        });
    } else {
        let toSupplies = await ToSupply.findAll({
            where: {
                item_id: req.query.item
            },
            include: []
        });

        for (let toSupply of toSupplies) {
            let mades = await Made.findAll({
                where: {
                    to_supply_id: toSupply.id
                },
            });

            for (let made of mades) {
                orders = (orders || []).concat(await Order.findAll({
                    limit: 1,
                    where: {
                        id: made.order_id
                    },
                    include: [Project, Contract]
                }));
            }
        }
    }

    orders = orders.filter(d => d.project).map((d) => {
        d = d.toJSON()
        d.project_name = d.project.name;
        d.contract_name = d.contract.name;
        return d;
    });

    res.status(200).json(orders)
}));

// Get Order by its Order#
router.get('/:id',  asyncMiddleware(async (req, res) => {
    let orders = await Order.findAll({
        where: {
            id: req.params.id
        },
        include: [ Project, Contract ],
        limit: 1
    });

    let order = (orders.filter(d => d.project).map((d) => {
        d = d.toJSON()
        d.project_name = d.project.name;
        d.contract_name = d.contract.name;
        return d;
    }))[0];
    if (!order)
        throw [404];

    res.json(order);
}));

// Creating one 
router.post('/', asyncMiddleware(async (req,res) => {
    let { num, project_id, date_reqd, date_comp, contract_id,  } = req.body

    const order = await Order.create({
        project_id, num, date_reqd, date_comp, contract_id
    })

    res.status(201)
        .set('Location', `/api/db-app/order/${order.id}`)
        .end();
}));

// Updating one
router.put('/:id', asyncMiddleware(async(req, res) => {
    let order = (await Order.findByPk(req.params.id));

    if (!order) {
        res.status(404).end();
    } else {
        let { project_id, date, num, contract_id } = req.body;

        require('lodash').extend(order, { project_id, date: new Date(order.date), num });

        await order.save();
        res.status(204).end();
    }

}));

// Delete one
router.delete('/:num', asyncMiddleware(async(req, res) => {
    let c = await Order.findByPk(req.params.id);
    if (!c) throw [ 404 ];
    await c.destroy();
    res.status(204);
}));

// Middleware for getting one
async function getOrder(req, res, next) {

    let order

    try{
        order = await Order.findAll({
            where: {
                num: req.params.num
            }
        })
        if (order == null){
            return res.status(404).json({ message: 'Order not found'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.order = order
    next()
}
module.exports = router;