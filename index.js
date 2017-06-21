'use strict'

let express = require("express"),
    request = require("request"),
    bodyParser = require("body-parser"),
    CONF = require('./conf');

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
    if (req.body.object === "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function(entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.postback) {
                    processPostback(event);
                } else if (event.message) {
                    processMessage(event);
                }
            });
        });

        res.sendStatus(200);
    }
});

function processMessage(event) {
    if (!event.message.is_echo) {
        let message = event.message;
        let senderId = event.sender.id;

        console.log("Received message from senderId: " + senderId);
        console.log("Message is: " + JSON.stringify(message));

        // You may get a text or attachment but not both
        if (message.text) {
            var formattedMsg = message.text.toLowerCase().trim();

            // If we receive a text message, check to see if it matches any special
            // keywords and send back the corresponding movie detail.
            // Otherwise, search for new movie.
            let msg = 'Je peux vous inviter à regarder la vidéo sur '
            switch (formattedMsg) {
                case "download":

                case "reco":
                    sendMessage(senderId, {text: "[LILIANE] : " + msg + "les recommandations personnalisées"});
                    break;
                case "whislist":
                    sendMessage(senderId, {text: "[LILIANE] : " + msg + " la whishlist"});
                    break;
                case "profil":
                    sendMessage(senderId, {text: "[LILIANE] : " + msg + " les profils"});
                    break;
                case "playlist":
                    sendMessage(senderId, {text: "[CATHERINE] : " + msg + "les playlists"});
                    break;
                case "alerte programme":
                    sendMessage(senderId, {text: "[CATHERINE] : " + msg + "les alertes programmes"});
                    break;
                default:
                    sendMessage(senderId, {text: "[CATHERINE] : Désolé, on s'est posée la question, on ne comprend pas ... une autre formulation peut être ?"});
                    break;
            }
        } else if (message.attachments) {
            sendMessage(senderId, {text: "Désolé, on s'est posé la question, on ne comprend pas ..."});
        }
    }
}

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
            let message = greeting + '[LILIANE] : Nous sommes Catherine et Liliane. En quoi pouvons nous vous être utile ?'
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