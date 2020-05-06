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
  Array.from(document.querySelectorAll('#name-section h3')).map(row => {
    if (row.querySelector('span a')) {
      const artistName = row.querySelector('span a');
      scrapedSong.artist = artistName.innerHTML;
    }
  });
  if(document.querySelector('h2.trackTitle')!==undefined){
    var album = document.querySelector('h2.trackTitle').innerHTML.trim();
    scrapedSong.albumName = album;
    scrapedSong.albumURL = window.location.href;
  }
}
scrapedSong;
