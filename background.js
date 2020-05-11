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

        let foundTab = false;
        let unknownTabs = []
        // check domains against known
        tabs.map(tab => {
          if (/bandcamp\.com/.test(tab.url) && !foundTab) {
            foundTab = true;
            //alert(`${tab.title} - ${tab.url}`);
            console.log(`${tab.title} - ${tab.url}`);
            resolve(tab);
          } else if(!foundTab){
            unknownTabs.push(tab)
          }
        });

        /* 
        if unknown audible tabs found, run chrome.tabs.executeScript in a async loop
        resolve oldest Bandcamp tab (by tab.id) or reject/alert if nothing found
        */
       console.log(unknownTabs)
        if(unknownTabs.length){
          // setup unknownTabs async loop
          const loop = async (tabs) => {
            let result = null
            let index = 0;
            while (result == null && tabs.length - 1 >= index) {
              result = await checkBandcampDOM(tabs[index])
              if(result !== null && result !== undefined) {
                return tabs[index];
              } else {
                index++;
              }
            }
            return 'EMPTY'
          };

          // promise chrome.tabs.executeScript
          const checkBandcampDOM = tab =>
          new Promise((resolve,reject) => chrome.tabs.executeScript(
            tab.id,
            {
              file: 'check-bandcamp-dom.js',
            },
            scrapedSong => {
              if(scrapedSong[0].bandcamp){
                foundTab = true;
                resolve(foundTab)
              } else{
                reject('Not a custom Bandcamp Link')
              }
            })
          ).catch(error=>{
            console.log(tab.url,error)
          });
          
          // execute async loop & resolve if tab found or reject if none
          loop(unknownTabs).then((result)=>{
            if(result === 'EMPTY' && !foundTab){
              reject('Error: No bandcamps tabs were found.');
              alert('Error: No bandcamps tabs were found.');
            } else {
              resolve(result);
            }
          })
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
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
    .then(response => {}) // parses response to JSON
    .catch(error => console.error(`Fetch Error =\n`, error));
};
