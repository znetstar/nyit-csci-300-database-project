const models = {
  supplier: require('./db-app/supplier'),
  project: require('./db-app/project'),
  item: require('./db-app/item'),
  contract: require('./db-app/contract'),
  to_supply: require('./db-app/to_supply'),
  order: require('./db-app/order'),
  made: require('./db-app/made')
};


(async () => {
  if (process.env.SYNC_DB) {
    for (let k in models) {
      if (k === 'index') continue;
      console.log(k)
      await models[k].sync({ force: true })
    }
  }

})().catch(err => {
  console.error(err.stack);
  process.exit(1);
}).finally(() => {

  models.contract.belongsTo(models.supplier, {  foreignKey: 'supplier_id' });

  models.to_supply.belongsTo(models.contract, { foreignKey: 'contract_id' });
  models.to_supply.belongsTo(models.item, { foreignKey: 'item_id' });

  models.order.belongsTo(models.contract, { foreignKey: 'contract_id' });
  models.order.belongsTo(models.project, { foreignKey: 'project_id' });

  models.made.belongsTo(models.to_supply, { foreignKey: 'to_supply_id' });
  models.made.belongsTo(models.order, { foreignKey: 'order_id' });
})


module.exports = models;
