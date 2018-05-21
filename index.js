const TeleBot = require('telebot');
const GoogleImages = require('google-images');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const searchClient = new GoogleImages('014068829970830705133:0sbqksb7ldw', 'AIzaSyANLTy1iZCDapwkNpTkmq8_6n90XFCZdKw');

const bot = new TeleBot('584357222:AAEUw8rFwnF0mJbB1Kw8tOxeTaVGNcb1MTY');

const soupDict = [
    'Борщ',
    'Грибной суп',
    'Крем-суп',
    'Зеленый борщ',
    'Солянка',
    'Фасолевый суп',
    'Гороховый суп',
    'Харчо',
    'Суп с фрикадельками'
]

// On inline query
bot.on('inlineQuery', msg => {

    let query = msg.query;
    console.log(`inline query: ${ query }`);

    // Create a new answer list object
    const answers = bot.answerList(msg.id, {cacheTime: 60});
    const youChose = query && `Я вижу ты хочешь ${query}`;
    const botChose = _.sample(soupDict);
    // Article
    const searchQuery = query || botChose

    answers.addArticle({
        id: 'query',
        title: youChose || `Я выбрал тебе суп: ${botChose}`,
        description: `Если хочешь другой, то напиши название`,
        message_text: searchQuery
    });
    
    return searchClient.search(searchQuery)
        .then(images => {
            _.shuffle(images).forEach((image, i) => {
                
                answers.addPhoto({
                    id: uuidv4().split('-')[0],
                    caption: image.description,
                    photo_url: image.url,
                    thumb_url: image.thumbnail.url,
                    photo_height: 100,
                    photo_width: 200
                });
            });
            
            return bot.answerQuery(answers);
        });

});

bot.start();