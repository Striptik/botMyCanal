let utils = require('./utils'),
    CONF = require('./conf'),
    dico = require('./dictionary'),
    answers = require('./templateAnswer'),
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
            utils.sendMessageText(senderId, "[CATHERINE] : Ha désolé, mais nous ne gérons pas encore les pièces jointes");
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
}

function parseTemplateAnswer(user, payload) {
    for (let key in answers) {
        if (_.includes(key, payload)) {
            if (answers[key].type === 'message') {
                // MESSAGE
                console.log('POSTBACK FIND : ')
                console.log(answers[key])
                let ans = randomCatherinLiliane() + answers[key].answer
                utils.sendMessageText(user, ans)
            } else if (answers[key].type === 'image' || answers[key].type === 'video') {
                //TUTORIALS
                utils.sendMessageText(user, answers[key].message)
                utils.sendMessageContent(user, answers[key].type, answers[key].url)
             } else if (answer[key].type === 'web_url') {
                // URL LINK
                utils.sendMessageUrl(user, answers[key])
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
        utils.sendMessageText(user, '[CATHERINE] : Rien compris de ce que vous dites ! Et toi Lili ? \n[LILIANE] : Non plus. Allez essayez quelque chose d\'autre ?')
    }

    // One word find
    if (score === 1 && find.length === 1) {
        handleOneFind(user, find[0])
    }

    // More words
    if (score > 1) {
        let newFind = [], simpleAnswer = [], limit = 0
        for (let i = 0; i < find.length; i++) {
            if (find[i].type === 'tuto' && limit < 3) {
                limit++;
                newFind.push(find[i])
            } else if (find[i].type === 'answer') {
                simpleAnswer.push(find[i])
            }
        }
        if (newFind.length > 1) {
            moreThanOneMatch(user, newFind)
        } else if (newFind.length === 1) {
            handleOneFind(user, newFind[0])
        } else if (simpleAnswer.length > 0) {
            handleOneFind(user, simpleAnswer[0])
        }
    }

}

function handleOneFind(user, find) {
    if (find.type === 'tuto') {
        askVideoTuto(user, find)
    }
    if (find.type === 'answer') {
        let ans = randomCatherinLiliane() + find.question
        utils.sendMessageText(user, ans)
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
    let tmp = { type: 'postback', title: 'Rien de tout ça.', payload: CONF.TUT_NO}
    buttons.push(tmp)
    utils.sendTemplateButton(user, text_button, buttons)
}

function askVideoTuto(user, word) {
    let buttons = [
        {
            type: 'postback',
            title: word.answer_yes,
            payload: CONF.TUT_YES + word.payload_details
        },
        {
            type: 'postback',
            title: word.answer_no,
            payload: CONF.TUT_NO
        }
    ]
    let question = randomCatherinLiliane() + word.question
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
    handleOneFind,
}