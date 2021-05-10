const express = require('express');
const router = express.Router();
const db = require('../../../database/index')
const Contract = require('../../../database/models/db-app/contract')
const Supplier = require('../../../database/models/db-app/supplier')
const bodyParser = require('body-parser').json({ type: 'application/json' })
const { asyncMiddleware } = require('../../../common');

// Getting all
router.get('/', asyncMiddleware(async (req, res) => {
    let contracts = await Contract.findAll({
        where: {},
        include: [ Supplier ]
    });

    contracts = contracts.filter(d => d.supplier).map((d) => {
        d = d.toJSON()
        d.supplier_name = d.supplier.name;
        return d;
    });

    res.status(200).json(contracts)    
}));

// Get Contract by its Contract#
router.get('/:id',  asyncMiddleware(async (req, res) => {
    let contracts = await Contract.findAll({
        where: {
            id: req.params.id
        },
        include: [ Supplier ],
        limit: 1
    });

    let contract = (contracts.filter(d => d.supplier).map((d) => {
        d = d.toJSON()
        d.supplier_name = d.supplier.name;
        return d;
    }))[0];

    if (!contract) throw [ 404 ];

    res.json(contract);
}));

// Creating one 
router.post('/', asyncMiddleware(async (req,res) => {
    let { num, supplier_id, date } = req.body

    const contract = await Contract.create({
        supplier_id, num, date
    }) 
    
    res.status(201)
        .set('Location', `/api/db-app/contract/${contract.id}`)
        .end();
}));

// Updating one
router.put('/:id', asyncMiddleware(async(req, res) => {
    let contract = (await Contract.findByPk(req.params.id));

    if (!contract) {
        res.status(404).end();
    } else {
        let { supplier_id, date, num } = req.body;

        require('lodash').extend(contract, { supplier_id, date: new Date(contract.date), num });

        await contract.save();
        res.status(204).end();
    }

}));

// Delete one
router.delete('/:id', asyncMiddleware(async(req, res) => {
    let c = await Contract.findByPk(req.params.id);
    if (!c) throw [ 404 ];
    await c.destroy();
    res.status(204);
}));

// Middleware for getting one
async function getContract(req, res, next) {
    
    let contract

    try{
        contract = await Contract.findAll({
            where: {
                num: req.params.num
            }
        })
        if (contract == null){
            return res.status(404).json({ message: 'Contract not found'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.contract = contract
    next()
}
module.exports = router;