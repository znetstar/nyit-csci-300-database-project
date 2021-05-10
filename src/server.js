const app = require('./index').app;
let port = Number(process.env.PORT);

app.get(/(order|contract|invoice|\/$)/, (req, res) => {
    res.redirect(`/#${req.originalUrl}`);
});

app.listen(port, (err) => {
   if (err) {
        console.error(`Error listening to ${port}: ${err.stack}`);
   } else {
        console.log(`Listening to ${port}`);
   }
});


