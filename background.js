chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action == "getSong") {
    postData('http://localhost:4242/api/song', JSON.parse(request.source));
  }
});

chrome.browserAction.onClicked.addListener(() => {
  console.log('clicked');
  findTab().then((tab) => {

    const body = {
      url: tab.url
    };

    tab.title.split(' | ').map((chunk, index, chunks) => {
      if(index === 0) {
        if(chunk.indexOf('▶︎') > -1) {
          chunk = chunk.substring(3);
        }
        body.album = chunk;
      } else if(index === chunks.length - 1) {
        body.artist = chunk;
      }
    });

    postData('http://localhost:4242/api/album', body).then((result) => {
      console.log('send success');
    }).catch((error) => {
      console.log('send failure');
    });

    chrome.tabs.executeScript(tab.id, {
      file: 'get-song-name.js'
    })

  }).catch(error => {
    console.log('something has gone terribly wrong', error)
  });

  
});

function findTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({
      audible: true,
    }, (tabs) => {
      console.log('query result: ', tabs);
  
      if(!tabs.length) {
        reject('Error: No audible tabs were found.');
        alert('Error: No audible tabs were found.');
        // return to prevent further alerts
        return;
      }
  
      let foundTab = false;
      tabs.map((tab) => {
        if(/bandcamp\.com/.test(tab.url) && !foundTab) {
          foundTab = true;
          alert(`${tab.title} - ${tab.url}`);
          console.log(`${tab.title} - ${tab.url}`);
          resolve(tab);
        }
      });
  
      if(!foundTab) {
        reject('Error: No bandcamp tabs were found.')
        alert('Error: No bandcamp tabs were found.');
      }
    });
  })
  
}

// from: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
const postData = (url = ``, data = {}) => {
  // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, same-origin, *omit
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        redirect: "follow", // manual, *follow, error
        referrer: "no-referrer", // no-referrer, *client
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
    .then(response => response.json()) // parses response to JSON
    .catch(error => console.error(`Fetch Error =\n`, error));
};