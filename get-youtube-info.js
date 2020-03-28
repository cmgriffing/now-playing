//YOUTUBE - Supports: Playlists, Entire Album VOD, Single Songs, and Live Videos
scrapedSong = {};
scrapedSong.domain = "youtube.com";
scrapedSong.origin = "YOUTUBE";
//RETURNS
    //--PLAYLIST DATA--
    // *scrapedSong.playlistName        (Could also be used as albumName)
    // *scrapedSong.playlistURL         (Could also be used as to albumURL)
    // *scrapedSong.songNumber          (Could also be used as to songNumber)
    // *scrapedSong.playlistTotal

    //--CURRENTLY PLAYING DATA--
    // scrapedSong.currentTime 
    // scrapedSong.currentTimeSeconds   (For creating URL with timestamp & calculating currentTimeApprox when tab is not active)
    // scrapedSong.durationTime 
    // scrapedSong.songName 
    // scrapedSong.type                 ("LIVE" || "VOD")
    // scrapedSong.views 
    // *scrapedSong.taggedInfo          (Songs Tagged & Licensed by Uploader)
    // *scrapedSong.artistNameApprox    (Assumes if 0 < Tagged&Licensed Music and all Tagged&Licensed Music is same then video is all same artist)
    // *scrapesSong.commentLinks        (Assumes 4 < timeStamped links in one comment are reliable tracklist info)
    // *scrapedSong.descriptionLinks    (Assumes 4 < timeStamped links in description are reliable tracklist info // also assumes descriptionLinks are more reliable than commentLinks)
   
    // APPROXIMATED BECAUSE INACTIVE YOUTUBE TABS DO NOT UPDATE currentTime (current play time) --
    // scrapedSong.currentTimeApprox     (if none then currentTime)
    // scrapedSong.currentSongApprox     (Approximated by commentLinks/descriptionLinks and currentTimeApprox, if none then v songName)
    // scrapedSong.songUrl               (url with Timestamp based on currentTimeApprox, if none then original video url)

//GET DEFAULT VIDEO NAME
if(document.querySelector('h1.ytd-video-primary-info-renderer')!==undefined){
    Array.from(document.querySelectorAll('h1.ytd-video-primary-info-renderer')).map(row => {
        if (row.querySelector('yt-formatted-string')) {
            const songName = row.querySelector('yt-formatted-string').innerHTML;
            scrapedSong.songName = songName;
        }
    });
}

//ACTUAL LINKED SONGS TAGGED BY UPLOADER
if(document.querySelector('ytd-metadata-row-container-renderer.ytd-video-secondary-info-renderer div#collapsible.ytd-metadata-row-container-renderer') !== undefined){
    var taggedMusic = Array();
    //SEARCH FOR ROW LABEL THEN PLACE IN TMP OBJECT
    var tmp = {};
    Array.from(document.querySelectorAll('ytd-metadata-row-container-renderer.ytd-video-secondary-info-renderer div#collapsible.ytd-metadata-row-container-renderer ytd-metadata-row-renderer.style-scope.ytd-metadata-row-container-renderer')).map(curRow => {
        var curRowLabel = curRow.querySelector('h4#title yt-formatted-string').innerHTML;
        //console.log(curRowLabel);
        if (curRowLabel == "Artist") {
            if(curRow.querySelector('#content yt-formatted-string.content a')){
                tmp.artistName = curRow.querySelector('#content yt-formatted-string.content a').innerHTML;
            } else {
                tmp.artistName = curRow.querySelector('#content yt-formatted-string.content').innerHTML;
            }
        } else if (curRowLabel == "Album"){
            if(curRow.querySelector('#content yt-formatted-string.content a')){
                tmp.albumName = curRow.querySelector('#content yt-formatted-string.content a').innerHTML;
            } else {
                tmp.albumName = curRow.querySelector('#content yt-formatted-string.content').innerHTML;
            }
        } else if (curRowLabel == "Song"){
            if(curRow.querySelector('#content yt-formatted-string.content a')){
                tmp.songName = curRow.querySelector('#content yt-formatted-string.content a').innerHTML;
            } else {
                tmp.songName = curRow.querySelector('#content yt-formatted-string.content').innerHTML;
            }
        } else if (curRowLabel == "Licensed to YouTube by"){
            if(curRow.querySelector('#content yt-formatted-string.content a')){
                tmp.labelName = curRow.querySelector('#content yt-formatted-string.content a').innerHTML;
            } else {
                tmp.labelName = curRow.querySelector('#content yt-formatted-string.content').innerHTML;
            }
            taggedMusic.push(tmp);
            tmp = {};
        }
    });
    scrapedSong.taggedInfo = taggedMusic;
    var tCount = taggedMusic.length;
    var sameCount = taggedMusic.filter((obj) => obj.artistName === taggedMusic[0].artistName).length;
    if(sameCount === tCount && tCount !== 0){
        scrapedSong.artistNameApprox = taggedMusic[0].artistName;
    }
} 

