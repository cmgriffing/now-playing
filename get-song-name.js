//BANDCAMP  Supports: Album Pages on Custom Domains
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
  let imager = document.querySelector('.trackView .middleColumn #tralbumArt a img').src;
  scrapedSong.image = imager;
}
scrapedSong;