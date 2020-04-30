var server = document.getElementById('server')
var save = document.getElementById('save')
let snippets = document.getElementById('snippets')

//GET CHROME STORAGE DATA
chrome.storage.sync.get('config', function(data){
    if (!data.config){
        buildForm()
        return
    }
    if (!data.config.snippets){
        let bandcamp  = "We are currently listening to ${songName} by ${artist} on ${origin}. It is track #${songNumber} on ${album}. You can find the album here: ${albumURL}.* Here's a link to the artist's page: ${artistURL}*";
        let bo = "${url} ${artist} ${songName} ${album} ${albumURL} ${songNumber} ${songURL}  ${image} ${mediaType} ${domain} ${origin}<br> *MAY-NOT-EXIST: ${artistURL}"
        
        let youtube = "We are currently listening to ${songName}* by ${artist}* on ${origin}. You can find the song/video here: ${songURL}";
        let yto = "${url} ${songName} ${views}  ${image} ${mediaType} ${currentTime} ${durationTime} ${origin} ${domain}<br> *MAY-NOT-EXIST: ${artist} ${songURL} ${playlistName} ${songNumber} ${playlistTotal} ${playlistURL}"
        
        let spotify = "We are currently listening to ${songName} by ${artist} on ${origin}. It is on the album ${album}.* The album released ${albumDate}.* You can find the album here: ${albumURL}.";
        let so = "${url} ${songName} ${albumURL} ${image} ${currentTime} ${durationTime} ${mediaType} ${domain} ${origin}<br> *MAY-NOT-EXIST: ${album} ${albumDate} ${playlistTotal} ${songNumber}"
        data.config.snippets = [
            {"name": "BANDCAMP", "code": bandcamp, "enabled":true, "options":bo},
            {"name": "SPOTIFY", "code": spotify, "enabled":true, "options":so},
            {"name": "YOUTUBE", "code": youtube, "enabled":true, "options":yto}
        ] 
    }
    server.value = data.config.server || 'localhost:4242'
    //token.value = data.config.token || 'notoken'
    data.config.snippets.map(s => {
        snippets.appendChild(snippetTemplate(s))
    })
})

//SETUP OPTIONS SETTINGS
function buildForm(){
    let bandcamp  = "We are currently listening to ${songName} by ${artist} on ${origin}. It is track #${songNumber} on ${album}. You can find the album here: ${albumURL}.* Here's a link to the artist's page: ${artistURL}*";
    let bo = "${url} ${artist} ${songName} ${album} ${albumURL} ${songNumber} ${songURL}  ${image} ${mediaType} ${domain} ${origin}<br> *MAY-NOT-EXIST: ${artistURL}"
    
    let youtube = "We are currently listening to ${songName}* by ${artist}* on ${origin}. You can find the song/video here: ${songURL}";
    let yto = "${url} ${songName} ${views}  ${image} ${mediaType} ${currentTime} ${durationTime} ${origin} ${domain}<br> *MAY-NOT-EXIST: ${artist} ${songURL} ${playlistName} ${songNumber} ${playlistTotal} ${playlistURL}"
    
    let spotify = "We are currently listening to ${songName} by ${artist} on ${origin}. It is on the album ${album}.* The album released ${albumDate}.* You can find the album here: ${albumURL}.";
    let so = "${url} ${songName} ${albumURL} ${image} ${currentTime} ${durationTime} ${mediaType} ${domain} ${origin}<br> *MAY-NOT-EXIST: ${album} ${albumDate} ${playlistTotal} ${songNumber}"
    snip = [
        {"name": "BANDCAMP", "code": bandcamp, "enabled":true, "options":bo},
        {"name": "SPOTIFY", "code": spotify, "enabled":true, "options":so},
        {"name": "YOUTUBE", "code": youtube, "enabled":true, "options":yto}
    ] 
    snip.map(s => {
        snippets.appendChild(snippetTemplate(s))
    })
}

//SAVE OPTIONS
save.addEventListener('click', function(){
    //onsave
    let snipData = [...snippets.querySelectorAll('div.snippet')].map(el => {
        return {
            "name": el.querySelector('.name').innerHTML,
            "code": el.querySelector('.code').value,
            "options": el.querySelector('.options').innerHTML,
            "enabled" : el.querySelector('.enabled').checked,
        } 
    }).filter(s => s.name && s.code)
    chrome.storage.sync.set({config: {
        "server": server.value,
        "snippets": snipData,
    }}, function(){
        save.innerText = 'Saved!'
        setTimeout(() => {
            save.innerText = 'Save'
        }, 1000)
    })
})

//SETUP OPTIONS FORM
function snippetTemplate(data){
    let dp = new DOMParser()
    let snippet = dp.parseFromString(`
        <div class=snippet>
            <div> 
                <h3 class=name></h3>
                <label><input type="checkbox" class=enabled>Enabled</label> 
            </div>
            <span class=options></span>
            <textarea class=code></textarea>
            
        </div>
    `, 'text/html')
    snippet.querySelector('.name').innerHTML = data.name
    snippet.querySelector('.code').value = data.code
    snippet.querySelector('.options').innerHTML = data.options
    snippet.querySelector('.enabled').checked = data.enabled
    return snippet.querySelector('.snippet')
}
