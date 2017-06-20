'use strict'
//
// const express = require('express')
// const bodyParser = require('body-parser')
// const request = require('request')
// const app = express()
//
// app.set('port', (process.env.PORT || 5000))
//
// // Process application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))
//
// // Process application/json
// app.use(bodyParser.json())
//
// // Index route
// app.get('/', function (req, res) {
//     res.send('Hello world, I am a chat bot')
// })
//
// // for Facebook verification
// app.get('/webhook/', function (req, res) {
//     if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me_please_little_chatbot') {
//         res.send(req.query['hub.challenge'])
//     }
//     res.send('Error, wrong token')
// })
//
// // Spin up the server
// app.listen(app.get('port'), function() {
//     console.log('running on port', app.get('port'))
// })

var express = require("express");
var request = require("request");
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 5000));

// Server index page
app.get("/", function (req, res) {
    res.send("Deployed!");
});

// Facebook Webhook
// Used for verification
app.get("/webhook", function (req, res) {
    if (req.query["hub.verify_token"] === "this_is_my_mycanal-chatbot-token") {
        console.log("Verified webhook");
        res.status(200).send(req.query["hub.challenge"]);
    } else {
        console.error("Verification failed. The tokens do not match.");
        res.sendStatus(403);
    }
});