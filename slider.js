// get all user controls to easily enable/disable
const controls = document.querySelectorAll("button, input,select");
const toolbar = document.getElementById("toolbar");

// get library button and settings
const libraryButton = document.getElementById("library");
const libraryList = document.getElementById("library_list");
const songList = document.getElementById("song");
const pickSong = document.getElementById("pick_song");
const songLabel = document.getElementById("current_song");
songLabel.innerHTML = songList[songList.selectedIndex].text;

// get start button
const startButton = document.getElementById("start");

// get stop button
const stopButton = document.getElementById("stop");

// get looping button
const loopButton = document.getElementById("loop");
const loopLabel = document.getElementById("loop_label");

// get beep
const beep = new Audio('audio/beep.mp3');

// get mute button
const muteButton = document.getElementById("mute");

// get time and tempo inputs
const inputSignature = document.getElementById("time_signature");
const inputTempo = document.getElementById("tempo");

// get 3 slide positions
const firstImg = document.getElementById("first");
const secondImg = document.getElementById("second");
const thirdImg = document.getElementById("third");

// get progress bar
const progressBox = document.querySelector(".progress");
const progressBar = document.querySelector(".progress_current");

// use blank image for begging / end of sequence
const blankPath = "images/blank.jpeg";

// get circles used to count into the song
const circles = document.querySelectorAll("circle");
const countin = document.getElementById("countin");

// listeners
libraryButton.addEventListener("click", function() {openMode(controls, [libraryButton, songList, pickSong], libraryList, pickSong, songLabel, songList)});
startButton.addEventListener("click",start);
stopButton.addEventListener("click",stopAll);
loopButton.addEventListener("click",function(){toggleLoop(this, loopLabel)});
muteButton.addEventListener("click",function(){muteUnmute(this, beep)});

// update time signature and tempo to match current inputs
function getSettings(songControl, signatureControl, tempoControl, loopingControl){

	var currentSong = songControl.value; // song selected
	var signature = signatureControl.value; // beats per measure
	var tempo = tempoControl.value; // bpm
	var interval = 60*1000/tempo; // time interval to play each beat
	var looping = loopingControl.classList.contains("looping") // true or false

	state = {currentSong, 
			signature, 
			interval, 
			looping};

	return state;
}

function filterControls(allControls, exceptions, direction){
	// direction should be "on" or "off"
	allControls.forEach(function(control){
		if (! exceptions.includes(control)){
			control.disabled = (direction == "off" ? true : false);
		}
	})
	exceptions.forEach(function(control){
		control.disabled = (direction == "off" ? false : true);
	})
}

function openMode(allControls, exceptions, modeDiv, submitter, modeLabel, modeList){
	// enable library controls only
	filterControls(allControls, exceptions, "off")
	// show the list of songs and listen for "select" button
	modeDiv.style.display = "flex"
	submitter.addEventListener("click", function() {exitMode(allControls, modeDiv, modeLabel, modeList)})
}

function exitMode(allControls, modeDiv, modeLabel, modeList){
	// exit (back to main view) 
	filterControls(allControls, [], "on")
	// update song label to the selection
	modeDiv.style.display = "none"
	modeLabel.innerHTML = modeList[modeList.selectedIndex].text
}

function toggleLoop(button, label){
	// change the button display
	if (! button.classList.contains("looping")) {
		button.classList.add("looping");
		label.innerHTML = "Loop";
	} else {
		button.classList.remove("looping");
		label.innerHTML = "1x";
	}
}

// mute/unmute audio when button toggled
function muteUnmute(button, sound){
	// mute/unmute audio file
	sound.muted = !sound.muted;
	// change the button display
	if (sound.muted) {
		button.classList.add("muted");
	} else {
		button.classList.remove("muted");
	}
}

// enforce min and max on number input
function enforceMinMax(input, disabledAction, referenceDiv) {
	if(parseInt(input.value) > parseInt(input.max) || parseInt(input.value) < parseInt(input.min) || input.value == "") {
		warning = document.createElement("h2")
		warning.style.float = "right";
		warning.innerHTML = `⚠️ Value for ${input.id} must be between ${input.min} and ${input.max}.`
		document.body.insertBefore(warning, referenceDiv.nextSibling)
		disabledAction.disabled = true;
		setTimeout(function(){
			disabledAction.disabled = false;
			warning.remove();
		},2000)
		return false;
	} else {
		return true;
	}}

// after hitting start, disable controls, get chords from the JSON file, and play
function start(){
	// check that inputs are valid before proceeding
	if (enforceMinMax(inputTempo, startButton, toolbar)) {	
		//store the state variables
		var currentState = getSettings(songList, inputSignature, inputTempo, loopButton); // get user inputs
		var currentSong = currentState.currentSong;
		var currentSignature = currentState.signature;
		var currentInterval = currentState.interval;
		var isLooping = currentState.looping;
		// disable controls (except for stop, mute) while playing
		filterControls(controls, [stopButton, muteButton], "off"); // disable inputs except stop and mute
		// kick off the slideshow
		getChords(currentSong, currentSignature, currentInterval, isLooping, play); // make the ajax call and play slideshow
	}
}

