# Now Playing 1.2.0 - Chrome Extension & TwitchBot #

### Get audio/song data from Chromium based browsers and return it to TwitchBot ###

Now Playing allows you to request currently playing song info from Bandcamp on Chromium based browsers by sending '!song' in an IRC message.

## Supports ##
CHROMIUM BROWSERS
TWITCH IRC 
BANDCAMP - Album Pages, Featured Pages, Carousel Player, Discover, Radio Pages & Album pages on Custom Domains.

## Installation ##
Clone (or download and unzip) Now Playing. In chromium browser, go to extensions page (ex. chrome://extensions), enable Developer Mode, select "Load Unpacked", and select 'now-playing' folder. Once installed Click on extension bar icon, go to 'Options' and click 'Save'. Once you've set up your Twitch Bot (below), click the extension bar icon and turn ON.
 
## Setup Twitch Bot ##
To run the bot locally, copy the contents of the sample config inside server.js and save it as `config.json` in the root directory, then run `node server.js` (requires express, cors, tmi, and axios).

## Response Data ##
```
BANDCAMP
    songName
    *songURL
    artist
    artistURL
    album
    albumURL
    *songNumber
    *playlistName
    *playlistURL

*Depends on page
```

## Example Data ##
#### Album Page (example page - https://lorn.bandcamp.com/album/the-maze-to-nowhere): ####
```
req.body {
    albumName: 'GUARDIAN',
    albumURL: 'https://lorn.bandcamp.com/album/guardian',
    artist: 'LORN',
    artistURL: 'https://lorn.bandcamp.com/',
    currentTime: '00:02',
    durationTime: '02:39',
    songName: 'GUARDIAN 2',
    songNumber: '2',
    songURL: 'https://lorn.bandcamp.com/track/guardian-2'
}
```

#### Single Page (example page - https://lorn.bandcamp.com/track/acid-rain): ####
```
req.body {
    albumName: 'GUARDIAN',
    albumURL: 'https://lorn.bandcamp.com/album/guardian',
    artist: 'LORN',
    currentTime: '00:07',
    durationTime: '02:35',
    songName: 'GUARDIAN 1',
    songNumber: '',
    songURL: 'https://lorn.bandcamp.com/track/guardian-1'
}
```

#### Tag Page (example page - https://bandcamp.com/tag/chillwave): ####
```
req.body {
    albumName: 'Vacuum Noises (or synthgaze to make you cry and wither)',
    albumURL: 'https://astrophysicsbrazil.bandcamp.com/album/vacuum-noises-or-synthgaze-to-make-you-cry-and-wither?from=hp',
    artist: 'Astrophysics',
    artistURL: 'astrophysicsbrazil.bandcamp.com',
    currentTime: '00:46',
    durationTime: '03:42',
    songName: 'Disorder',
    songNumber: '1',
    songURL: ''
}
```

#### Features Pages (example page  - https://daily.bandcamp.com/features/chamberlain-red-weather-interview): ####
```
req.body {
    albumName: 'Red Weather',
    albumURL: 'https://chamberlain.bandcamp.com/album/red-weather',
    artist: 'Chamberlain',
    artistURL: 'https://chamberlain.bandcamp.com/',
    currentTime: '00:29',
    durationTime: '04:18',
    songName: 'Not Your War',
    songNumber: '1',
    songURL: 'https://chamberlain.bandcamp.com/track/Not-Your War'
}
```

#### Bandcamp Weekly Show Page (example page - https://bandcamp.com/?show=47): ####
```
req.body {
    albumName: 'Leisure Suit Larry: Reloaded',
    albumURL: 'https://austinwintory.bandcamp.com/album/leisure-suit-larry-reloaded?from=hpbcw',
    artist: 'Austin Wintory',
    artistURL: 'https://austinwintory.bandcamp.com/?from=hpbcw',
    playlistName: 'Bandcamp Weekly November 5, 2013',
    playlistURL: 'https://bandcamp.com/?show=47',
    songName: 'Larry Reloaded',
    songNumber: '',
    songURL: ''
}
```

#### Bandcamp Homepage (example page - https://bandcamp.com/): ####
```
req.body {
    albumName: 'Between Da Protests [EXTENDED EDITION]',
    albumURL: 'https://krsone.bandcamp.com/album/between-da-protests-extended-edition?from=discover-top',
    artist: 'KRS-ONE',
    artistURL: 'https://krsone.bandcamp.com/?from=discover-top',
    currentTime: '00:04',
    durationTime: '03:37',
    songName: 'Don't Fall For It',
    songNumber: '',
    songURL: ''
}
```

## Changlog ##
```
1.2.0
    Extension:
        Add Bandcamp Single/Track Page Support
        Add Bandcamp Tags/Fan Page/Collection Page Support
        Add Bandcamp Featured Page Support
        Add Bandcamp Weekly Show Page Support
        Add Bandcamp Homepage Support

1.1.1
    Extension:
        Get song info from Bandcamp sites with a Custom Domain
```
