let participants = [];

const DEPTH = 295;
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
const listener = audioContext.listener;

const play = document.querySelector(".play");
const stop = document.querySelector(".stop");
const audioPlayers = document.getElementsByClassName("audio-object");

function createParticipant(username, x, y, avatar) {
    return {
        username,
        x,
        y,
        avatar,
        panner: makePanner()
    }
}

// let participant1 = {
//                     username: "marktheassassin", 
//                     x: 100, 
//                     y: 100, 
//                     avatar: "./Photos/PatrickStar.jpg", 
//                     panner: makePanner()
//                 };
// let participant2 = {
//                     username: "matt", 
//                     x: 150, 
//                     y: 100, 
//                     avatar: "./Photos/ExtremelyImportant.png", 
//                     panner: makePanner()
//                 };
// let participant3 = {
//                     username: "riley", 
//                     x: 200, 
//                     y: 100, 
//                     avatar: "./Photos/Big Yoshi.png", 
//                     panner: makePanner()
//                 };

// listener.setPosition(participant1["x"], participant1["y"], DEPTH); // Set initial position of listener 
// participants.push(participant1, participant2, participant3);
participants.push(
    createParticipant("marktheassassin", 100, 100, "./Photos/PatrickStar.jpg"),
    createParticipant("matt", 150, 100, "./Photos/ExtremelyImportant.png"),
    createParticipant("riley", 200, 100, "./Photos/Big Yoshi.png")
)
listener.setPosition(participants[0].x, participants[0].y, DEPTH);


function getParticipants(){
    // Return an array of Participant objects, you may not assume anything 
    // about Participant objects except that you can pass them to the other functions.
    return participants;
}

function getPosition(participant){
    // Returns an array of x and y position of the given participant 
    // (note: you can unpack it automatically)
    return [participant["x"], participant["y"]];
}

function setPosition(participant, x, y){
    // Set the x and y position of the given participant
    participant["x"] = x;
    participant["y"] = y;
}

function getUsername(participant){
    // Returns the username of the participant
    return participant["username"];
}

function getAvatar(participant){
    // Returns the URL of the picture for the participant
    return participant["avatar"];
}

function getAudioStream(participant){
    // Returns a MediaStream object for the audio component of the participant
    return participant["audioFile"];
}

function onParticipantEnter(callback){
    // The argument is a function (or inline function) that will be called whenever 
    // a participant enters the conference. The sole argument to the callback function 
    // is a Participant object (the participant who entered).
}

function onParticipantLeave(callback){
    // The argument is a function (or inline function) that will be called whenever a 
    // participant leaves the conference. The sole argument to the callback function is 
    // a Participant object (the participant who left
    
}

function createAvatar(element, participant) {
    // Set position and image of the audio player
    element.style.left = getPosition(participant)[0] + "px";
    element.style.top = getPosition(participant)[1] + "px";
}

function setAudioFile(participant, audioFile) {
    participant["audioFile"] = audioFile;
}

function getAudioFile(participant){
    return participant["audioFile"];
}

function makePanner() {
    // Return a new panner object
    const panner = audioContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    // Play with refDistance and rolloffFactor
    panner.refDistance = 100; // 100 best
    panner.maxDistance = 10000;
    panner.rolloffFactor = 10; // 10 best
    panner.coneInnerAngle = 360;
    panner.coneOuterAngle = 0;
    panner.coneOuterGain = 0;

    return panner;
}

function dragElement(element, participant) {
    // Set up draggables
    var pos1, pos2, pos3, pos4;
    element.addEventListener("mousedown", dragMouseDown);

    function dragMouseDown(event) {
        event.preventDefault();
        pos3 = event.clientX;
        pos4 = event.clientY;

        document.addEventListener("mouseup", closeDragElement);
        document.addEventListener("mousemove", elementDrag);
    }
    
    function elementDrag(event) {
        event.preventDefault();
        pos1 = pos3 - event.clientX;
        pos2 = pos4 - event.clientY;
        pos3 = event.clientX;
        pos4 = event.clientY;

        var top = event.target.offsetTop - pos2;
        var left = event.target.offsetLeft - pos1;
        // console.log(left, top);

        event.target.style.top = top + "px";
        event.target.style.left = left + "px";

        participant["panner"].setPosition(left, top, DEPTH);
        if (participant == participants[0]) {
            listener.setPosition(left, top, DEPTH);
        }
    }
    
    function closeDragElement() {
        document.removeEventListener("mouseup", closeDragElement);
        document.removeEventListener("mousemove", elementDrag);
    }
}

function getData(participant) {
    // Connect panner and start audio file
    const panner = participant["panner"];
    var reader = new FileReader();

    reader.addEventListener("load", event => {

        audioContext.decodeAudioData(event.target.result, buffer => {
            var source = audioContext.createBufferSource();
            source.buffer = buffer;

            source.connect(panner);
            panner.connect(audioContext.destination);

            source.start(0);
        });
        
    });
    
    reader.readAsArrayBuffer(getAudioFile(participant).files[0]);
}

play.addEventListener("click", () => {

    const audioFiles = document.getElementsByClassName("audioFile");

    // Need try catch if one of the files is empty for browsers other than Safari
    for (var i = 0; i < participants.length; i ++) {
        createAvatar(audioPlayers[i], participants[i]);
        setAudioFile(participants[i], audioFiles[i]);
        dragElement(audioPlayers[i], participants[i]);
        getData(participants[i]);
    }

});


    // createAvatar(audioPlayers[0], participant1);
    // setAudioFile(participant1, audioFiles[0]);
    // dragElement(audioPlayers[0], participant1);
    // getData(participant1);


    // createAvatar(audioPlayers[1], participant2);
    // setAudioFile(participant2, audioFiles[1]);
    // dragElement(audioPlayers[1], participant2);
    // getData(participant2);


    // createAvatar(audioPlayers[2], participant3);
    // setAudioFile(participant3, audioFiles[2]);
    // dragElement(audioPlayers[2], participant3);
    // getData(participant3);


