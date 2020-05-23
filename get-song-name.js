scrapedSong = {};

if(document.querySelectorAll('.trackView').length>0){
  Array.from(document.querySelectorAll('.track_row_view')).map(row => {
    if (row.querySelector('.playing')) {
      const songName = row.querySelector('.title a span').innerHTML;
      const songNumber = row
        .querySelector('.track_number')
        .innerHTML.replace('.', '');

      scrapedSong.songName = songName;
      scrapedSong.songNumber = songNumber;
    }
  });

  if (!scrapedSong.songName) {
    scrapedSong.songName = document.querySelector('.trackTitle').innerHTML.trim();
  }
  

  Array.from(document.querySelectorAll('#name-section h3')).map(row => {
    if (row.querySelector('span a span')) {
      const artistName = row.querySelector('span a span');
      scrapedSong.artist = artistName.innerHTML;
    } else if (row.querySelector('span a')) {
      const artistName = row.querySelector('span a');
      scrapedSong.artist = artistName.innerHTML;
    }
  });

  if (document.querySelector('span.fromAlbum')) {
    scrapedSong.albumName = document.querySelector('span.fromAlbum').innerHTML;
    scrapedSong.albumURL = document.querySelector('h3.albumTitle span a').href;
  }else if(document.querySelector('h2.trackTitle')!==undefined){
    var album = document.querySelector('h2.trackTitle').innerHTML.trim();
    scrapedSong.albumName = album;
    scrapedSong.albumURL = window.location.href;
  }
}
scrapedSong;
