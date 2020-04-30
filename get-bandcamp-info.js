//BANDCAMP  Supports: Album Pages, Featured Pages, Carousel Player, Discover 
//RETURNS
  // album
  // artist
  // albumURL
  // songName
  // songNumber
  // songURL
  // image
  // *artistURL
scrapedSong = {};
scrapedSong.domain = "bandcamp.com";
scrapedSong.origin = "BANDCAMP";
scrapedSong.mediaType = "AUDIO"

//ALBUM PAGE
if(document.querySelectorAll('.trackView').length>0){
  Array.from(document.querySelectorAll('.track_row_view')).map(row => {
    if (row.querySelector('.playing')) {
      const songName = row.querySelector('.title a span').innerHTML;
      const songURL = row.querySelector('.title a').href;
      const songNumber = row
        .querySelector('.track_number')
        .innerHTML.replace('.', '');

      scrapedSong.songName = songName;
      scrapedSong.songNumber = songNumber;
      scrapedSong.songURL = songURL;
    }
  });
  Array.from(document.querySelectorAll('#name-section h3')).map(row => {
    if (row.querySelector('span a')) {
      const artistName = row.querySelector('span a');
      
      scrapedSong.artist = artistName.innerHTML;
      scrapedSong.artistURL = artistName.href;
    
    }
  });
  if(document.querySelector('h2.trackTitle')!==undefined){
    var album = document.querySelector('h2.trackTitle').innerHTML.trim();
    scrapedSong.album = album;
    scrapedSong.albumURL = window.location.href;
  }
  //GET THUMBNAIL
  let imager = document.querySelector('.trackView .middleColumn #tralbumArt a img').src;
  scrapedSong.image = imager;
}
//Category Pages carosel player
if(document.querySelector('.carousel-player')!==undefined&&document.querySelector('.carousel-player')!==null){
  var carouselPlayer = document.querySelector('.carousel-player');
  if(carouselPlayer.querySelector('.now-playing')){
    var nowPlaying = carouselPlayer.querySelector('.now-playing');
    //ALBUM NAME
    var album = nowPlaying.querySelector('div.title').innerHTML;
    scrapedSong.album = album;
    //ARTIST NAME
    var artistName = nowPlaying.querySelector('div.artist span').innerHTML;
    scrapedSong.artist = artistName;

  }

  //ALBUM URL
  if(document.querySelector('.playing')){
    var collectionNode = document.querySelector('.playing');
    var albumURL = collectionNode.querySelector('div a.item-link').href;
    scrapedSong.albumURL = albumURL;

    //GET THUMBNAIL
    let image = collectionNode.querySelector('.art img').src;
    scrapedSong.image = image;
  }
  //SONG NAME AND NUMBER
  if(carouselPlayer.querySelector('.progress-transport')){
    var progressTrans = carouselPlayer.querySelector('.progress-transport .title');
    //SONG NAME
    var songName = progressTrans.querySelector('span[data-bind="text: currentTrack().trackTitle"]').innerHTML;
    scrapedSong.songName = songName;
    //SONG NUMBER
    var songNumber = progressTrans.querySelector('span[data-bind="text: currentTrack().trackNumber"]').innerHTML;
    scrapedSong.songNumber = songNumber;
  }
  //array info-progress div.info div.title a spac[0] = trackNumber span[1] songName
}
//FEATURED PAGE
if(document.querySelectorAll('#p-now-playing').length>0){
  var pPlayer = document.querySelector('#p-now-playing');
  var album = pPlayer.querySelector('.art-text .albumtitle b').innerHTML;
  var artist = pPlayer.querySelector('.art-text .albumtitle span').innerHTML;
  var songNumber = pPlayer.querySelector('.art-text .trackname span[data-bind="text: currentTrack().trackNumber"]').innerHTML;
  var songName = pPlayer.querySelector('.art-text .trackname span[data-bind="text: currentTrack().trackTitle"]').innerHTML;
  var actualPlayer = document.querySelector('mplayer.playing');
  var albumURL = actualPlayer.querySelector('a.mptralbum').href;
  var artistURL = actualPlayer.querySelector('a.mpartist').href;
  scrapedSong.album = album;
  scrapedSong.artist = artist;
  scrapedSong.albumURL = albumURL;
  scrapedSong.songName = songName;
  scrapedSong.songNumber = songNumber;
  scrapedSong.artistURL = artistURL;
   //GET THUMBNAIL
  if(document.querySelector('mplayer.playing mplayer-inner .mpaa img')!==undefined){
    let image = document.querySelector('mplayer.playing mplayer-inner .mpaa img').src;
    scrapedSong.image = image;
  }
  if(document.querySelector('.large-player')!==null){
    let image = document.querySelector('.large-player img').src;
    scrapedSong.image = image;
  }
 
}
//BANDCAMP WEEKLY PLAYER
if(document.querySelectorAll('#bcweekly #bcweekly-inner.playing').length>0){
  var bcPlayer = document.querySelector('#bcweekly #bcweekly-inner.playing');
  bcPlayer = document.querySelector('.bcweekly-info .row .bcweekly-info-inner .bcweekly-tracks .bcweekly-track-list .bcweekly-current');
  var trackDetails = bcPlayer.querySelector('.track-details');
  var albumURL = trackDetails.querySelector('a').href;
  var songName = trackDetails.querySelector('a span.track-title').innerHTML;
  var album = trackDetails.querySelector('a span.track-album').innerHTML;
  var trackArtist = bcPlayer.querySelector('.track-artist a');
  var artist = trackArtist.innerHTML;
  var artistURL = trackArtist.href;
  var image = bcPlayer.querySelector('.track-large div a img').src;
  scrapedSong.album = album;
  scrapedSong.artist = artist;
  scrapedSong.albumURL = albumURL;
  scrapedSong.songName = songName;
  scrapedSong.image = image;
  scrapedSong.artistURL = artistURL;

}
//DISCOVER SECTION
if(document.querySelector('.discover-item .playing')!==undefined&&document.querySelector('.discover-item .playing')!==null){
  var discover = document.querySelector('.discover-item .playing');
  let image = discover.querySelector('span img').src;
  scrapedSong.image = image;
  let discoverArray = discover.parentNode;
  scrapedSong.album = discoverArray.querySelector('.item-title').innerHTML;
  scrapedSong.albumURL = discoverArray.querySelector('.item-title').href;
  scrapedSong.artist = discoverArray.querySelector('.item-artist').innerHTML;
  scrapedSong.artistURL = discoverArray.querySelector('.item-title').href;
  if(document.querySelector('.inline_player')!==undefined){
    var iPlayer = document.querySelector('.inline_player');
    var songName = iPlayer.querySelector('.title').innerHTML;
    var currentTime = iPlayer.querySelector('.time_elapsed').innerHTML;
    var durationTime = iPlayer.querySelector('.time_total').innerHTML;
    scrapedSong.songName = songName;
    scrapedSong.currentTime = currentTime;
    scrapedSong.durationTime = durationTime;
  }
}
scrapedSong;
