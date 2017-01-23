// get all user controls to easily enable/disable
const controls = document.querySelectorAll("button, input,select")

// get library button and settings
const libraryButton = document.getElementById("library")
libraryButton.addEventListener("click",libraryMode)
const libraryList = document.getElementById("library_list")
const songList = document.getElementById("song")
const pickSong = document.getElementById("pick_song")
const songLabel = document.getElementById("current_song")
songLabel.innerHTML = songList[songList.selectedIndex].text

// in library mode, allow song change
function libraryMode(){
	controls.forEach(function(control){
		if(! [libraryButton, songList, pickSong].includes(control)) {
			control.disabled = true;
		}
	})

	// show the select list of songs and listen for "select" button
	libraryList.style.display = "flex"

	pickSong.addEventListener("click",selectSong)

	// upon hitting select, exit (back to main view) and update the song label
	function selectSong(){
		
		controls.forEach(function(control){
			control.disabled = false;
		})
		
		libraryList.style.display = "none"

		songLabel.innerHTML = songList[songList.selectedIndex].text
	}
}

// get start button
const startButton = document.getElementById("start")
startButton.addEventListener("click",start)

// get stop button
const stopButton = document.getElementById("stop")
stopButton.addEventListener("click",stopAll)

function stopAll(){
	// clear all the timers and reset
	var lastTimer = setTimeout(function(){}, 0);

	for (var i=0; i < lastTimer; i++) { 
	    clearTimeout(i);
	}
	reset();
}

// get looping button
var looping = false;
const loopButton = document.getElementById("loop")
loopButton.addEventListener("click",toggleLoop)
const loopLabel = document.getElementById("loop_label")

function toggleLoop(){
	// turn looping on/off
	looping = !looping
	// change the button display
	if(looping) {
		loopButton.classList.add("looping");
		loopLabel.innerHTML = "Loop";
	} else {
		loopButton.classList.remove("looping");
		loopLabel.innerHTML = "1x";
	}
}

// get mute button
const muteButton = document.getElementById("mute")
muteButton.addEventListener("click",muteUnmute)

// get beep
const beep = new Audio('audio/beep.mp3');

// mute/unmute audio when button toggled
function muteUnmute(){
	// mute/unmute audio file
	beep.muted = !beep.muted;
	// change the button display
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
const progressBox = document.querySelector(".progress")
const progressFull = document.querySelector(".progress_full")
const progressBar = document.querySelector(".progress_current")

// use blank image for begging / end of sequence
const blankPath = "images/blank.jpeg"

// to reset: enable controls, hide the progress bar and circles, start slideshow with blank images
function reset(){
	controls.forEach(function(control){
		control.disabled = false;
		})
	stopButton.disabled = true;
	progressBox.style.display = "none"
	progressFull.style.background = "none";
	progressBar.style.flexBasis = "0%";
	circles.forEach(circle => circle.style.fill = `none`)
	circles.forEach(circle => circle.style.display = `none`)
	firstImg.src = blankPath;
	secondImg.src = blankPath;
	thirdImg.src = blankPath;
	}

// get time and tempo inputs
const inputSignature = document.getElementById("time_signature")
inputSignature.addEventListener("change",updateTime)
const inputTempo = document.getElementById("tempo")
inputTempo.addEventListener("change",updateTime)
var signature
var tempo
var interval
updateTime()

// update time signature and tempo to match current inputs
function updateTime(){
	signature = inputSignature.value; // beats per measure
	tempo = inputTempo.value; // bpm
	interval = 60*1000/tempo; // time interval to play each beat
}

function progress(sequence,onDeck){
	// if there are slides remaining, add the next one on deck
	if(onDeck < Object.keys(sequence.chords).length){
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

// get circles used to count into the song
circles = document.querySelectorAll("circle");
countin = document.getElementById("countin");


function play(sequence){
	// setup: progress once and show empty circles
	progress(sequence,0);

	for(i=0; i<signature; i++){
		circles[i].style.display = "block"
		}

	countin.style.display = "flex"

	function clickCircles(){

		// count the number of intervals elapsed
		var num = 0

		// update the circles and emit sound
		function fillCircles(){
			if (num < signature){
				circles[num].style.fill = `var(--secondary)`
				beep.currentTime = 0;
				beep.play();
			} else {
				// at the end of this chord's duration, stop
				clearInterval(update)
				countin.style.display = "none"
				progressBox.style.display = "flex"}
			num += 1
			}
			
		fillCircles()
		update = setInterval(fillCircles,interval)

	}

	// immediately show the circles to count down
	duration = 0
	setTimeout(clickCircles,duration)
	duration += (signature*interval) // add one bar delay for count in

	fullSlideshow(sequence,0)
	if(looping == true){
		loop(sequence);
	} else {
		endSong(sequence);
	}

	function fullSlideshow(sequence){
		// schedule the first slide transition
		setTimeout(function(){
			progressFull.style.background = "var(--main)";
			progress(sequence,1);
			countdown(sequence.chords[0].bars*(signature*interval));
			},
			duration)

		// schedule each subsequent slide transition
		for (i=0; i<Object.keys(sequence.chords).length-1; i++) {
			(function(count){
			slide = sequence.chords[count];
			duration += slide.bars*(signature*interval);
			setTimeout(function(){
				progress(sequence,count+2);
				countdown(sequence.chords[count+1].bars*(signature*interval));
				},duration)
			})(i);
		}
	}

	function loop(sequence){
		for (loopNum=1; loopNum<20; loopNum++){
			// add time for the last chord
			duration += sequence.chords[Object.keys(sequence.chords).length-1].bars*(signature*interval)
			// play again up to 20x
			fullSlideshow(sequence)
		}
		endSong(sequence)
	} 

	function endSong(sequence){	
		// add time for the last chord
		duration += sequence.chords[Object.keys(sequence.chords).length-1].bars*(signature*interval)
		// schedule reset 
		setTimeout(function(){
			reset();
		},duration)}
}

// get the JSON file corresponding to the song selected
function getChords(callback){
	$.ajax({
	    url: `library/${songList.value}.json`,
	    success: function (data) {
	        callback(data);
	    }
	});
}

// after hitting start, disable controls, get chords from the JSON file, and play
function start(){
	reset();
	controls.forEach(function(control){
		if(control != muteButton) {
			control.disabled = true;
		}
	})
	stopButton.disabled = false;
	getChords(play);
}




