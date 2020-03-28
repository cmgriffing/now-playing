setInterval(async () => {
  const fetchResult = await fetch('http://localhost:8293/api/album');
  const album = await fetchResult.json();
  console.log('album', album);
  if (!album.album || !album.artist) {
    return console.log('invalid album object');
  }

  document.querySelector('.album').innerHTML = album.album;
  document.querySelector('.artist').innerHTML = album.artist;
}, 5000);
