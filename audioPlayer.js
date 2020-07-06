
class AudioPlayer {

    constructor(element, audioContext, audioFile) {
        this.element = element;
        this.dragElement(); // Initialize draggable
        this.audioFile = audioFile;
        this.audioContext = audioContext;
        this.listener = this.audioContext.listener;
        this.panner = this.audioContext.createPanner();

        this.panner.panningModel = 'HRTF';
        this.panner.distanceModel = 'inverse';
        this.panner.refDistance = 1;
        this.panner.maxDistance = 10000;
        this.panner.rolloffFactor = 1;
        this.panner.coneInnerAngle = 360;
        this.panner.coneOuterAngle = 0;
        this.panner.coneOuterGain = 0;

        this.pos1 = 0;
        this.pos2 = 0;
        this.pos3 = 0;
        this.pos4 = 0;
    }

    

    getData() {
        var pan = this.panner; // Can't use this keyword inside of the event
        var x = window.innerWidth / 2;
        var y = window.innerHeight / 2;

        var reader = new FileReader();
        reader.onload = function(event) {

            window.audioContext.decodeAudioData(event.target.result, function(buffer) {
                var source = window.audioContext.createBufferSource();

                source.buffer = buffer;

                source.connect(pan);
                pan.connect(window.audioContext.destination);

                source.start(0);
            });
        };

        reader.readAsArrayBuffer(this.audioFile.files[0]);


        // Method 1: Couldn't run the source, only the audio file
        // const audio = new Audio(filename);
        // const source = this.audioContext.createMediaElementSource(this.audio);
        // source.connect(this.panner);
        // this.panner.connect(this.audioContext.destination);
        //audio.play()

        // Method 2: Can't http request for files when not running on a server
        // function loadSound(url) {
        //     var request = new XMLHttpRequest();
        //     request.open('GET', "./Sounds/Regulate.m4a", false);
        //     request.responseType = 'arraybuffer';
        //     console.log("hope");
        //     // Decode asynchronously
        //     request.onload = function() {
        //         console.log("onloaded");
        //       context.decodeAudioData(request.response, playSound(buffer)); 
        //     }
        //     request.send();
        //   }

        // function playSound(buffer) {
        //     var source = context.createBufferSource(); // creates a sound source
        //     source.buffer = buffer;                    // tell the source which sound to play
        //     source.connect(context.destination);       // connect the source to the context's destination (the speakers)
        //     source.start(0); 
        // }

        // loadSound(this.audioFile);
    }

    begin() {
        this.getData();
        // this.audio.play();
    }

    stop() {
        // this.audio.pause();

    }

    setPosition(top, left, filename) {
        this.element.style.position = "absolute";
        this.element.style.left = left + "px";
        this.element.style.top = top + "px";
        this.element.style.width = "200px";
        this.element.style.height = "180px";
        this.element.style.background = `url('${filename}') no-repeat`;
        this.element.style.backgroundSize = "100% 100%";
        this.element.style.transform = "scale(0.5)";
    }

    dragElement() {
        this.element.onmousedown = dragMouseDown;

        function dragMouseDown(event) {
            event.preventDefault();
            // get the mouse cursor position at startup:
            this.pos3 = event.clientX;
            this.pos4 = event.clientY;

            event.target.onmouseup = closeDragElement;
            event.target.onmousemove = elementDrag;
        }
        
        function elementDrag(event) {
            event.preventDefault();
            // calculate the new cursor position:
            this.pos1 = this.pos3 - event.clientX;
            this.pos2 = this.pos4 - event.clientY;
            this.pos3 = event.clientX;
            this.pos4 = event.clientY;
            // set the element's new position:
            event.target.style.top = (event.target.offsetTop - this.pos2) + "px";
            event.target.style.left = (event.target.offsetLeft - this.pos1) + "px";
        }
        
        function closeDragElement() {
        // stop moving when mouse button is released:
            event.target.onmouseup = null;
            event.target.onmousemove = null;
        }
    }

}

////////////////////////////// This is mega weird placement
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext();
window.audioContext = audioContext;
const listener = audioContext.listener;
listener.setPosition()

const play = document.querySelector(".play");
const end = document.querySelector(".stop");
const audioPlayers = document.getElementsByClassName("boom-box");

const images = ["./Photos/PatrickStar.jpg", "./Photos/CrabRave.png", "./Photos/ExtremelyImportant.png"];
let audioTracks = []
//////////////////////////////

play.onclick = function() {
    
    let audioFiles = document.getElementsByClassName("audioFile");

    for (var i = 0; i < audioPlayers.length; i ++) {
        const player = new AudioPlayer(audioPlayers[i], audioContext, audioFiles[i])

        player.setPosition(50, Math.floor(Math.random() * 1000), images[i]);
        if (player.audioFile === "")
        audioTracks.push(player);
    }

    for (var track of audioTracks) {
        track.begin();
    }
};

end.onclick = function() { // Doesn't stop right now
    for (var track of audioTracks) {
        track.stop();
    }
};

