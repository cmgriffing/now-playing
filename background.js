let enabled = false;

//INFER YOUTUBE currentTimeApprox WITH GLOBALS
var currentSong = "";
var currentSongTime = "";
var startingTimer = Date();

chrome.browserAction.onClicked.addListener(() => {
  if (!enabled) {
    enabled = true;
    chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
    chrome.browserAction.setBadgeText({ text: 'rec' });
  } else {
    enabled = false;
    chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
    chrome.browserAction.setBadgeText({ text: '' });
  }
});

setInterval(() => {
  if (!enabled) {
    return;
  }
  //console.log('clicked');
  findTab()
    .then(tab => {
      const body = {
        url: tab.url,
      };
      if(/bandcamp\.com/.test(body.url)){
        console.log(tab.title);
        tab.title.split(' | ').map((chunk, index, chunks) => {
          if (index === 0) {
            if (chunk.indexOf('▶︎') > -1) {
              chunk = chunk.substring(3);
            }
            body.album = chunk;
          } else if (index === chunks.length - 1) {
            body.artist = chunk;
          }
        });
        // postData('http://localhost:4242/api/album', body)
        // .then(result => {
        //   console.log('send success');
        // })
        // .catch(error => {
        //   console.log('send failure');
        // });
        chrome.tabs.executeScript(
          tab.id,
          {
            file: 'get-song-name.js',
          },
          scrapedSong => {
            console.log('scrapedSong', scrapedSong);
            if (scrapedSong[0]) {
                body.songName = scrapedSong[0].songName;
                body.songNumber = scrapedSong[0].songNumber;
                body.artist = scrapedSong[0].artistName;
                body.songURL = scrapedSong[0].songURL!==undefined?scrapedSong[0].songURL:scrapedSong[0].albumURL;
                body.origin = scrapedSong[0].origin;
                body.domain = scrapedSong[0].domain;
                body.album = scrapedSong[0].album; 
                body.albumURL = scrapedSong[0].albumURL 
                body.artistURL = scrapedSong[0].artistURL //* potentially empty string
                postData('http://localhost:4242/api/song', body);
                
            }
          }
        );
      }
      if(/open\.spotify\.com/.test(body.url)){
        console.log(tab.title);
        tab.title.split(' · ').map((chunk, index, chunks) => {
          if (index === 0) {
            body.songName = chunk;
          } else if (index === chunks.length - 1) {
            body.artist = chunk;
          }
        });
        // postData('http://localhost:4242/api/album', body)
        // .then(result => {
        //   console.log('send success');
        // })
        // .catch(error => {
        //   console.log('send failure');
        // });
        chrome.tabs.executeScript(
          tab.id,
          {
            file: 'get-spotify-info.js',
          },
          scrapedSong => {
            console.log('scrapedSong', scrapedSong);
            if (scrapedSong[0]) {
                body.songName = scrapedSong[0].songName;
                body.albumURL = scrapedSong[0].albumURL;
                body.artist = scrapedSong[0].artistString;
                body.artistArray = scrapedSong[0].artistArray
                body.currentTime = scrapedSong[0].currentTime;
                body.durationTime = scrapedSong[0].durationTime;
                body.origin = scrapedSong[0].origin;
                body.domain = scrapedSong[0].domain;
                body.album = scrapedSong[0].albumName; //* potentially empty string
                body.albumDate = scrapedSong[0].playlistPublishDate; //* potentially empty string
                body.albumTotal = scrapedSong[0].playlistTotal; //* potentially empty string
                body.songNumber = scrapedSong[0].songNumber; //* potentially empty string
    
                postData('http://localhost:4242/api/song', body);
            }
          }
        );
      }
      if(/youtube\.com/.test(tab.url)) {
        console.log(tab.title);
        tab.title.split(' - ').map((chunk, index, chunks) => {
          if (index === 0) {
            body.songName = chunk;
          } else if (index === chunks.length - 1) {
            body.origin = chunk;
          }
        });
        // postData('http://localhost:4242/api/album', body)
        // .then(result => {
        //   console.log('send success');
        // })
        // .catch(error => {
        //   console.log('send failure');
        // });
        var config = {"startingTimer":startingTimer,"currentSongURL":tab.url,"currentSongTime":currentSongTime,"currentSong":currentSong};
        chrome.tabs.executeScript(tab.id, {
          code: 'var config = ' + JSON.stringify(config)
        }, 
        function() {
          chrome.tabs.executeScript(tab.id, {file: 'get-youtube-info.js'}, 
          scrapedSong => {
            console.log('scrapedSong', scrapedSong);
            if (scrapedSong[0]) {
              body.songName = scrapedSong[0].currentSongApprox!==undefined?scrapedSong[0].currentSongApprox:scrapedSong[0].songName; //USE APPROX UNLESS EMPTY
              body.views = scrapedSong[0].views;
              body.videoType = scrapedSong[0].type;
              body.durationTime = scrapedSong[0].durationTime;
              body.currentTimeSeconds = scrapedSong[0].currentTimeSeconds;
              body.origin = scrapedSong[0].origin;
              body.domain = scrapedSong[0].domain;
              if(currentSong == scrapedSong[0].songName && currentSongTime == scrapedSong[0].currentTime){
              
              }else {
                currentSong = scrapedSong[0].songName;
                currentSongTime = scrapedSong[0].currentTime;
                startingTimer = new Date();
              }
              postData('http://localhost:4242/api/song', body);
            }
          });
        }); 
      }
    })
    .catch(error => {
      console.log('something has gone terribly wrong', error);
      var noBody = {};
      noBody.origin = "NONE";
      postData('http://localhost:4242/api/song', noBody);
    });
}, 5000);

function findTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        audible: true,
      },
      tabs => {
        //console.log('query result: ', tabs);
        if (!tabs.length) {
          reject('Error: No audible tabs were found.');
          //alert('Error: No audible tabs were found.');
          // return to prevent further alerts
          return;
        }
        let foundTab = false;
        var tabArray = Array();
        tabs.map(tab => {
          if (/bandcamp\.com/.test(tab.url) && !foundTab) {
            foundTab = true;
            //alert(`${tab.title} - ${tab.url}`);
            //console.log(`${tab.title} - ${tab.url}`);
            resolve(tab);
          }
          if(/youtube\.com/.test(tab.url) && !foundTab){
            foundTab = true;
            //alert(`${tab.title} - ${tab.url}`);
            //console.log(`${tab.title} - ${tab.url}`);
            resolve(tab);
          }
          if(/open\.spotify\.com/.test(tab.url) && !foundTab){
            foundTab = true;
            //alert(`${tab.title} - ${tab.url}`);
            //console.log(`${tab.title} - ${tab.url}`);
            resolve(tab);
          }
        });
        if (!foundTab) {
          reject('Error: No bandcamp tabs were found.');
          //alert('Error: No bandcamp tabs were found.');
        }
      }
    );
  });
}


// from: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
const postData = (url = ``, data = {}) => {
  // Default options are marked with *
  return fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, cors, *same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, same-origin, *omit
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      //'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then(response => {}) // parses response to JSON
    .catch(error => console.error(`Fetch Error =\n`, error));
};