//GET VIDEO TYPE AND VIEW COUNT
var counter = document.querySelector('span.view-count').innerHTML;
if(counter.includes(' watching now') == true){
    //LIVE VIDEO
    scrapedSong.type = "LIVE";
    var viewCount = counter.replace(' watching now', '');
    scrapedSong.views = viewCount;
} else if(counter.includes(' views') == true) {
    //VOD
    scrapedSong.type = "VOD";
    var viewCount = counter.replace(' views', '');
    scrapedSong.views = viewCount;
}
//document.querySelector('#more').click();

//CURRENT TIME
var currentTime = document.querySelector('div.ytp-left-controls span.ytp-time-current').innerHTML;
if(currentTime.split(":").length==2){
    if(currentTime.split(":")[0].length == 1){
        currentTime = "0"+currentTime;
    }
    currentTime = "00:"+currentTime;
}
scrapedSong.currentTime = currentTime;
//CONVERT TO SECONDS
convertTimeStamp(currentTime);

//TRACK DURATION
var durationTime = document.querySelector('div.ytp-left-controls span.ytp-time-duration').innerHTML;
scrapedSong.durationTime = durationTime;

//PLAYLIST INFO
if(document.querySelector('ytd-playlist-panel-renderer#playlist')!==undefined){
    //PLAYLIST NAME AND URL
    var playlist = document.querySelector('ytd-playlist-panel-renderer#playlist.ytd-watch-flexy');
    if (playlist.querySelector('h3.ytd-playlist-panel-renderer')) {
        var row = document.querySelector('h3.ytd-playlist-panel-renderer');
        if (row.querySelector('yt-formatted-string.title a')) {
            var playlistName = row.querySelector('yt-formatted-string.title a').innerHTML;
            var playlistURL = row.querySelector('yt-formatted-string.title a').href;
            scrapedSong.playlistName = playlistName;
            scrapedSong.playlistURL = playlistURL;
        } else if (row.querySelector('yt-formatted-string.title')){
            var playlistName = row.querySelector('yt-formatted-string.title').innerHTML;
            scrapedSong.playlistName = playlistName;
            scrapedSong.playlistURL = window.location.href;
        }
        
    }
    //TRACK NUMBER AND PLAYLIST TOTAL
    if(playlist.querySelector('yt-formatted-string.index-message')!==undefined){
        //var trackArray = Array.from(document.querySelector('yt-formatted-string.index-message'));
        var playlistInfo = document.querySelector('yt-formatted-string.index-message');
        var playlistArray = playlistInfo.querySelectorAll('span');
        if (playlistArray.length>0){
            scrapedSong.trackArray = playlistArray;
            var songNumber = playlistArray[0].innerHTML;
            scrapedSong.songNumber = songNumber;
            var playlistTotal = playlistArray[2].innerHTML;
            scrapedSong.playlistTotal = playlistTotal;
        }
    }
}

//GET LIST OF TIMESTAMP LINKS & INFO FROM DESCRIPTION AND APPROXIMATE currentSongApprox
if(document.querySelector('#description.ytd-video-secondary-info-renderer yt-formatted-string.ytd-video-secondary-info-renderer a[href*="&t="].yt-formatted-string')!==undefined){
    var descriptionMusic = []
    Array.from(document.querySelectorAll('#description.ytd-video-secondary-info-renderer yt-formatted-string.ytd-video-secondary-info-renderer')).map(row => {
        var nodeRef = 'yt-formatted-string.ytd-video-secondary-info-renderer a[href*="&t="].yt-formatted-string';
        var timeLinks = patternMatchTimeNodes(row,nodeRef);
        if (timeLinks.length > 0){
            descriptionMusic.push(timeLinks);
        }
    });
    scrapedSong.descriptionLinks = descriptionMusic;
}

//GET LIST OF TIMESTAMP LINKS & INFO FROM COMMENTS AND APPROXIMATE currentSongApprox
if(document.querySelector('#main.ytd-comment-renderer ytd-expander.ytd-comment-renderer div#content yt-formatted-string.ytd-comment-renderer a[href*="&t="].yt-formatted-string')!==undefined){
    var commentMusic = []
    Array.from(document.querySelectorAll('#main.ytd-comment-renderer ytd-expander.ytd-comment-renderer div#content yt-formatted-string.ytd-comment-renderer')).map(row => {
        var nodeRef = 'yt-formatted-string.ytd-comment-renderer a[href*="&t="].yt-formatted-string';
        var timeLinks = patternMatchTimeNodes(row,nodeRef);
        if (timeLinks.length > 0){
            commentMusic.push(timeLinks);
        }
    });
    scrapedSong.commentLinks = commentMusic;
}

