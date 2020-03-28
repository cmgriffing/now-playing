# TwitchSongIRC, TwitchBot, & Chrome Extension
 
 Install Chrome Extension:
 Go to chrome://extensions, enable Developer Mode, select "Load Unpacked", and select 'now-playing' folder.
 
 Setup Twitch Bot:
 To run the bot locally, copy the contents of the sample config inside server.js and save it as `config.json` in the root directory, then run `node server.js`

    Supports:
        /BANDCAMP  Supports: Album Pages, Featured Pages, Carousel Player, Discover, Radio Pages
        //YOUTUBE - Playlists, Entire Album VOD, Single Songs, and Live Videos
        //SPOTIFY - Now-Playing-Bar

    Return Variables (background.js) (*Is not on every page)
    // BANDCAMP
        scrapedSong.album
        scrapedSong.artistName
        scrapedSong.albumURL
        scrapedSong.songName
        scrapedSong.songNumber
        scrapedSong.songURL
        *scrapedSong.artistURL

    // SPOTIFY
        scrapedSong.songName
        scrapedSong.albumURL
        scrapedSong.artistArray
        scrapedSong.currentTime
        scrapedSong.durationTime
        *scrapedSong.albumName         
        *scrapedSong.playlistTotal
        *scrapedSong.playlistPublishDate 
        *scrapedSong.songNumber         

    // YOUTUBE
        scrapedSong.currentTime 
        scrapedSong.currentTimeSeconds      
        scrapedSong.durationTime 
        scrapedSong.songName 
        scrapedSong.type                    
        scrapedSong.views 
        scrapedSong.currentTimeApprox       
        scrapedSong.currentSongApprox       
        scrapedSong.songUrl  
        *scrapedSong.taggedInfo             
        *scrapedSong.artistNameApprox       
        *scrapesSong.commentLinks           
        *scrapedSong.descriptionLinks       
        *scrapedSong.playlistName           
        *scrapedSong.playlistURL            
        *scrapedSong.songNumber             
        *scrapedSong.playlistTotal