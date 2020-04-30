# Now Playing 1.0.2, TwitchBot, & Chrome Extension #

### Get audio/song data from Chrome and return it to TwitchBot ###

Supports:
    BANDCAMP  Supports: Album Pages, Featured Pages, Carousel Player, Discover, Radio Pages & Album pages on Custom Domains
    YOUTUBE - Playlists, Entire Album VOD, Single Songs, and Live Videos (youtube.com/watch)
    SPOTIFY - Now-Playing-Bar, Album Pages (open.spotify.com)

Install Chrome Extension:
    Go to chrome://extensions, enable Developer Mode, select "Load Unpacked", and select 'now-playing' folder. Once installed Click on extension bar icon, go to 'Options' and click 'Save'. Once you've set up your Twitch Bot (below), click the extension bar icon and turn ON.
 
Setup Twitch Bot:
    To run the bot locally, copy the contents of the sample config inside server.js and save it as `config.json` in the root directory, then run `node server.js` (requires express, cors, tmi, and axios)

Return Variables: (*May not exist)
    BANDCAMP
        album
        albumURL
        artist
        image
        songName
        songNumber
        songURL
        *artistURL

    SPOTIFY
        albumURL
        artist                  
        currentTime
        durationTime
        image 
        songName
        *album        
        *playlistName          
        *playlistTotal        
        *albumDate              
        *songNumber          

    YOUTUBE
        channelName
        currentTime 
        currentTimeSeconds  
        durationTime 
        image
        mediaType 
        songName
        videoName        
        views 
        *taggedInfo      
        *artistNameApprox    
        *artist              
        *albumName          
        *commentLinks        
        *descriptionLinks    
        *playlistName        
        *playlistURL         
        *songNumber        
        *playlistTotal
        *currentTimeApprox   
        *currentSongApprox   
        *songUrl             

1.0.2 NEW FEATURES
    Extension:
        Popup display with current song info and ON/OFF switch.
        Options Page to customize line sent to BOT (including if statements **), ability to disable specific domains, and customize bot server info
        Get song info from BandCamp sites with a Custom Domain
        Get Image URL from Youtube, Spotify, and BandCamp
        YouTube get channelName, and more reliable artist name and songName