function stopAll(){
	// clear all the timers and reset
	var lastTimer = setTimeout(function(){}, 0);

	for (var i=0; i < lastTimer; i++) { 
	    clearTimeout(i);
	}

	reset();
}

// to reset: hide the progress bar and circles, start slideshow with blank images
function reset(){
	filterControls(controls, [stopButton], "on");
	progressBox.style.display = "none";
	progressBar.style.flexBasis = "0%";
	circles.forEach(circle => circle.style.fill = `none`);
	circles.forEach(circle => circle.style.display = `none`);
	firstImg.src = blankPath;
	secondImg.src = blankPath;
	thirdImg.src = blankPath;
	}

function progress(sequence,onDeck,looping){
	// if there are slides remaining, add the next one on deck
	if (onDeck < Object.keys(sequence.chords).length){
		firstImg.src = secondImg.src
		secondImg.src = thirdImg.src
		thirdImg.src = `images/tabs/${sequence.chords[onDeck].item}.jpeg`
	// if looping, go back to the start
	} else if (looping == true){
		firstImg.src = secondImg.src
		secondImg.src = thirdImg.src
		thirdImg.src = `images/tabs/${sequence.chords[0].item}.jpeg`
	// otherwise, add blank slide
	} else {
		firstImg.src = secondImg.src
		secondImg.src = thirdImg.src
		thirdImg.src = blankPath
	}
}

function countdown(total, interval, progressInd, sound){
	// count the number of intervals elapsed
	var num = 0

	// update the progress bar and emit sound
	function showprogress(){
		num += interval
		const ratio = Math.round(num / total * 100);
		if (ratio <= 100){
			// change the size of the progress indicator and play sound
			progressInd.style.flexBasis = `${ratio}%`
			sound.currentTime = 0;
			sound.play();
		} else {
			// at the end of this chord's bars, stop
			clearInterval(update)}
		}

	// call once immediately and subsequently at each downbeat
	showprogress()
	var update = setInterval(showprogress,interval)
}

function play(sequence, signature, interval, looping){
	// setup: progress once and show empty circles
	progress(sequence, 0, looping);

	// immediately show the circles to count down
	var preShow = 0;
	setTimeout(function(){clickCircles(interval, signature, circles, countin, progressBox, beep)}, preShow);

	// add one bar delay for count in
	preShow += (signature*interval) 

	// play the slideshow once through
	afterShow = fullSlideshow(sequence, signature, interval, looping, preShow)

	// loop or end
	if (looping == true){
		loop(sequence, signature, interval, afterShow);
	} else {
		endSong(sequence, signature, interval, afterShow);
	}

}

function clickCircles(interval, signature, svgs, thisDiv, nextDiv, sound){
	// circle animation counts in for one bar

	// unhide the correct number of circles
	for (i=0; i<signature; i++){
		svgs[i].style.display = "block"
	}
	// unhide the div
	thisDiv.style.display = "flex"

	// count the number of intervals elapsed
	var num = 0

	// update the circles and emit sound
	function fillCircles(){
		if (num < signature){
			svgs[num].style.fill = `var(--secondary)`
			sound.currentTime = 0;
			sound.play();
		} else {
			// at the end of this chord's duration, stop
			clearInterval(update)
			thisDiv.style.display = "none"
			nextDiv.style.display = "flex"}
		num += 1
		}
		
	fillCircles()
	update = setInterval(fillCircles,interval)

}

function fullSlideshow(sequence, signature, interval, looping, duration){
	// schedule the first slide transition
	showTime = duration

	setTimeout(function(){
		progress(sequence, 1, looping);
		countdown(sequence.chords[0].bars*(signature*interval), interval, progressBar, beep);
		},
		showTime)

	// schedule each subsequent slide transition
	for (i=0; i<Object.keys(sequence.chords).length-1; i++) {
		(function(count){
		slide = sequence.chords[count];
		showTime += slide.bars*(signature*interval);
		setTimeout(function(){
			progress(sequence, count+2, looping);
			countdown(sequence.chords[count+1].bars*(signature*interval), interval, progressBar, beep);
			},showTime)
		})(i);
	}

	return showTime;
}

function loop(sequence, signature, interval, duration){
	// replays the full slideshow up to 20x
	afterShow = duration
	for (loopNum=1; loopNum<20; loopNum++){
		// add time for the last chord
		afterShow += sequence.chords[Object.keys(sequence.chords).length-1].bars*(signature*interval);
		// play again up to 20x
		afterShow = fullSlideshow(sequence, signature, interval, true, afterShow);
	}
	endSong(sequence, signature, interval, afterShow)
} 

function endSong(sequence, signature, interval, duration){	
	// clears off the page after the last chord
	// add time for the last chord
	duration += sequence.chords[Object.keys(sequence.chords).length-1].bars*(signature*interval);
	// schedule reset 
	setTimeout(function(){
		reset();
	},duration)}


// get the JSON file corresponding to the song selected
function getChords(currentSong, signature, interval, looping, callback){
	$.ajax({
	    url: `library/${currentSong}.json`,
	    success: function (data) {
	        callback(data, signature, interval, looping);
	    }
	});
}




