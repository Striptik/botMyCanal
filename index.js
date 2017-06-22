'use strict'

let express = require('express'),
    bodyParser = require('body-parser'),
    messengerRouter = require('./messenger');

let app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.listen((process.env.PORT || 5000))



// Server index page
app.get("/", function (req, res) {
    res.send("Online !");
});

app.use('/messenger', messengerRouter)






