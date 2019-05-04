scrapedSong = {};

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

scrapedSong;
