let enabled = false;

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
  console.log('clicked');
  findTab()
    .then(tab => {
      const body = {
        url: tab.url,
      };
      
      chrome.tabs.executeScript(
        tab.id,
        {
          file: 'get-song-name.js',
        },
        scrapedSong => {
          console.log('scrapedSong', scrapedSong);
          if (scrapedSong[0]) {
            postData('http://localhost:4242/api/song', scrapedSong[0]);
          }
        }
      );
    })
    .catch(error => {
      console.log('something has gone terribly wrong', error);
    });
}, 5000);

function findTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query(
      {
        audible: true,
      },
      tabs => {
        console.log('query result: ', tabs);

        if (!tabs.length) {
          reject('Error: No audible tabs were found.');
          alert('Error: No audible tabs were found.');
          // return to prevent further alerts
          return;
        }

        // setup bandcamp custom domains checker
        const customDomain = tab =>{
          return new Promise((resolve, reject) => {
            chrome.tabs.executeScript(tab.id, {file: 'check-bandcamp-dom.js'},
            bcDOM => {
              console.log(bcDOM[0])
              if(bcDOM[0].bandcamp){
                console.log('bandcamp custom:', tab.title)
                resolve(tab);
              } else {
                resolve(false)
              }
            }) 
          })
        }

        //create promise array
        let promises = []
        tabs.map( tab => {
          if (/bandcamp\.com/.test(tab.url)) {
            promises.push(tab)
          } else {
            promises.push(customDomain(tab))
            //check for bandcamp generated custom domains
          }
        })
        
        //check promises for allowed domains and resolve tab if found or alert/reject if none
        Promise.all(promises).then((result)=>{
          let foundTab = false;
          result.map(value=>{
            if(value){
              foundTab = true;
              resolve(value);
            }
          });
          if (!foundTab) {
            reject('Error: No bandcamp tabs were found.');
            alert('Error: No bandcamp tabs were found.');
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
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then(response => {}) // parses response to JSON
    .catch(error => console.error(`Fetch Error =\n`, error));
};
