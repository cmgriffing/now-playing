let button = document.getElementById('enabled');
let message = document.getElementById('message');
let options = document.getElementById('options');
let body = document.getElementById('popup');
let artist = document.getElementById('artist');
let songName = document.getElementById('song-name');
let songOrigin = document.getElementById('song-origin');
let enabled = false

//CHECK IF OPTIONS ARE SETUP
chrome.storage.sync.get('config', function(data){
    if (!data.config ){
        options.innerHTML="Make sure to setup your <a href='/options.html' target=_blank>Options Page</a>.";
        return
    }
});

//GET PLUGIN ON/OFF STATUS
chrome.storage.sync.get('enabled', function(data){
    enabled = data.enabled
    button.checked = enabled==true?true:false;
    //message.innerText =enabled==true?"ON":"OFF";
    console.log("enabled:",enabled)
    if (enabled==true) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({ text: 'rec' });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
        chrome.browserAction.setBadgeText({ text: '' });
    }
})

//IF ON/OFF SWITCH CLICKED
button.addEventListener('click', function(e){
    console.log("button:",button.checked)
    chrome.storage.sync.set({"enabled": 
        button.checked?true:false
    }, function(){
        console.log('saved',button.checked?true:false)
        //message.innerText = button.checked?"ON":"OFF";
    })
    enabled = button.checked?true:false
    if (enabled) {
        chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
        chrome.browserAction.setBadgeText({ text: 'rec' });
    } else {
        chrome.browserAction.setBadgeBackgroundColor({ color: [0, 0, 0, 0] });
        chrome.browserAction.setBadgeText({ text: '' });
    }
});

//SETUP POPUP
function setupPopup(){
    var bg = chrome.extension.getBackgroundPage();
    var song = bg.song;
    console.log("song:",song)
    if(Object.keys(song).length !==0){
        if(song.image!==undefined){
            body.style.backgroundImage = "url("+song.image+")";
            body.style.backgroundPosition = "center";
            body.style.backgroundSize = "cover";
        }
        if(song.songName!== undefined){
            songName.innerText = song.songName
        }
        if(song.artist!== undefined || song.artist == ''){
            artist.innerText = song.artist
        } else if (song.origin == "YOUTUBE"){
            artist.innerText = song.channelName
        }else {
            artist.innerText = ""
        }
        songOrigin.innerText = song.origin;
    } else {
        artist.innerText = ""
        songName.innerText = "No Audio Found"
        body.style.backgroundImage = ""
        songOrigin.innerText = "";
    }
}

setupPopup();
setInterval(() => {
    setupPopup();
},2000);
