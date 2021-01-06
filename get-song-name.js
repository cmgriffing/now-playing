scrapedSong = {};

// Bandcamp singles && album pages
// example album: https://lorn.bandcamp.com/album/the-maze-to-nowhere
// example single: https://lorn.bandcamp.com/track/acid-rain
if (document.querySelectorAll('.trackView').length > 0) {
  // Bandcamp album page
  Array.from(document.querySelectorAll('.track_row_view')).map((row) => {
    if (row.querySelector('.playing')) {
      const songName = row.querySelector('.title a span').innerHTML;
      const songNumber = row
        .querySelector('.track_number')
        .innerHTML.replace('.', '');

      scrapedSong.songName = songName;
      scrapedSong.songNumber = songNumber;
    }
  });

  // Bandcamp single/track page
  const nameElement = document.querySelector('.trackTitle');
  
  if (!scrapedSong.songName && nameElement) {
    scrapedSong.songName = nameElement.innerHTML.trim();
  }

  Array.from(document.querySelectorAll('#name-section h3')).map(row => {
    const artistNameLink = row.querySelector('span a');
    if (artistNameLink) {
      scrapedSong.artistName = artistNameLink.textContent;
    }
  });

  
  const albumSong = document.querySelector('.track_row_view');
  

  if (document.querySelector('span.fromAlbum')) {
    scrapedSong.albumName = document.querySelector('span.fromAlbum').innerHTML;
    scrapedSong.albumURL = document.querySelector('h3.albumTitle span a').href;
  } else if (document.querySelector('h2.trackTitle') !== undefined && albumSong && albumSong.parentElement.children.length !== 1) {
    var album = document.querySelector('h2.trackTitle').innerHTML.trim();
    scrapedSong.albumName = album;
    scrapedSong.albumURL = window.location.href;
  } else {
    scrapedSong.albumURL = window.location.href;
  }
}
scrapedSong;
