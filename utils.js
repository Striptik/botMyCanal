let request = require('request'),
    CONF = require('./conf')

/**
 * Handle normal messages with all the informations in the event var
 * the messages could be text or attachements
 * @param event
 */
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
                    sendMessageContent(senderId, 'image', 'https://giphy.com/gifs/2Vtp6YdJRkJVK');
                    break;
                case "whislist":
                    sendMessageText(senderId, {text: "[LILIANE] : " + msg + " la whishlist"});
                    break;
                case "profil":
                    sendMessageText(senderId, {text: "[LILIANE] : " + msg + " les profils"});
                    break;
                case "playlist":
                    sendMessageText(senderId, {text: "[CATHERINE] : " + msg + "les playlists"});
                    break;
                case "alerte programme":
                    sendMessageText(senderId, {text: "[CATHERINE] : " + msg + "les alertes programmes"});
                    break;
                default:
                    sendMessageText(senderId, {text: "[CATHERINE] : Désolé, on s'est posée la question, on ne comprend pas ... une autre formulation peut être ?"});
                    break;
            }
        } else if (message.attachments) {
            sendMessageText(senderId, {text: "Désolé, on s'est posé la question, on ne comprend pas ..."});
        }
    }
}
/**
 * Handle postback message with all the informations in the event var
 * the postback message could be the greeting, template message return,
 * buttons message return ... akk templated answers
 * @param event
 */
function processPostback(event) {
    let senderId = event.sender.id,
        payload = event.postback.payload

    // function to create postback

    // TODO: Make a switch witrh payload

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
            sendMessageText(senderId, {text: message})
        });
    }

    // Other cases

}

/**
 *  SENDER
 */


/**
 * The message request maker. It receive the json and send to the
 * facebook API.
 * @param json
 * @param callback
 */
function sendMessageRequest(json, callback) {
    request({
        url: CONF.messages_url,
        qs: {access_token: CONF.page_token},
        method: 'POST',
        json: json
    }, function (error, res, body) {
        if (error) {
            console.log('[SENDMSGREQ] - Error sending message request : ' + res.error)
            console.log(error)
            return callback(error)
        }
        return callback(null, body)
    });
}
/**
 * Send Content Message to the user with the recipientId
 * The type could be image/video, the url is the image/video hosting url
 * @param recipientId
 * @param type
 * @param url
 */
function sendMessageContent(recipientId, type, url) {
    let json  = {
        recipient: {id: recipientId},
        message: {
            attachment: {
                type: type,
                payload: {
                    url: url
                }
            }
        }
    }
    sendMessageRequest(json, function(err, res) {
        if (err) {
            console.log('Message Content not sent')
        }
        console.log('Message Content sent !' + res.message_id)
    })
}
/**
 * Send Text Message to the user with the recipientId
 * The message sent is the variable message
 * @param recipientId
 * @param message
 */
function sendMessageText(recipientId, message) {
    let json = {
        recipient: {id: recipientId},
        message: message
    }
    sendMessageRequest(json, function(err, res) {
        if (err) {
            console.log('Message Text not sent');
        }
        console.log('Message Text sent ! ' + res.message_id)
    });
}



module.exports = {
    sendMessageText,
    sendMessageContent,
    sendMessageRequest,
    processMessage,
    processPostback
}