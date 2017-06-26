'use strict'

let express = require('express'),
    bodyParser = require('body-parser'),
    messengerRouter = require('./messenger');

let app = express();
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.listen((process.env.PORT || 5000))



// Server index page
app.get("/", function (req, res) {
    res.send("Online !");
});

app.use('/messenger', messengerRouter)

/*
MENU

curl -X POST -H "Content-Type: application/json" -d '{"persistent_menu":[{"locale":"default","composer_input_disabled":true,"call_to_actions":[{"title":"Les tutoriels","type":"postback","payload":"LIST_TUTO"},{"title":"Site MyCanal","type":"web_url","webview_height_ratio":"compact""url": "https://www.mycanal.fr/"},{"title":"Catherine et Liliane","type":"web_url","webview_height_ratio":"compact""url": "https://www.youtube.com/channel/UCJxGhimNxBot2nrbR3MMVTQ"}]}]}' "https://graph.facebook.com/v2.6/me/messenger_profile?access_token=EAAcbFjDgYZBABAMAa9PH8aggwd2XBzPK11EmeZAH7azeDjIAyF9Xz23TYgZB1xBYakeib60vU5Ttd7AkoI8kWOiKzCyKTocXQzRKQswkgZCHaW9UpAx4Ue9HkICEkuH9USrxYJrceD01ypH3OySrCqtCJQUdKeHLaZBSJwCVYHAZDZD"
*/