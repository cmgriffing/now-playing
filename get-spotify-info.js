function getSpotifyInfo(){
    scrapedSong = {};
    scrapedSong.domain = "open.spotify.com";
    scrapedSong.origin = "SPOTIFY";
    scrapedSong.mediaType = "AUDIO"

    //NOW-PLAYING-BAR FOOTER BAR
    const isPlaying = document.querySelector('button[data-testid="control-button-pause"]');
    if(isPlaying){
        const rootPlayer = document.querySelector('.Root__now-playing-bar');
        //SONG NAME AND ALBUM URL
        const trackLink = rootPlayer.querySelector('a[data-testid="nowplaying-track-link"]');
        if(trackLink){
            const songName = trackLink.innerHTML;
            const albumURL = trackLink.href;
            scrapedSong.songName = songName;
            scrapedSong.albumURL = albumURL;
        }
        //ARTIST NAME AND ARTIST URL
        const nowPlaying = rootPlayer.querySelector('.now-playing-bar__left div.now-playing div.ellipsis-one-line');
        if(nowPlaying){
            const artistArray = Array();
            Array.from(nowPlaying.querySelectorAll('div')).map(row => {
                scrapedSong.artist = row.textContent;
                Array.from(row.querySelectorAll('a')).map(info => {
                    let tmp = {};
                    if(!('testid' in info.dataset)){
                        tmp.artistName = info.textContent;
                        tmp.artistURL = info.href;
                        if(artistArray.filter(function(e) { return e.artistName === tmp.artistName; }).length == 0){
                            artistArray.push(tmp);
                        }
                    }
                });
                return;
            });
            scrapedSong.artistArray = artistArray;
        }
        //CURRENT SONG TIME AND DURATION
        const playbackBar = rootPlayer.querySelector('.playback-bar');
        if(playbackBar){
            const progressTime = document.querySelectorAll('.playback-bar__progress-time');
            const currentTime = progressTime[0].innerHTML;
            const durationTime = progressTime[1].innerHTML;
            scrapedSong.currentTime = currentTime;
            scrapedSong.durationTime = durationTime;
        }
        //GET THUMBNAIL
        const coverArt = rootPlayer.querySelector('.now-playing__cover-art');
        if(coverArt){
            let image = document.querySelector('.now-playing__cover-art .cover-art div img.cover-art-image').src;
            let imageURL = image.replace('4851','1e02');
            scrapedSong.image = imageURL;
        }
        const albumTitle = document.querySelector('.NowPlayingView__context-title');
        if(albumTitle){
            const listContainer = document.querySelector('.now-playing div[data-testid="CoverSlotCollapsed__container"]');
            const listType = listContainer.querySelector('a');
            if(listType && listType.href.includes('album/')){
                scrapedSong.albumName = albumTitle.textContent;
            } else {
                scrapedSong.playlistName = albumTitle.textContent;
                scrapedSong.playlistURL = listType.href;
            }
        }
    }
    return scrapedSong;
} 
getSpotifyInfo();
