scrapedSong = {};

// Bandcamp singles && album pages
// example album: https://lorn.bandcamp.com/album/the-maze-to-nowhere
// example single: https://lorn.bandcamp.com/track/acid-rain
if (document.querySelectorAll(".trackView").length > 0) {
  // Bandcamp album page
  Array.from(document.querySelectorAll(".track_row_view")).map((row) => {
    if (row.querySelector(".playing")) {
      const songName = row.querySelector(".title a span").innerHTML;
      const songNumber = row
        .querySelector(".track_number")
        .innerHTML.replace(".", "");

      scrapedSong.songName = songName;
      scrapedSong.songNumber = songNumber;
    }
  });

  // Bandcamp single/track page
  const trackTitle = document.querySelector(".trackView .trackTitle");

  if (!scrapedSong.songName && trackTitle) {
    scrapedSong.songName = trackTitle.innerHTML.trim();
  }

  Array.from(document.querySelectorAll("#name-section h3")).map((row) => {
    const artistNameLink = row.querySelector("span a");
    if (artistNameLink) {
      scrapedSong.artistName = artistNameLink.textContent;
    }
  });

  if (trackTitle) {
    const album = trackTitle.textContent.trim();
    scrapedSong.albumName = album;
    scrapedSong.albumUrl = window.location.href;
  }
}
scrapedSong;
