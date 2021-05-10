const express = require('express');
const router = express.Router();
const db = require('../../../database/index')
const Project = require('../../../database/models/db-app/project')
const bodyParser = require('body-parser').json({ type: 'application/json' })
const { asyncMiddleware, getMiddleware, postMiddleware } = require('../../../common');

const getProject = getMiddleware(Project);

// Getting all
router.get('/', getProject, (req, res, next) => res.json(res.model));

// Getting one
router.get('/:id', getProject, asyncMiddleware(async (req, res) => {
    res.json(res.model.toJSON())
}));

// Creating one 
router.post('/', asyncMiddleware(async (req,res) => {
    let { num, name, data } = req.body

    const project = await Project.create({
        num, name, data
    })

    res.status(201)
        .set('Location', `/api/db-app/project/${project.id}`)
        .end('');
}));


module.exports = router;