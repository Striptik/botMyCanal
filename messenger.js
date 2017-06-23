'use strict';

let express = require('express'),
    router = express.Router(),
    request = require('request'),
    conversation = require('./conversation')


// FACEBOOK WEBHOOKS ROUTER

/**
 * Route used for verifications of the connection with fb
 * (messenger api need)
 */
router.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.VERIFICATION_TOKEN) {
        console.log('Webhook OK !')
        res.status(200).send(req.query['hub.challenge'])
    } else {
        console.error('[WEBHOOK] - Verification failed. The tokens do not match.')
        res.sendStatus(403)
    }
})
/**
 * Post a greeting message to the conversations start
 */
router.get('/addGreeting', function (req, response) {
    let greeting_message = 'Hello !',
        url = "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=" + process.env.PAGE_ACCESS_TOKEN

    request({
        url: url,
        method: "POST",
        get_started: {
            payload: greeting_message
        }
    }, function (err, res, body) {
        if (err) {
            console.log('[ADDGRT] - Error on adding greeting message - ' + err)
            return response.status(500).json({error : err, message: 'Greeting message Error'})
        }
        return response.status(200).json({error: null, message: 'OK'})
    })
})
/**
 * Route to post all callbacks for Messenger
 */
router.post("/webhook", function (req, res) {
    // Page subscription
    if (req.body.object === "page") {
        // Iterate over each entry
        // There may be multiple entries if batched
        req.body.entry.forEach(function(entry) {
            // Iterate over each messaging event
            entry.messaging.forEach(function(event) {
                if (event.postback) {
                    conversation.processPostback(event);
                } else if (event.message) {
                    conversation.processMessage(event);
                }
            });
        });
        res.sendStatus(200);
    }
});

module.exports = router

