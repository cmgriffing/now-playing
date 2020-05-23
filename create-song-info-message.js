module.exports = function createSongInfoMessage(song) {

  let message = ``;

  if (song.songName && song.artistName) {
    message += `cmgriffing is currently listening to ${song.songName} by ${
      song.artistName
    }.`;
  }

  if (song.songNumber && song.albumName) {
    message += ` It is track #${song.songNumber} on ${song.albumName}.`;
  } else if (song.albumName) {
    message += ` It is a track from the album ${song.albumName}.`;
  }

  if (song.albumURL) {
    message += ` You can find the album here: ${song.albumURL}`;
  }
  return message;
};
