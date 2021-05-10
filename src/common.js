const bodyParser = require('body-parser');
const {
  Op
} = require('sequelize');

async function getExistingQuan(supplyId) {
  let existingQuan = await require('./database/models/db-app/made').findAll({
    group : [ 'order_quan', 'id' ],
    where: {
      to_supply_id: supplyId
    }
  });

  let quan = 0;
  for (let q of existingQuan)
    quan += q.order_quan;

  return quan;
}

// Middleware for deleting
function getMiddleware(Model, idField = 'id', attrs) {
  return asyncMiddleware(async function getProject(req, res, next) {
    let model;
    let id = Number(req.params[0] || req.params[idField]);
    if (Number.isNaN(id))
      id = void(0);
    let isSingle = Boolean(typeof(id) === 'number');

    let query = {};

    let limit;
    if (isSingle) {
      query[idField] = id;
      limit = 1;
    } else {
      // Search bby other fields
      if (req.query.query) {
        query.name = { [Op.like]: '%'+req.query.query+'%' };
      }

    }

    try{
      model = await Model.findAll({
        where: query,
        limit,
        attributes: attrs ? attrs : void(0)
      })
      if (model === null || ( isSingle && !model.length )){

        res.status(404).json({ message: `Model not found`});
        return;
      }
    } catch (err) {
      res.status(500).json({ message: err.message});
      return;
    }


    res.model = isSingle ? (model || [])[0] : model;
    return true;
  });
}

function postMiddleware(routeName) {
    return (req, res, next) => {
      res.status(201)
          .set('Location', `/api/${routeName}/${res.model.num}`)
          .end();

      return;
    }
}


function asyncMiddleware(fn) {
  return (req, res, next) => {
    fn(req, res).then((result) => {
      if (typeof(result) !== 'undefined' && result !== false) {
        if (result === true || typeof(result) === 'undefined') result = void(0)
        next && next(result);
        return;
      }
    }).catch((err) => {
      next && next(err);
    })
  }
}

function extraQueryParamsMiddleware(parser = (a) => a) {
  return (req, res, next) => {
    bodyParser.json()(req, res, () => {
       let searchQuery = {
         ...req.query,
         ...(req.params || {}),
         ...(req.body || {})
       }

       searchQuery.skip = Number(searchQuery.skip || 0);
       searchQuery.limit = typeof(searchQuery.limit) !== 'undefined' ? Number(searchQuery.limit) : void(0);

       req.searchQuery = searchQuery = parser(searchQuery, req, res);
       next();
    });
  };
}

let errMessageMap = new Map([
  [ 404, 'Not Found' ]
]);

function formatSpecialTypes(x) {
  if (Array.isArray(x))
    return x.map(y => formatSpecialTypes(y));

  if (x.toJSON) { return x.toJSON(); }
  if (x.toObject) { return x.toObject(); }
  return x;
}

function errorHandlerMiddleware(err, req, res, next) {
  let error = { httpCode: 500, message:  'An unknown error occurred' };
  if (Array.isArray(err)) {
    if (err[0])
      error.httpCode = err[0];
    if (err[1])
      error.message = err[1];
  } else if (err) {
    error.message = err.message;
  }

  if ((!err.message || !err[1]) && errMessageMap.has(error.httpCode))
    error.message = errMessageMap.get(error.httpCode);

  if (err.name === 'SequelizeUniqueConstraintError') {
    error.httpCode = 409;
    error.message = `A record with this number is already in the database`;
  }

  console.error(`HTTP Error ${error.httpCode}: ${err.stack}`);
  if (!res.headersSent)
    res.status(error.httpCode);
  res.send({ message: error.message, httpCode: error.httpCode });
}


module.exports = { getExistingQuan, postMiddleware, asyncMiddleware, extraQueryParamsMiddleware, errorHandlerMiddleware, formatSpecialTypes, getMiddleware };
