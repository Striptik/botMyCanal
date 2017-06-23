let utils = require('./utils'),
    CONF = require('./conf'),
    dico = require('./dictionary'),
    answers = require('./templateAnswer')
    request = require('request'),
    _ = require('lodash')

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
            parseConversation(senderId, formattedMsg)
        } else if (message.attachments) {
            utils.sendMessageText(senderId, {text: "[CATHERINE] : Ha désolé mon petit, mais nous ne gérons pas encore les pièces jointes"});
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

    // function to handle postback

    parseTemplateAnswer(senderId, payload)

    // if (payload === CONF.payload_greeting) {
    //     // Get user's first name from the User Profile API
    //     // and include it in the greeting
    //     request({
    //         url: 'https://graph.facebook.com/v2.6/' + senderId,
    //         qs: {
    //             access_token: process.env.PAGE_ACCESS_TOKEN,
    //             fields: 'first_name'
    //         },
    //         method: 'GET'
    //     }, function(error, response, body) {
    //         let greeting = ''
    //         if (error) {
    //             console.log('[PRCPOSTBACK] - Error on processed postback : ' +  error)
    //         } else {
    //             let bodyObj = JSON.parse(body)
    //             let name = bodyObj.first_name
    //             greeting = '[LILIANE] : Bonjour ' + name + ' ! '
    //         }
    //         let message = greeting + 'Nous sommes Catherine et Liliane. En quoi pouvons nous vous être utile ?'
    //         utils.sendMessageText(senderId, {text: message})
    //     });
    // }

}

function parseTemplateAnswer(user, payload) {
    for (let key in answers) {
        if (_.includes(key, payload)) {
            if (answers[key].type === 'message') {
                console.log('POSTBACK FIND : ')
                    console.log(answers[key])
                let ans = randomCatherinLiliane() + answers[key].answer
                utils.sendMessageText(user, ans)
            } else if (answers[key].type === 'image' || answers[key].type === 'video') {
                utils.sendMessageContent(user, answers[key].type, answers[key].url)
                // little text after the video ??
            }
            // answer with other postback answer
            return
        }
    }
}

/**
 * This function permits to parse the conversation if a message text is send
 * @param user
 * @param formattedMsg
 */
function parseConversation(user, formattedMsg) {

    // Search for words in dictionary
    let score = 0;
    let find = []
    for (let key in dico) {
        if (_.includes(formattedMsg, key)) {
            console.log('FIND WORD !' + key)
            score++
            find.push(dico[key])
        }
    }

    // No words find
    if (score === 0 && find.length === 0) {
        utils.sendMessageText(user, '[CATHERINE] : Rien compris de ce que vous dites ! Et toi Lili ?', function(t) {
            console.log(t)
            utils.sendMessageText(user, '[LILIANE] : Non plus. Vous pouvez essayer autre chose peut être ?')
        })
    }

    // One word find
    if (score === 1 && find.length === 1) {
        if (find[0].type === 'tuto') {
            askVideoTuto(user, find[0])
        }
        if (find[0].type === 'answer') {
            let ans = randomCatherinLiliane() + find[0].question
            utils.sendMessageText(user, ans)
        }
        return
    }

    if (score > 1) {
        //check kind of word find
        console.log('some  words')
        moreThanOneMatch(user, find)
    }

}

function moreThanOneMatch(user, find) {
    utils.sendMessageText(user, '[CATHERINE] : Ca va trop vite, trop de données mes petits !')
    text_button = '[LILIANE] : T\'inquiète pas Catherine, je gère. Quel information vous ferait plaisir ?'
    let buttons = []
    for (let i = 0; i < find.length; i++) {
        let tmp = {
            type : 'postback',
            title: find[i].text_button,
            payload: CONF.TUT_YES + find[i].payload_details
        }
        buttons.push(tmp)
    }
    let tmp = { type: 'postback', title: 'Rien de tout ça..', payload: CONF.TUT_NO}
    buttons.push(tmp)
    utils.sendTemplateButton(user, text_button, buttons)
}

function askVideoTuto(user, word) {
    let buttons = [
        {
            type: 'postback',
            title: 'Oui c\'est bien ça',
            payload: CONF.TUT_YES + word.payload_details
        },
        {
            type: 'postback',
            title: 'Non du tout',
            payload: CONF.TUT_NO
        }
    ]
    let question = randomCatherinLiliane() + word.question
    console.log('ask : ')
    console.log(question)
    console.log(buttons)
    utils.sendTemplateButton(user, question, buttons)
}

function randomCatherinLiliane() {
    i = Math.random() * (1000)
    if (i % 2 === 1) {
        return ('[CATHERINE] : ')
    } else {
        return ('[LILIANE] : ')
    }
}

module.exports = {
    parseConversation,
    askVideoTuto,
    processMessage,
    processPostback,
    randomCatherinLiliane,
    parseTemplateAnswer,
}