//IF TAB INACTIVE APPROXIMATE CURRENT TIME = currentTimeApprox & currentSongApprox
if(config.currentSong == scrapedSong.songName && config.currentSongTime == scrapedSong.currentTime){
    var seconds = (new Date() - Date.parse(config.startingTimer)) / 1000;
    //console.log(seconds,scrapedSong.currentTimeSeconds);
    var newCurTimeSeconds = scrapedSong.currentTimeSeconds + seconds;
    scrapedSong.currentTimeSecondsApprox = newCurTimeSeconds;
    var newCurrentTime = new Date(newCurTimeSeconds * 1000).toISOString().substr(11, 8);
    if(newCurrentTime.split(":")[0].length == 1){
        newCurrentTime = "0"+newCurrentTime;
    }
    scrapedSong.currentTimeApprox = newCurrentTime;
    if(scrapedSong.descriptionLinks[0]!==undefined) {
        const linkArray = scrapedSong.descriptionLinks[0].slice();
        var currTime = {"timeSong" : "newCurrentTime-Description","timeStamp":scrapedSong.currentTimeApprox};
        linkArray.push(currTime);
        //console.log(linkArray);
        linkArray.sort((a,b) => a.timeStamp.localeCompare(b.timeStamp));
        let indexer = linkArray.indexOf(currTime);
        let result = linkArray[indexer-1].timeSong;
        scrapedSong.currentSongApprox = result;
        //console.log("result",result);
    } else if(scrapedSong.commentLinks[0]!==undefined) {
        const linkArray = scrapedSong.commentLinks[0].slice();
        var currTime = {"timeSong" : "newCurrentTime-Comments","timeStamp":scrapedSong.currentTimeApprox};
        linkArray.push(currTime);
        linkArray.sort((a,b) => a.timeStamp.localeCompare(b.timeStamp));
        let indexer = linkArray.indexOf(currTime);
        let result = linkArray[indexer-1].timeSong;
        scrapedSong.currentSongApprox = result;
        //console.log("result",result);
    }
}

//BEGIN APPROXIMATE
if(config.startingTimer!==null){
    //INTIALIZE IF NOTHING
    scrapedSong.artistNameApprox = scrapedSong.artistNameApprox!==undefined?scrapedSong.artistNameApprox:"";
    scrapedSong.albumNameApprox = scrapedSong.albumNameApprox!==undefined?scrapedSong.albumNameApprox:scrapedSong.playlistName!==undefined?scrapedSong.playlistName:"";
    scrapedSong.playlistURL = scrapedSong.playlistURL!==undefined?scrapedSong.playlistURL:"";
    //albumNameApprox
    scrapedSong.songNumber = scrapedSong.songNumber!==undefined?scrapedSong.songNumber:"";

    //scrapedSong.currentSongApprox = scrapedSong.currentSongApprox!==undefined ?scrapedSong.currentSongApprox : scrapedSong.songName;
    scrapedSong.currentTimeApprox = scrapedSong.currentTimeApprox!==undefined ? scrapedSong.currentTimeApprox : scrapedSong.currentTime;
    //songURL
    var slug = config.currentSongURL.indexOf('&t=')===-1?config.currentSongURL:config.currentSongURL.substr(0,config.currentSongURL.indexOf('&t='));
    var timeStampURL = slug+'&t='+scrapedSong.currentTimeSecondsApprox+'s';
    scrapedSong.songURL = !isNaN(scrapedSong.currentTimeSecondsApprox)&&scrapedSong.currentTimeSecondsApprox!==undefined&&scrapedSong.currentTimeSecondsApprox>(4 * 60000)&&scrapedSong.type=="VOD"?timeStampURL:config.currentSongURL;
}
//END APPROXIMATE

