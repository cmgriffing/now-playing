let enabled = false;
//GLOBALS FOR YOUTUBE currentTimeApprox
var currentSong = "";
var currentSongTime = "";
var startingTimer = Date();
var song = {}

//CREATE CHATBOT LINE FROM OPTIONS AND AVAILABLE INFO
async function processmatches() {
  chrome.storage.sync.get('config', function(data){
    if (!data.config || !data.config.snippets || data.config.snippets.length < 1){
      return
    }
    //SEARCH FOR OPTIONS HOOKS AND CREATE OUTPUT
    data.config.snippets.map(s => {
      if (s.name == song.origin){
        song.songName = song.songName.replace(/&amp;/g, '&');
        if(song.artist !== undefined){
          song.artist = song.artist.replace(/&amp;/g, '&');
        }
        var matching = {
          "url":song.url,
          "songName" : song.songName,
          "songNumber": song.songNumber || "",
          "artist":song.artist,
          "songURL":song.songURL,
          "origin":song.origin,
          "domain":song.domain,
          "album":song.album,
          "albumURL":song.albumURL,
          "artistURL":song.artistURL,
          "currentTime":song.currentTime||"",
          "currentTimeSeconds":song.currentTimeSeconds||"",
          "durationTime":song.durationTime || "",
          "mediaType":song.mediaType||"",
          "videoName":song.videoName||"",
          "views":song.views||"",
          "albumDate":song.albumDate || "",
          "playlistTotal":song.playlistTotal||"",
          "playlistURL":song.playlistURL||"",
          "playlistName":song.playlistName||"",
          "channelName":song.channelName||"",

        }
        var ifmatches = s.code.matchAll(/\*[\s\S]{0,}\$\{[a-zA-Z]{1,}\}[\s\S]{0,}\*/g);
        var matches = s.code.matchAll(/\$\{[a-zA-Z]{1,}\}/g);
        //FIND HOOKS WRAPPED IN ** - TREAT AS IF(VARIABLES ARE NOT EMPTY OR UNDEFINED) THEN DISPLAY TEXT
        for(const ifmatch of ifmatches){
          var ifmatchEdit = ifmatch[0]
          let ifmatchHook = ifmatch[0].matchAll(/\$\{[a-zA-Z]{1,}\}/g);
          for(const matcher of ifmatchHook){
            let val = matcher[0]
            let key = val.substring(2,val.length-1)
            if (key in matching){
              if(matching[key] != undefined && matching[key] != ''){
                ifmatchEdit = ifmatchEdit.replace(matcher,matching[key])
                ifmatchEdit = ifmatchEdit.substring(1,ifmatchEdit.length-1)
              } else {
                ifmatchEdit = ""
                s.code = s.code.replace(ifmatch[0],'')
              }
            }
          }
          s.code = s.code.replace(ifmatch[0],ifmatchEdit)
        }
        //REPLACE HOOKS WITH VARIABLE
        for (const match of matches){
          let val = match[0]
          let key = val.substring(2,val.length-1)
          if (key in matching){
            if(matching[key] != undefined && matching[key] != ''){
              s.code = s.code.replace(val,matching[key])
            } else {
              s.code = s.code.replace(val,'')
            }
          }
        }
        song.mess = s.code
        postData('http://'+data.config.server+'/api/song', song);
      }
    })
  })
}

