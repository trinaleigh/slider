// get setup button
const setupButton = document.getElementById("setup")
setupButton.addEventListener("click",setupMode)

function setupMode(){
	startButton.disabled = true;
	inputSignature.disabled = true;
	inputTempo.disabled = true;
	muteButton.disabled = true;
}

// get start button
const startButton = document.getElementById("start")
startButton.addEventListener("click",start)

// get mute button
const muteButton = document.getElementById("mute")
muteButton.addEventListener("click",muteUnmute)

// get beep
const beep = new Audio('audio/beep.mp3');

// mute/unmute audio
function muteUnmute(){
	beep.muted = !beep.muted;
	if(beep.muted) {
		muteButton.classList.add("muted");
	} else {
		muteButton.classList.remove("muted");
	}
}

// get 3 slide positions
const firstImg = document.getElementById("first")
const secondImg = document.getElementById("second")
const thirdImg = document.getElementById("third")

// get progress bar
const progressFull = document.querySelector(".progress_full")
const progressBar = document.querySelector(".progress_current")

// use blank image for begging / end of sequence
const blankPath = "images/blank.jpeg"

function reset(){
	firstImg.src = blankPath;
	secondImg.src = blankPath;
	thirdImg.src = blankPath;
	}

// get time and tempo inputs
const inputSignature = document.getElementById("time_signature")
inputSignature.addEventListener("change",updateTime)
const inputTempo = document.getElementById("tempo")
inputTempo.addEventListener("change",updateTime)
updateTime()

// // define time signature and tempo
var signature = 4; // beats per measure
var tempo = 60; // bpm
var interval = 60*1000/tempo; // time interval to play each beat

function updateTime(){
	signature = inputSignature.value;
	tempo = inputTempo.value;
	interval = 60*1000/tempo;
}

// define sequence to display with # bars for each
const sequence = {
	0 : {item: "C", length: 2},
	1 : {item: "Am", length: 2},
	2 : {item: "F", length: 1},
	3 : {item: "G", length: 1},
	4 : {item: "C", length: 2}
}

function progress(onDeck){
	// if there are slides remaining, add the next one on deck
	if(onDeck < Object.keys(sequence).length){
		firstImg.src = secondImg.src
		secondImg.src = thirdImg.src
		thirdImg.src = `images/tabs/${sequence[onDeck].item}.jpeg`
	// otherwise, add blank slide
	} else {
		firstImg.src = secondImg.src
		secondImg.src = thirdImg.src
		thirdImg.src = blankPath
	}
}

function countdown(total){
	// count the number of intervals elapsed
	var num = 0

	// update the progress bar and emit sound
	function showprogress(){
		num += interval
		const ratio = Math.round(num / total * 100);
		if (ratio <= 100){
			progressBar.style.flexBasis = `${ratio}%`
			beep.currentTime = 0;
			beep.play();
		} else {
			// at the end of this chord's duration, stop
			clearInterval(update)}
		}

	// call once immediately and subsequently at each downbeat
	showprogress()
	var update = setInterval(showprogress,interval)
}

function play(){
	// progress once to set up
	progress(0);

	// schedule the first subsequent slide transition
	duration = (signature*interval) // one bar delay

	setTimeout(function(){
		progressFull.style.background = "var(--main)";
		progress(1);
		countdown(sequence[0].length*(signature*interval));
		},
		duration)

	// schedule each subsequent slide transition
	for (i=0; i<Object.keys(sequence).length-1; i++) {
		(function(count){
		slide = sequence[count];
		duration += slide.length*(signature*interval);
		setTimeout(function(){
			progress(count+2);
			countdown(sequence[count+1].length*(signature*interval));
			},
			duration)
		})(i);
	}

}

function start(){
	startButton.disabled = true;
	inputSignature.disabled = true;
	inputTempo.disabled = true;
	setupButton.disabled = true;
	reset();
	play();
}





