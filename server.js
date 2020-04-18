const express = require("express");
const app = express();
const cors = require("cors");
const tmi = require("tmi.js");
const axios = require("axios");
const say = require("say");

let globalSpark;

let album = {};
let song = {};

app.use(express.json());
app.use(express.static("static"));

app.use(cors());

app.get("/api/album", (req, res) => {
  res.json(album);
});

app.post("/api/album", (req, res) => {
  console.log("req.body", req.body);
  album = req.body;
  res.sendStatus(200);
});

app.get("/api/song", (req, res) => {
  res.json(song);
});

app.post("/api/song", (req, res) => {
  console.log("req.body", req.body);
  song = req.body;
  res.sendStatus(200);
});

app.post("/api/mock-twitch-event", (req, res) => {
  const { eventName, payload } = req.body;
  createProxiedEventHandler(eventName)(payload);
  res.sendStatus(200);
});

app.listen(4242, () => console.log("Example app listening on port 4242!"));

//
// Bot Stuff
//

// Valid commands start with:
let commandPrefix = "!";

/* example config.json
{
    "identity": {
        "username": "cadburybot",
        "password": "oauth:..."
    },
    "channels": [
        "cmgriffing"
    ]
}
*/
let config = require("./config.json");

// These are the commands the bot knows (defined below):
const knownCommands = {
  song: songCommand,
  didyouknow: didyouknowCommand,
  weather: weatherCommand,
};

let client = new tmi.client(config);

client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);
client.on("disconnected", onDisconnectedHandler);

client.on(
  "resub",
  (channel, username, streakMonths, message, userstate, methods) => {
    const payload = {
      channel,
      username,
      streakMonths,
      message,
      userstate,
      methods,
    };
    createProxiedEventHandler("resub")(payload);
  }
);

client.on("subscription", (channel, username, methods, message, userstate) => {
  const payload = {
    channel,
    username,
    methods,
    message,
    userstate,
  };
  createProxiedEventHandler("subscription")(payload);
});

client.on(
  "subgift",
  (channel, username, streakMonths, recipient, methods, userstate) => {
    const payload = {
      channel,
      username,
      streakMonths,
      recipient,
      methods,
      userstate,
    };
    createProxiedEventHandler("subgift")(payload);
  }
);

client.on(
  "submysterygift",
  (channel, username, numbOfSubs, methods, userstate) => {
    const payload = {
      channel,
      username,
      numbOfSubs,
      methods,
      userstate,
    };
    createProxiedEventHandler("submysterygift")(payload);
  }
);

client.on("cheer", (channel, userstate, message) => {
  const payload = {
    channel,
    userstate,
    message,
  };
  createProxiedEventHandler("cheer")(payload);
});

client.on("hosted", (channel, username, viewers, autohost) => {
  const payload = {
    channel,
    username,
    viewers,
    autohost,
  };
  createProxiedEventHandler("hosted")(payload);
});

client.on("raided", (channel, username, viewers, autohost) => {
  const payload = {
    channel,
    username,
    viewers,
  };
  createProxiedEventHandler("raided")(payload);
});

client.connect().catch((e) => console.log);

function songCommand(target, context, params) {
  if (Object.keys(song).length === 0) {
    client
      .say(target, "Unable to fetch current song.")
      .catch((e) => console.log);
    return;
  }
  const message = `cmgriffing is currently listening to ${song.songName} by ${
    album.artist
  }. It is track #${song.songNumber} on ${
    album.album
  }. You can find the album here: ${album.url}`;

  if (context["message-type"] === "whisper") {
    client.whisper(target, message).catch((e) => console.log);
  } else {
    client.say(target, message).catch((e) => console.log);
  }
}

const recentDidYouKnows = [];
const didyouknowResponses = [
  "Did you know Chris snowboards a lot even though he has broken collar bones?",
  "Did you know Chris is a framework slut?",
  "Did you know Chris once cried watching an ad that popped up in youtube?",
  "Did you know Chris used ipfs to avoid all his server cost problems?",
  "Did you know Chris has only one chrome extension and it's his?",
  "Did you know Chris is getting annoyed right now with all the did you know trivia?",
  "Did you know Chris once streamed for 21 hours?",
  "Did you know Chris would storm out of an interview if they asked him the difference between call and apply methods in js?",
];

