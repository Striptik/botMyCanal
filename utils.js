let request = require('request'),
    CONF = require('./conf')

// Handle a message
function processMessage(event) {
    if (!event.message.is_echo) {
        let message = event.message;
        let senderId = event.sender.id;

        console.log("Received message from senderId: " + senderId);
        console.log("Message is: " + JSON.stringify(message));

        // You may get a text or attachment but not both
        if (message.text) {
            let formattedMsg = message.text.toLowerCase().trim();

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

// Handle a Postback  (greeting, build answer)
function processPostback(event) {
    let senderId = event.sender.id,
        payload = event.postback.payload

    if (payload === CONF.payload_greeting) {
        // Get user's first name from the User Profile API
        // and include it in the greeting
        request({
            url: 'https://graph.facebook.com/v2.6/' + senderId,
            qs: {
                access_token: process.env.PAGE_ACCESS_TOKEN,
                fields: 'first_name'
            },
            method: 'GET'
        }, function(error, response, body) {
            let greeting = ''
            if (error) {
                console.log('[PRCPOSTBACK] - Error on processed postback : ' +  error)
            } else {
                let bodyObj = JSON.parse(body)
                let name = bodyObj.first_name
                greeting = '[LILIANE] : Bonjour ' + name + ' ! '
            }
            let message = greeting + 'Nous sommes Catherine et Liliane. En quoi pouvons nous vous être utile ?'
            sendMessage(senderId, {text: message})
        });
    }


}

// Send message to user
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('[SENDMSG] - Error sending message : ' + response.error);
        }
        console.log(body)
    });
}

module.exports = {
    sendMessage,
    processMessage,
    processPostback
}