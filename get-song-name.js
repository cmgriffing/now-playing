scrapedSong = {
  songName: '',
  songURL: '',
  songNumber: '',
  artist: '',
  artistURL: '',
  albumName: '',
  albumURL: ''
};

// Bandcamp singles && album pages
// example album: https://lorn.bandcamp.com/album/the-maze-to-nowhere
// example single: https://lorn.bandcamp.com/track/acid-rain
const trackView = document.querySelectorAll('.trackView');
if(trackView) {
  const trackRowViews = document.querySelectorAll('.track_row_view');
  if(trackRowViews.length > 0) {
    Array.from(trackRowViews).map(row => {
      if (row.querySelector('.playing')) {
        const songName = row.querySelector('.title a span').textContent;
        const songURL = row.querySelector('.title a').href;
        const songNumber = row
          .querySelector('.track_number')
          .textContent.replace('.', '');
        scrapedSong.songName = songName;
        scrapedSong.songURL = songURL
        scrapedSong.songNumber = songNumber;
      } 
    });
    Array.from(document.querySelectorAll('#name-section h3')).map(row => {
      const artistNameLink = row.querySelector('span a');
      if (artistNameLink) {
        scrapedSong.artist = artistNameLink.textContent;
        scrapedSong.artistURL = artistNameLink.href;
      }
    });
    const trackTitle = document.querySelector('h2.trackTitle');
    if(trackTitle){
      const album = trackTitle.textContent.trim();
      scrapedSong.albumName = album;
      scrapedSong.albumURL = window.location.href;
    }
  } else {
    const trackTitle = document.querySelector('h2.trackTitle');
    if(trackTitle){
      const songName = trackTitle.textContent.trim();
      scrapedSong.songName = songName;
      scrapedSong.songURL = window.location.href;
    }
    const albumLink = document.querySelector('[itemprop=inAlbum] a');
    if (albumLink) {
      const albumName = albumLink.textContent;
      const albumURL = albumLink.href;
      scrapedSong.albumName = albumName;
      scrapedSong.albumURL = albumURL;
    }
    const artistLink = document.querySelector('[itemprop=byArtist] a');
    if (artistLink) {
      const artist = artistLink.textContent;
      const artistURL = artistLink.href;
      scrapedSong.artist = artist; 
      scrapedSong.artistURL = artistURL; 
    }
  } 
} else {
  console.log("nothing");
}

// Bandcamp browse by tags || fan pages || collections (songURL/artistURL not included)
// examples: https://bandcamp.com/tag/electronic || https://bandcamp.com/cmgriffing
const playArray = document.querySelectorAll('.playing');
if(playArray) {
  Array.from(playArray).map(isPlaying => {
    const carouselPlayer = document.querySelector('.carousel-player');
    if(carouselPlayer) {
      const nowPlaying = carouselPlayer.querySelector('.now-playing');
      if(nowPlaying){
        const album = nowPlaying.querySelector('div.title').textContent;
        const artistName = nowPlaying.querySelector('div.artist span').textContent;
        scrapedSong.artist = artistName;
        scrapedSong.albumName = album;
      }
      const infoLink = 
        isPlaying.querySelector('div.info a') ||
        isPlaying.querySelector('div.collection-title-details a.item-link');
      if(infoLink) {
        const albumURL = infoLink.href;
        scrapedSong.albumURL = albumURL;
      }
      const progressTitle = carouselPlayer.querySelector('.progress-transport .title');
      if(progressTitle) {
        const songName = progressTitle.querySelector('span[data-bind="text: currentTrack().trackTitle"]').textContent;
        const songNumber = progressTitle.querySelector('span[data-bind="text: currentTrack().trackNumber"]').textContent;
        scrapedSong.songNumber = songNumber;
        scrapedSong.songName = songName;
      }
    }
  })
}

// Bandcamp featured page
// examples: https://daily.bandcamp.com/features 
const actualPlayer = document.querySelector('mplayer.playing');
if (actualPlayer) {
  const albumURL = actualPlayer.querySelector('a.mptralbum').href;
  const artistURL = actualPlayer.querySelector('a.mpartist').href;
  const album = actualPlayer.querySelector('a.mptralbum').textContent;
  const artist = actualPlayer.querySelector('a.mpartist').textContent;
  const songName = actualPlayer.querySelector('.mptracktitle').textContent;
  const songNumber = actualPlayer.querySelector('.mptracknumber').textContent;
  const songURL = artistURL+"track/"+songName.replace(' ','-')
  scrapedSong.artistURL = artistURL;
  scrapedSong.albumURL = albumURL;
  scrapedSong.albumName = album; 
  scrapedSong.artist = artist;
  scrapedSong.songName = songName;
  scrapedSong.songNumber = songNumber;
  scrapedSong.songURL = songURL;
}

// Bandcamp  weekly player
// https://bandcamp.com/?show=47
const bandcampPlayer = document.querySelector('.bcweekly-info .row .bcweekly-info-inner .bcweekly-tracks .bcweekly-current');
if(bandcampPlayer) {
  const artist = bandcampPlayer.querySelector('p.track-artist a').textContent;
  const artistURL = bandcampPlayer.querySelector('p.track-artist a').href;
  const trackDetails = bandcampPlayer.querySelector('.track-details');
  const albumURL = trackDetails.querySelector('a').href;
  const songName = trackDetails.querySelector('a span.track-title').textContent;
  const album = trackDetails.querySelector('a span.track-album').textContent;
  scrapedSong.artist = artist;
  scrapedSong.artistURL = artistURL;
  scrapedSong.albumName = album;
  scrapedSong.albumURL = albumURL;
  scrapedSong.songName = songName;

}

// Bandcamp hompage discover section
// https://bandcamp.com/
const discover = document.querySelector('.discover-item .playing');
if(discover) {
  const discoverArray = discover.parentNode;
  const albumName = discoverArray.querySelector('.item-title').textContent;
  const albumURL = discoverArray.querySelector('.item-title').href;
  const artist = discoverArray.querySelector('.item-artist').textContent;
  const artistURL = discoverArray.querySelector('.item-title').href;
  scrapedSong.albumName = albumName;
  scrapedSong.albumURL = albumURL;
  scrapedSong.artist = artist;
  scrapedSong.artistURL = artistURL
  const iPlayer = document.querySelector('.inline_player');
  if(iPlayer){
    const songName = iPlayer.querySelector('.title').textContent;
    const currentTime = iPlayer.querySelector('.time_elapsed').textContent;
    const durationTime = iPlayer.querySelector('.time_total').textContent;
    scrapedSong.songName = songName;
    scrapedSong.currentTime = currentTime;
    scrapedSong.durationTime = durationTime;

  }
}
scrapedSong;
