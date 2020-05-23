scrapedSong = {};

if (document.querySelectorAll(".trackView").length > 0) {
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

  if (!scrapedSong.songName) {
    scrapedSong.songName = document
      .querySelector(".trackTitle")
      ?.innerHTML.trim();
  }

  // console.log(document.querySelectorAll('#name-section h3'));

  Array.from(document.querySelectorAll("#name-section h3")).map((row) => {
    let artistName = row.children[1]?.querySelector("span a").innerHTML;

    if (!artistName) {
      artistName = row.children[0]?.querySelector("span a").innerHTML;
    }

    if (artistName) {
      scrapedSong.artistName = artistName;
    }
  });

  

  if (document.querySelector("span.fromAlbum")) {
    scrapedSong.albumName = document.querySelector("span.fromAlbum").innerHTML;
    scrapedSong.albumURL = document.querySelector("h3.albumTitle span a").href;
  } else if (document.querySelector("h2.trackTitle") !== undefined && document.querySelector(".track_row_view")?.parentElement.children.length !== 1) {
    var album = document.querySelector("h2.trackTitle").innerHTML.trim();
    scrapedSong.albumName = album;
    scrapedSong.albumURL = window.location.href;
  } else {
    scrapedSong.albumURL = window.location.href;
  }
}
scrapedSong;
