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
        message: {text: message}
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

function sendMessageUrl(user, template) {
    let buttons = [
        {
            type: 'web_url',
            url: template.url,
            title: template.title,
            webview_height_ratio: "compact"
        }
    ]
    let json = {
            recipient: {id: user},
            message: {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'button',
                        text: template.message,
                        buttons: buttons
                    }
                }
            }
        }
    sendMessageRequest(json, function(err, res) {
        if (err) {
            console.log('Template url message not sent')
        }
        console.log('Template Message sent !' + res.message_id)
    })
}

function sendListTuto(user) {
    let json = {
        recipient: {id: user},
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "list",
                    top_element_style: "compact",
                    elements: [
                        {
                            title: "Revoir 8h avant le direct",
                            subtitle: "Cette fonctionnalité permet de revoir 8h avant le direct",
                            buttons: [
                                {
                                    title: "Voir",
                                    type: "postback",
                                    payload: "TUTO_YES_REVOIR"
                                }
                            ]
                        },
                        {
                            title: "Configurer son profil",
                            subtitle: "Tout savoir sur comment configurer son profil",
                            buttons: [
                                {
                                    title: "Voir",
                                    type: "postback",
                                    payload: "TUTO_YES_PROFIL"
                                }
                            ]
                        },
                        {
                            title: "Les recommendations",
                            subtitle: "Apprendre le fonctionnement des des recommendations",
                            buttons: [
                                {
                                    "title": "Voir",
                                    "type": "postback",
                                    "payload": "TUTO_YES_RECO"
                                }
                            ]
                        },
                        {
                            title: "Visionnage hors-ligne",
                            subtitle: "Cette fonctionnalité permet de télécherger et visionner du contenu sans être connecté",
                            buttons: [
                                {
                                    "title": "Voir",
                                    "type": "postback",
                                    "payload": "TUTO_YES_RECO"

                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    sendMessageRequest(json, function(err, res) {
        if (err) {
            console.log('Template List message not sent')
        }
        console.log('Template list sent !' + res.message_id)
    })
}

module.exports = {
    sendMessageText,
    sendMessageContent,
    sendTemplateButton,
    sendMessageRequest,
    sendMessageUrl,
    sendListTuto,
}