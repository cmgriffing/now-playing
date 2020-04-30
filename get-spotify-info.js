//SPOTIFY - Supports: Now-Playing-Bar Footer
//RETURNS
    // songName
    // albumURL
    // artist                   //uses single artists or concatonated artist array
    // currentTime
    // durationTime
    // image 
    // *album                    (if on current tracklist/album page)
    // *playlistName
    // *playlistTotal           (if on current tracklist/album page)
    // *albumDate               (if on current tracklist/album page)
    // *songNumber              (if on current tracklist/album page)

scrapedSong = {};
scrapedSong.domain = "open.spotify.com";
scrapedSong.origin = "SPOTIFY";
scrapedSong.mediaType = "AUDIO"

//NOW-PLAYING-BAR FOOTER BAR
if(document.querySelector('.now-playing-bar')!==undefined){
    //SONG NAME AND ALBUM URL
    if(document.querySelector('.now-playing-bar__left div.now-playing div div div span a[data-testid="nowplaying-track-link"]')!==undefined){
        var songName = document.querySelector('.now-playing-bar__left div.now-playing div div div span a[data-testid="nowplaying-track-link"]').innerHTML;
        var albumURL = document.querySelector('.now-playing-bar__left div.now-playing div div div span a[data-testid="nowplaying-track-link"]').href;
        scrapedSong.songName = songName;
        scrapedSong.albumURL = albumURL;
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
            artistString = artistString.concat(artist.artistName+", ");
        });
        artistString = artistString.substring(0, artistString.length - 2);
        scrapedSong.artist = artistString;
    }
    //CURRENT SONG TIME AND DURATION
    if(document.querySelector('.playback-bar')!==undefined){
        var artistArray = Array();
        var currentTime = document.querySelectorAll('.playback-bar__progress-time')[0].innerHTML;
        var durationTime = document.querySelectorAll('.playback-bar__progress-time')[1].innerHTML;
        scrapedSong.currentTime = currentTime;
        scrapedSong.durationTime = durationTime;
    }
    //GET THUMBNAIL
    if(document.querySelector('.now-playing__cover-art')!==undefined){
        var image = document.querySelector('.now-playing__cover-art .cover-art div img.cover-art-image').src;
        image = image.replace('4851','1e02');
        scrapedSong.image = image;
    }
}
//PLAYLIST OR ALBUM PAGE
if(document.querySelector('.main-view-container__scroll-node-child')!==null){
    var main = document.querySelector('.main-view-container__scroll-node-child');
    if(main.querySelector('[title="Pause"]')!==null){
        if(main.querySelector('.content div div span h1')!==null){
            let album = main.querySelector('.content div div span h1').innerText;
            scrapedSong.album = album;
        }
        if(main.querySelector('section div div span h1')!==null){
            let playlist = main.querySelector('section div div span h1').innerText;
            scrapedSong.playlistName = playlist;
        }
        if(main.querySelector('.main-view-container__scroll-node-child .content div img')!==null){
            let image = main.querySelector('.content div img').src;
            scrapedSong.image = image;
        }
    }
}
//TRACKLIST PAGE ie ALBUM INFO
if(document.querySelector('.TrackListHeader__body')&&document.querySelector('ol.tracklist')!==undefined){
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
            scrapedSong.album = albumName;
        }
        //TRACKLIST NUMBERS && PUBLISH DATE
        if(document.querySelector('.TrackListHeader__description-wrapper .TrackListHeader__text-silence.TrackListHeader__entity-additional-info')!==undefined){
            var albumInfo = document.querySelector('.TrackListHeader__description-wrapper .TrackListHeader__text-silence.TrackListHeader__entity-additional-info').innerHTML;
            var pubDate = albumInfo.split(' • ')[0];
            var playlistTotal = albumInfo.split(' • ')[1];
            scrapedSong.albumDate = pubDate;
            scrapedSong.playlistTotal = playlistTotal;
        }
    } 
    //GET THUMBNAIL
    if(document.querySelector('.now-playing__cover-art')){
        var image = document.querySelector('.now-playing__cover-art .cover-art div img.cover-art-image').src;
        image = image.replace('4851','1e02');
        scrapedSong.image = image;
    }
}
scrapedSong;