//FIND PATTERN IN LIST OF TIMESTAMP LINKS FROM DESCRIPTION OR COMMENTS AND APPROXIMATE currentSongName
function patternMatchTimeNodes(timeNodes,nodeRef){
    //get all links with timestamps & check if range or single & check if line break or not
    var timeComments = [];
    Array.from(timeNodes.querySelectorAll(nodeRef)).map(linkNode => {
        //console.log(linkNode);
        var tmp = {}
        tmp.timeLink = linkNode.href;
        tmp.timeStamp = linkNode.innerHTML;
        if(tmp.timeStamp.split(":").length>1 && !isNaN(tmp.timeStamp.split(":")[0]) && !isNaN(tmp.timeStamp.split(":")[1])){
            var linkIndex = getNodeIndex(linkNode);
            if(linkNode.parentNode.childNodes[linkIndex+1]){
                var nextNode = linkNode.parentNode.childNodes[linkIndex+1].innerHTML;
                if(nextNode.trim() == "-"){
                    //RANGE TIMESTAMPS WITH "-" SPAN JOINING
                    var rangeEnd = linkNode.parentNode.childNodes[linkIndex+2].innerHTML;
                    
                    if(rangeEnd.includes("\n")){
                        //timespamp at end of line
                        tmp.timeSong = linkNode.parentNode.childNodes[linkIndex-1].innerHTML;
                    } else {
                        if(linkNode.parentNode.childNodes[linkIndex+3]!==undefined){
                            //timestamp RANGE at end on line
                            if(linkNode.parentNode.childNodes[linkIndex+3].innerHTML.indexOf("\n") == 0){
                                tmp.timeSong = linkNode.parentNode.childNodes[linkIndex-1].innerHTML;
                            }
                        } else {
                            //timestamp RANGE at begining on line
                            tmp.timeSong = "";
                        }
                    }
                } else{
                    //SINGLE TIMESTAMP
                    if((nextNode == "\n" && linkNode.parentNode.childNodes[linkIndex-1]) || linkNode.innerHTML.includes("\n")) {
                        //timestamp at end
                        tmp.timeSong = linkNode.parentNode.childNodes[linkIndex-1].innerHTML;
                    } else if (nextNode.includes("\n")){
                        //line breaks after nextNode
                        tmp.timeSong = nextNode.split("\n")[0];
                    } else {
                        tmp.timeSong = nextNode;
                    }
                }
                //console.log(tmp.timeSong);
            }
        }
        if(tmp.timeSong != "" && tmp.timeSong !== undefined){
            //CLEAN UP SONG TITLE STRING
            tmp.timeSong = tmp.timeSong.trim().replace(/^\s+|\s+$/g, '').replace("↵", "").replace(/\u21b5/g,'').replace("\n",''); 
            timeComments.push(tmp);
        }
    });
    //if more than 4 timestamps tags assume reliable tracklist
    
    if(timeComments.length > 4){
        
        var playlistComment = sortTimes(timeComments)
        //GET currentSongApprox based on currentTime not currentTimeApprox
        //var currentSong = findCurrentTime(playlistComment,scrapedSong.currentTime)
        //console.log(currentSong);
        //scrapedSong.currentSongApprox = currentSong;
        return playlistComment;
    } else {
        return [];
    }
}
function convertTimeStamp(stamp){
    var seconds = 0;
    if(stamp.split(":").length == 2){
        if(stamp.split(":")[0].length == 1){
            stamp = "0"+stamp;
        }
       stamp = "00:"+stamp;
    } 
    var convert = stamp.split(":");
    if (convert.length == 3) {
        seconds = (+convert[0]) * 60 * 60 + (+convert[1]) * 60 + (+convert[2]); 
    } else if (convert.length == 4) {
       
        seconds = (+convert[0]) * 60 * 60 * 60 + (+convert[1]) * 60 * 60 + (+convert[2]) * 60 + (+convert[3]); 
    }
    scrapedSong.currentTimeSeconds = seconds;
}
function sortTimes (array) {
    return array.sort(function (a, b) {
        if(a.timeStamp.split(":").length == 3){
            if(a.timeStamp.split(":")[0].length == 1){
                a.timeStamp = "0"+a.timeStamp;
            }
        }
        if(b.timeStamp.split(":").length == 3){
            if(b.timeStamp.split(":")[0].length == 1){
                b.timeStamp = "0"+b.timeStamp;
            }
        }
        if(a.timeStamp.split(":").length == 2){
            if(a.timeStamp.split(":")[0].length == 1){
                a.timeStamp = "0"+a.timeStamp;
            }
            a.timeStamp = "00:"+a.timeStamp;
        }
        if(b.timeStamp.split(":").length == 2){
            if(b.timeStamp.split(":")[0].length == 1){
                b.timeStamp = "0"+b.timeStamp;
            }
            b.timeStamp = "00:"+b.timeStamp;
        }
        return a.timeStamp.localeCompare(b.timeStamp);
    })
}
function findCurrentTime (array,current) {
    //console.log(array);
    if(current.split(":").length == 2){
        if(current.split(":")[0].length == 1){
            current = "0"+current;
        }
        current = "00:"+current;
    }
    currTime = {"timeSong":"current song", "timeStamp":current};
    array.push(currTime);
    array.sort((a,b) => a.timeStamp.localeCompare(b.timeStamp));
    var indexer = array.indexOf(currTime);
    if(array[indexer-1] !== undefined){
        var result = array[indexer-1].timeSong;
    }
    array.splice(indexer,1);
    return result;
}
function getNodeIndex(linkNode) { 
    var parent = linkNode.parentNode; 
    return Array.prototype.indexOf.call(parent.children, linkNode); 
} 

scrapedSong;