const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const tmi = require('tmi.js');

let album = {};
let song = {};

app.use(bodyParser.json());
app.use(express.static('static'))

app.options('*', cors());

app.get('/api/album', cors(), (req, res) => {
  res.json(album);
});

app.post('/api/album', cors(), (req, res) => {
  console.log('req.body', req.body);
  album = req.body;
  res.sendStatus(200);
});

app.get('/api/song', cors(), (req, res) => {
  res.json(song);
});

app.post('/api/song', cors(), (req, res) => {
  console.log('req.body', req.body);
  song = req.body;
  res.sendStatus(200);
});

app.listen(4242, () => console.log('Example app listening on port 4242!'));

//
// Bot Stuff
//


// Valid commands start with:
let commandPrefix = '!'

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
  song: songCommand
};


let client = new tmi.client(config)

client.on('message', onMessageHandler)
client.on('connected', onConnectedHandler)
client.on('disconnected', onDisconnectedHandler)

client.connect().catch(e => console.log);

function songCommand(target, context, params) {

  const message = `cmgriffing is currently listening to ${song.songName} by ${album.artist}. It is track #${song.songNumber} on ${album.album}. You can find the album here: ${album.url}`

  if(context['message-type'] === 'whisper') {
    client.whisper(target, message).catch(e => console.log)
  } else {
    client.say(target, message).catch(e => console.log)
  }
}

// Called every time a message comes in:
function onMessageHandler (target, context, msg, self) {
  if (self) { return } // Ignore messages from the bot

  // This isn't a command since it has no prefix:
  if (msg.substr(0, 1) !== commandPrefix) {
    console.log(`[${target} (${context['message-type']})] ${context.username}: ${msg}`)
    return
  }

  // Split the message into individual words:
  const parse = msg.slice(1).split(' ')
  // The command name is the first (0th) one:
  const commandName = parse[0]
  // The rest (if any) are the parameters:
  const params = parse.splice(1)

  // If the command is known, let's execute it:
  if (commandName in knownCommands) {
    // Retrieve the function by its name:
    const command = knownCommands[commandName]
    // Then call the command with parameters:
    command(target, context, params)
    console.log(`* Executed ${commandName} command for ${context.username}`)
  } else {
    console.log(`* Unknown command ${commandName} from ${context.username}`)
  }
}

// Called every time the bot connects to Twitch chat:
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`)
}

// Called every time the bot disconnects from Twitch:
function onDisconnectedHandler (reason) {
  console.log(`Womp womp, disconnected: ${reason}`)
  process.exit(1)
}