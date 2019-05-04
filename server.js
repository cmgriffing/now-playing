const express = require('express');
const app = express();
const cors = require('cors');
const tmi = require('tmi.js');
const axios = require('axios');

let album = {};
let song = {};

app.use(express.json());
app.use(express.static('static'));

app.use(cors());

app.get('/api/album', (req, res) => {
  res.json(album);
});

app.post('/api/album', (req, res) => {
  console.log('req.body', req.body);
  album = req.body;
  res.sendStatus(200);
});

app.get('/api/song', (req, res) => {
  res.json(song);
});

app.post('/api/song', (req, res) => {
  console.log('req.body', req.body);
  song = req.body;
  res.sendStatus(200);
});

app.listen(4242, () => console.log('Example app listening on port 4242!'));

//
// Bot Stuff
//

// Valid commands start with:
let commandPrefix = '!';

/* example config
{
  identity: {
    username: '',
    password: 'oauth:' + ''
  },
  channels: [
    ''
  ]
}
*/
let config = require('./config.json');

// These are the commands the bot knows (defined below):
const knownCommands = {
  song: songCommand,
  didyouknow: didyouknowCommand,
  weather: weatherCommand,
};

let client = new tmi.client(config);

client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);
client.on('disconnected', onDisconnectedHandler);

client.connect().catch(e => console.log);

function songCommand(target, context, params) {
  const message = `cmgriffing is currently listening to ${song.songName} by ${
    album.artist
  }. It is track #${song.songNumber} on ${
    album.album
  }. You can find the album here: ${album.url}`;

  if (context['message-type'] === 'whisper') {
    client.whisper(target, message).catch(e => console.log);
  } else {
    client.say(target, message).catch(e => console.log);
  }
}

const recentDidYouKnows = [];
const didyouknowResponses = [
  'Did you know Chris snowboards a lot even though he has broken collar bones?',
  'Did you know Chris is a framework slut?',
  'Did you know Chris once cried watching an ad that popped up in youtube?',
  'Did you know Chris used ipfs to avoid all his server cost problems?',
  "Did you know Chris has only one chrome extension and it's his?",
  'Did you know Chris is getting annoyed right now with all the did you know trivia?',
  'Did you know Chris once streamed for 21 hours?',
  'Did you know Chris would storm out of an interview if they asked him the difference between call and apply methods in js?',
];

function didyouknowCommand(target, context, params) {
  let response = didyouknowResponses[Math.floor(Math.random() * didyouknowResponses.length)];
  while(recentDidYouKnows.indexOf(response) > -1) {
    response = didyouknowResponses[
      Math.floor(Math.random() * didyouknowResponses.length)
    ];
  }

  if (recentDidYouKnows.length >= 3) {
    recentDidYouKnows.shift();
  }
  recentDidYouKnows.push(response);

  if (context['message-type'] === 'whisper') {
    client.whisper(target, response).catch(e => console.log);
  } else {
    client.say(target, response).catch(e => console.log);
  }
}

function weatherCommand(target, context) {
  const weatherAPIurl =
    'https://api.weather.gov/gridpoints/SEW/124,67/forecast/hourly';

  axios
    .get(weatherAPIurl)
    .then(res => {
      if (res.status === 200) {
        const {
          temperature: fahrenheit,
          windSpeed,
          shortForecast,
        } = res.data.properties.periods[0];

        const celsius = Math.round(((fahrenheit - 32) * 5) / 9);
        const response = `${shortForecast} [${fahrenheit} F/ ${celsius} C] - Wind: ${windSpeed}`;

        client.say(target, response).catch(e => console.log);
      }
    })
    .catch(e => console.log);
}

// Called every time a message comes in:
function onMessageHandler(target, context, msg, self) {
  if (self) {
    return;
  } // Ignore messages from the bot

  // This isn't a command since it has no prefix:
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(
      `[${target} (${context['message-type']})] ${context.username}: ${msg}`
    );
    return;
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ');
  // The command name is the first (0th) one:
  const commandName = parse[0];
  // The rest (if any) are the parameters:
  const params = parse.splice(1);

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName];
    // Then call the command with parameters:
    command(target, context, params);
    console.log(`* Executed ${commandName} command for ${context.username}`);
  } else {
    console.log(`* Unknown command ${commandName} from ${context.username}`);
  }
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler(reason) {
  console.log(`Womp womp, disconnected: ${reason}`);
  process.exit(1);
}
