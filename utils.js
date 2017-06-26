let request = require('request'),
    CONF = require('./conf')

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
        console.log('json request : ')
        console.log(json)
        console.log(body)
        if (error || res.body.error) {
            console.log('[SENDMSGREQ] - Error sending message request : ' + res.error)
            console.log(error)
            return callback(error)
        }
        callback(null, body)
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
    console.log('content message : ')
    console.log(json)
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
 * @param i
 */
function sendMessageText(recipientId, message) {
    let json = {
        recipient: {id: recipientId},
        message: {text: message[i]}
    }
    sendMessageRequest(json, function(err, res) {
        if (err) {
            console.log('Message Text not sent');
        }
        console.log('coucou')
    });
}
/**
 * Send Template Button to the user (recipientId)
 * with the text_button message and the buttons options
 * @param recipientId
 * @param text_button
 * @param buttons
 */
function sendTemplateButton(recipientId, text_button, buttons) {
    let json  = {
        recipient: {id: recipientId},
        message: {
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'button',
                    text: text_button,
                    buttons: buttons
                }
            }
        }
    }
    sendMessageRequest(json, function(err, res) {
        if (err) {
            console.log('Template button not sent')
        }
        console.log('Template button sent !' + res.message_id)
    })
}

module.exports = {
    sendMessageText,
    sendMessageContent,
    sendTemplateButton,
    sendMessageRequest
}