setInterval(() => {
  chrome.storage.sync.get('enabled', function(data){
    enabled = data.enabled==true?true:false; 
  });
  if (enabled==false) {
    song = {}
    return;
  }
  findTab()
    .then(tab => {
      const body = {
        url: tab.url,
      };
      if(/open\.spotify\.com/.test(body.url)){
        chrome.tabs.executeScript(
          tab.id,
          {
            file: 'get-spotify-info.js',
          },
          scrapedSong => {
            if (scrapedSong[0]) {
              song = scrapedSong[0]
              song.url = body.url;
              processmatches()
            }
          }
        );
      }else if(/youtube\.com/.test(tab.url)) {
        //PASS PERSISTENT VARIABLES TO KEEP TRACK OF currentTime BECASUE VIDEO CLOCK IS NOT UDATED ON INACTIVE TABS
        var config = {"startingTimer":startingTimer,"currentSongURL":tab.url,"currentSongTime":currentSongTime,"currentSong":currentSong};
        chrome.tabs.executeScript(tab.id, {
          code: 'var config = ' + JSON.stringify(config)
        }, 
        function() {
          chrome.tabs.executeScript(tab.id, {file: 'get-youtube-info.js'}, 
          scrapedSong => {
            if (scrapedSong[0]) {
              song = scrapedSong[0]
              //FINAL FORMATTING
              song.url = body.url;
              //IF currentSongApprox EXISTS, USE IT ELSE, USE VIDEO NAME
              song.songName = scrapedSong[0].currentSongApprox!==undefined&&scrapedSong[0].currentSongApprox!==''?scrapedSong[0].currentSongApprox:scrapedSong[0].videoName; //USE APPROX UNLESS EMPTY
              //IF artistNameApprox EXISTS, USE IT OR ELSE USE ARTIST NAME
              song.artist = scrapedSong[0].artistNameApprox!==undefined&&scrapedSong[0].artistNameApprox!==''?scrapedSong[0].artistNameApprox:scrapedSong[0].artist;
              //IF CHANNELNAME IN SONG TITLE, ASSUME ITS ARTIST NAME
              if(song.songName.match(song.channelName)){
                song.artist = channelName;
              }
              //IF ARTIST NAME IN SONG NAME, REMOVE FROM SONG NAME
              if(song.artist !== undefined && song.artist !== '' && song.songName.includes(song.artist)){
                var re = new RegExp("[-]{0,}[\\s]{0,}("+song.artist+")[\\s]{0,}[-]{0,}", "gi");
                song.songName = song.songName.replace(re, "");
                song.songName = song.songName.trim();
              }
              //UPDATE GLOBALS FOR currentTimeApprox
              if(currentSong != scrapedSong[0].videoName || currentSongTime != scrapedSong[0].currentTime){
                currentSong = scrapedSong[0].videoName;
                currentSongTime = scrapedSong[0].currentTime;
                startingTimer = new Date();
              }
              processmatches()
            }
          });
        }); 
      } else if(/bandcamp\.com/.test(body.url)){
        //presumable bandcamp.com or custom domain to bandcamp
        var link = document.createElement("a");
        link.href = body.url;
        chrome.tabs.executeScript(
          tab.id,
          {
            file: 'get-bandcamp-info.js',
          },
          scrapedSong => {
            if (scrapedSong[0]) {
              song = scrapedSong[0]
              song.url = body.url;
              song.songURL = scrapedSong[0].songURL!==undefined?scrapedSong[0].songURL:scrapedSong[0].albumURL;
              //GET OUTPUT STRUCTURE FROM CHROME EXTENSION OPTIONS
              processmatches()
            }
          }
        );
      } else {
        //presumably custom subdomain to bandcamp
        var link = document.createElement("a");
        link.href = body.url;
        chrome.tabs.executeScript(
          tab.id,
          {
            file: 'get-song-name.js',
          },
          scrapedSong => {
            if (Object.keys(scrapedSong[0]).length>3) {
              song = scrapedSong[0]
              song.url = body.url;
              song.songURL = scrapedSong[0].songURL!==undefined?scrapedSong[0].songURL:scrapedSong[0].albumURL;
              //GET OUTPUT STRUCTURE FROM CHROME EXTENSION OPTIONS
              processmatches()
            }
          }
        );
      }
    })
    .catch(error => {
      song = {}
      chrome.storage.sync.get('config', function(data){
        if (!data.config){
            console.log('No Options Set');
          return
        }
        //SEARCH FOR HOOKS AND CREATE OUTPUT
        console.log('something has gone terribly wrong', error);
        var noBody = {"error":error};
        noBody.origin = "NONE";
        postData('http://'+data.config.server+'/api/song', noBody);
      });
    });
}, 5000);
async function customDomainChecker(tab){
  //ELSE IF BANDCAMP RESOLVE, ELSE IGNORE
  chrome.tabs.executeScript(
   tab.id,
   {
     file: 'get-song-name.js',
   },
   scrapedSong => {
     if(Object.keys(scrapedSong[0]).length>3){
       return true
     } else {
     }
   });
 return false
}
function findTab() {
  
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        audible: true,
      },
      tabs => {
        if (!tabs.length) {
          reject('Error: No audible tabs were found.');
          //alert('Error: No audible tabs were found.');
          // return to prevent further alerts
          return;
        }
        chrome.storage.sync.get('config', function(data){
          if (!data.config){
            return
          }
          let foundTab = false;
          var tabArray = Array();
          tabs.map(tab => {
            if(/youtube\.com/.test(tab.url) && !foundTab){
              data.config.snippets.map(s => {
                if (s.name == 'YOUTUBE'){
                  if (s.enabled){
                    foundTab = true;
                    resolve(tab);
                  } else {
                    reject('Sorry, cannot get current song info.');
                  }
                } 
              });
            }else if(/open\.spotify\.com/.test(tab.url) && !foundTab){
              data.config.snippets.map(s => {
                if (s.name == 'SPOTIFY'){
                  if (s.enabled){
                    foundTab = true;
                    resolve(tab);
                  } else {
                    reject('Sorry, cannot get current song info.');
                  }
                }
              });
            } else if (/bandcamp\.com/.test(tab.url) && !foundTab) {
              data.config.snippets.map(s => {
                if (s.name == 'BANDCAMP'){
                  if (s.enabled){
                    foundTab = true;
                    resolve(tab);
                  } else {
                    reject('Sorry, cannot get current song info.');
                  }
                }
              });
            } else {
              data.config.snippets.map(s => {
                if (s.name == 'BANDCAMP'){
                  if (s.enabled){
                    //ELSE IF BANDCAMP RESOLVE, ELSE IGNORE
                    let resTab = customDomainChecker(tab)
                    if(resTab){
                      foundTab = true;
                      resolve(tab);
                    }
                  } else {
                    reject('Sorry, cannot get current song info.');
                  }
                }
              });
            }
          });
          if (!foundTab) {
            song = {}
            reject('Error: No tabs were found.');
            //alert('Error: No bandcamp tabs were found.');
          }
        });
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
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then(response => {}) // parses response to JSON
    .catch(error => console.error(`Fetch Error =\n`, error));
};

//CREATE POPUP
chrome.runtime.onInstalled.addListener(function(){
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
      chrome.declarativeContent.onPageChanged.addRules([{
          conditions: [new chrome.declarativeContent.PageStateMatcher({
          })],
          actions: [new chrome.declarativeContent.ShowPageAction()]
      }]) 
  })
})
