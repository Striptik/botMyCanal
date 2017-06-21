'use strict'

let express = require("express"),
    request = require("request"),
    bodyParser = require("body-parser"),
    CONF = require('conf');

let app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.listen((process.env.PORT || 5000))



// Server index page
app.get("/", function (req, res) {
    res.send("Deployed!");
});



// FACEBOOK WEBHOOKS
// Used for verification
app.get("/webhook", function (req, res) {
    if (req.query["hub.verify_token"] === process.env.VERIFICATION_TOKEN) {
        console.log("Verified webhook")
        res.status(200).send(req.query["hub.challenge"])
    } else {
        console.error("Verification failed. The tokens do not match.")
        res.sendStatus(403)
    }
})


// Add greeting message
app.get('/addGreeting', function (req, response) {
    let greeting_message = 'Hello !',
        url = "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + process.env.PAGE_ACCESS_TOKEN

    request({
        url: url,
        method: "POST",
        get_started: {
            payload: greeting_message
        }
    }, function (err, response, body) {
        if (err) {
            console.log('Error on adding greeting message - ' + err)
            return response.status(500).json({error : err, message: 'Greeting message Error'})
        }
        //console.log(response, body)
        console.log('OKKKKKKK')
        return response.status(200).json({error: null, message: 'OK'})
    })
})


// All callbacks for Messenger will be POST-ed here
app.post("/webhook", function (req, res) {
    // Make sure this is a page subscription
    if (req.body.object === 'page') {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function(entry) {
            console.log('==========\n')
            console.log('recipient', entry.messaging.recipient)
            console.log('postback', entry.messaging.postback)
            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.postback) {
                    processPostback(event)
                }
            });
        });
        console.log('FINISH SUCCESS !')
        res.sendStatus(200)
    }
});

function processPostback(event) {
    console.log('PROCESS_POSTBACK')
    let senderId = event.sender.id,
        payload = event.postback.payload;

    // GET STARTED ACTION
    console.log(event)
    if (payload === CONF.payload_greeting) {
        console.log('INIT !')
        // Get user's first name from the User Profile API
        // and include it in the greeting
        request({
            url: "https://graph.facebook.com/v2.6/" + senderId,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
                fields: "first_name"
            },
            method: "GET"
        }, function(error, response, body) {
            let greeting = ''
            if (error) {
                console.log("Erreur myCanal chatbot :  " +  error)
            } else {
                let bodyObj = JSON.parse(body)
                let name = bodyObj.first_name
                greeting = "Bonjour " + name + " ! "
            }
            let message = greeting + "Nous sommes Catherine et Vivianne. Pourquoi vous venez nous faire chier ?"
            sendMessage(senderId, {text: message})
        });
    }


}

// sends message to user
function sendMessage(recipientId, message) {
    request({
        url: "https://graph.facebook.com/v2.6/me/messages",
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: "POST",
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log("Error sending message: " + response.error);
        }
        console.log(body)
    });
}