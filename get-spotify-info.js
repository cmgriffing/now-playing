//SPOTIFY - Supports: Now-Playing-Bar Footer
scrapedSong = {};
scrapedSong.domain = "open.spotify.com";
scrapedSong.origin = "SPOTIFY";

//RETURNS
    // scrapedSong.songName
    // scrapedSong.albumURL
    // scrapedSong.artistArray
    // scrapedSong.currentTime
    // scrapedSong.durationTime 
    // *scrapedSong.albumName               (if on current tracklist/album page)
    // *scrapedSong.playlistTotal           (if on current tracklist/album page)
    // *scrapedSong.playlistPublishDate     (if on current tracklist/album page)
    // *scrapedSong.songNumber              (if on current tracklist/album page)

//NOW-PLAYING-BAR FOOTER BAR
if(document.querySelector('.now-playing-bar')!==undefined){
    //SONG NAME AND ALBUM URL
    if(document.querySelector('.now-playing-bar__left div.now-playing div div div span a[data-testid="nowplaying-track-link"]')!==undefined){
        var songName = document.querySelector('.now-playing-bar__left div.now-playing div div div span a[data-testid="nowplaying-track-link"]').innerHTML;
        var albumURL = document.querySelector('.now-playing-bar__left div.now-playing div div div span a[data-testid="nowplaying-track-link"]').href;
        scrapedSong.songName = songName;
        scrapedSong.albumURL = albumURL;
        //console.log("gotosong",songName,albumURL);
    }
    //ARTIST NAME AND ARTIST URL
    if(document.querySelector('.now-playing-bar__left div.now-playing div.ellipsis-one-line')!==undefined){
        var artistArray = Array();
        var tmp = {};
        Array.from(document.querySelectorAll('.now-playing-bar__left div.now-playing div.ellipsis-one-line div span span span a')).map(row => {
            var tmp = {};
            tmp.artistName = row.innerHTML;
            tmp.artistURL = row.href;
            if(artistArray.filter(function(e) { return e.artistName === tmp.artistName; }).length == 0){
                artistArray.push(tmp);
            }
        });
        scrapedSong.artistArray = artistArray;
        //CREATE ARTIST STRING FROM ARTIST ARRAY
        var artistString = String();
        scrapedSong.artistArray.map(artist => {
            artistString = artistString.concat(artist.artistName+",");
        });
        artistString = artistString.substring(0, artistString.length - 1);
        scrapedSong.artistString = artistString;
    }
    
    //CURRENT SONG TIME AND DURATION
    if(document.querySelector('.playback-bar')!==undefined){
        var artistArray = Array();
        var currentTime = document.querySelectorAll('.playback-bar__progress-time')[0].innerHTML;
        var durationTime = document.querySelectorAll('.playback-bar__progress-time')[1].innerHTML;
        scrapedSong.currentTime = currentTime;
        scrapedSong.durationTime = durationTime;

    }
}
//TRACKLIST PAGE ie ALBUM INFO
if(document.querySelector('.TrackListHeader__body')!==undefined&&document.querySelector('ol.tracklist')!==undefined){
    var trackArray = Array.from(document.querySelectorAll('ol.tracklist div.react-contextmenu-wrapper div li div.name div div.tracklist-name'));
    var trackBool = trackArray.map(track => {return track.innerHTML.includes(scrapedSong.songName)});
    if(trackBool.includes(true)){
        //SONG NUMBER
        var songNumber = trackBool.indexOf(true)+1;
        scrapedSong.songNumber = songNumber;

        //TRACKLIST NAME
        var trackList = document.querySelectorAll('ol.tracklist div.react-contextmenu-wrapper div li div.name div div.tracklist-name');
        if(document.querySelector('.TrackListHeader__entity-name h2 span')!==undefined){
            var albumName = document.querySelector('.TrackListHeader__entity-name h2 span').innerHTML
            scrapedSong.albumName = albumName;
        }

        //TRACKLIST NUMBERS && PUBLISH DATE
        if(document.querySelector('.TrackListHeader__description-wrapper .TrackListHeader__text-silence.TrackListHeader__entity-additional-info')!==undefined){
            var albumInfo = document.querySelector('.TrackListHeader__description-wrapper .TrackListHeader__text-silence.TrackListHeader__entity-additional-info').innerHTML;
            var pubDate = albumInfo.split(' • ')[0];
            var playlistTotal = albumInfo.split(' • ')[1];
            scrapedSong.playlistPublishDate = pubDate;
            scrapedSong.playlistTotal = playlistTotal;
        }
    } 
}
scrapedSong;