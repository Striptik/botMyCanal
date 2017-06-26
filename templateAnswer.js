let answers = {
    'Hello !': {
        type: 'message',
        answer: 'Bonjour Bonjour ! Nous sommes Catherine et Liliane.\n\nNous avons pas mal de choses à faire, mais nous avons bien 5 minutes à vous accorder. En quoi pouvons nous vous être utile ?'
    },
    TUTO_YES_OFFRES: {
        type: 'web_url',
        url: 'http://static.lesoffrescanal.fr/mycanal/canal-sans-engagement.html?ectrans=1&kwid=liensponso%7CMarque_myCanal_BMM%7Cmycanal%7CPub%7Clienstextes%7CHavas%7CTous%7CGOOGLE%7CMyCanal_BMM%7C%2Boffre%20%2Bmy%20%2Bcanal%7CMedia%7C2017/01/01-2017/12/31&searchintent=simarque&mkwid=sU7UF0znI_dc%7Cpcrid%7C183093552445%7Cpkw%7C%2Boffre%20%2Bmy%20%2Bcanal%7Cpmt%7Cb',
        title: 'Les Offres Canal',
        message: 'Chic, chic, regardez cette page. Je pense que vous trouverez votre bonheur !'
    },
    TUTO_YES_SITE: {
        type: 'web_url',
        url: 'https://www.mycanal.fr/',
        title: 'Le Site MyCanal',
        message: 'Bon très bien ! Je vous y emmène alors'
    },
    TUTO_YES_RECO: {
        type: 'image',
        url: 'http://imgur.com/a/sC4vo.gif',
        message: 'Je vais regarder avec vous : '
    },
    TUTO_YES_PROFIL: {
        type: 'image',
        message: 'C\'est parti : ',
        url: 'http://imgur.com/a/yfCh5.gif'
    },
    TUTO_YES_REVOIR: {
        type: 'image',
        url: 'http://imgur.com/D0NV79l.gif',
        message: 'Voici quelques astuces : ',
    },
    TUTO_YES_DOWNLOAD: {
        type: 'image',
        message: 'Pour télécharger c\'est pas compliqué mon choux : ',
        url: 'http://imgur.com/a/fbKzF.gif'
    },
    TUTO_NO: {
        type: 'message',
        answer: 'Très bien, Très bien ! C\'est compris ! Une autre question peut être ?'
    },
    LIST_TUTO: {
        type: 'list'
    }
}

module.exports = answers