function didyouknowCommand(target, context, params) {
  let response;
  while (recentDidYouKnows.indexOf(response) > -1) {
    response =
      didyouknowResponses[
        Math.floor(Math.random() * didyouknowResponses.length)
      ];
  }

  if (recentDidYouKnows.length >= 3) {
    recentDidYouKnows.shift();
  }
  recentDidYouKnows.push(response);

  if (context["message-type"] === "whisper") {
    client.whisper(target, response).catch((e) => console.log);
  } else {
    client.say(target, response).catch((e) => console.log);
  }
}

function weatherCommand(target, context) {
  const weatherAPIurl =
    "https://api.weather.gov/gridpoints/SEW/124,67/forecast/hourly";

  axios
    .get(weatherAPIurl)
    .then((res) => {
      if (res.status === 200) {
        const {
          temperature: fahrenheit,
          windSpeed,
          shortForecast,
        } = res.data.properties.periods[0];

        const celsius = Math.round(((fahrenheit - 32) * 5) / 9);
        const response = `${shortForecast} [${fahrenheit} F/ ${celsius} C] - Wind: ${windSpeed}`;

        client.say(target, response).catch((e) => console.log);
      }
    })
    .catch((e) => console.log);
}

// Called every time a message comes in:
function onMessageHandler(target, context, msg, self) {
  if (self) {
    // Ignore messages sent by the bot itself
    return;
  }

  if (msg.substr(0, 1) !== commandPrefix) {
    // Ignore messages that don't start with the command prefix
    // console.log(
    //   `[${target} (${context["message-type"]})] ${context.username}: ${msg}`
    // );
    return;
  }

  const parse = msg.slice(1).split(" ");
  const commandName = parse[0];
  const params = parse.splice(1);

  if (commandName in knownCommands) {
    const command = knownCommands[commandName];
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

const Primus = require("primus");
const http = require("http");

const server = http.createServer(/* request handler */);
const primus = new Primus(server, {
  /* options */
});
server.listen(42069);

primus.on("connection", function(spark) {
  // spark is the new connection.
  console.log("connected");
  globalSpark = spark;
});

const webhookListener = express();
webhookListener.use(express.json());
webhookListener.use(cors());

/* Example Follow Payload
{
   "data":
      [{
         "from_id":"1336",
         "from_name":"ebi",
         "to_id":"1337",
         "to_name":"oliver0823nagy",
         "followed_at": "2017-08-22T22:55:24Z"
      }]
}
*/
const recentFollows = [];
webhookListener.post("/follower/new", (req, res) => {
  console.log("req.body", req.body);

  // check if already notified of user_id follow

  // prune list

  // add to list

  // show notification

  res.sendStatus(200);
});

app.listen(8484, () => console.log("WebhookListener listening on port 8484!"));

async function subscribeToTwitchEvents(dependencies) {
  const { ngrok } = dependencies;

  // unsubscribe previous url

  const url = await ngrok.connect();

  // write the url to a file

  // subscribe with new url

  // styrofoam_pad_user_id = 433913815
  // topic: https://api.twitch.tv/helix/users/follows?first=1&to_id=433913815
}

function createProxiedEventHandler(eventName) {
  return function(payload) {
    if (globalSpark) {
      globalSpark.write({
        eventName,
        payload,
      });
      sayEventMessage(eventName);
    } else {
      console.log(`No Spark available to proxy ${eventName} event to.`);
    }
  };
}

function sayEventMessage(eventName) {
  say.speak(getEventMessage(eventName));
}

function getEventMessage(eventName) {
  switch (eventName) {
    case "resub":
    case "subscription":
    case "subgift":
      return "You just blew my mind!";

    default:
      return "I don't know what to put here";
  }
}
