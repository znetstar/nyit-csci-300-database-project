let models = {};
for (let file of require('fs').readdirSync(__dirname)) {
    let model = require('./'+file);
    models = {
        ...models,
        [file.replace('.js', '')]: model
    };
}


module.exports = models;