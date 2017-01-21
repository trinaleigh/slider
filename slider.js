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
	libraryList.style.display = "flex"

	pickSong.addEventListener("click",selectSong)

	// upom hitting select, exit (back to main view) and update the song label
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
	progressFull.style.background = "none";
	progressBar.style.flexBasis = "0%";
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
var signature = inputSignature.value; // beats per measure
var tempo = inputTempo.value; // bpm
var interval = 60*1000/tempo; // time interval to play each beat

function updateTime(){
	signature = inputSignature.value;
	tempo = inputTempo.value;
	interval = 60*1000/tempo;
}

function progress(sequence,onDeck){
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
				countin.style.display = "none"}
			num += 1
			}
			
		fillCircles()
		update = setInterval(fillCircles,interval)

	}

	// show the circles to count down
	setTimeout(clickCircles,0)

	// schedule the first subsequent slide transition
	duration = (signature*interval) // one bar delay

	setTimeout(function(){
		progressFull.style.background = "var(--main)";
		progress(sequence,1);
		countdown(sequence[0].bars*(signature*interval));
		},
		duration)

	// schedule each subsequent slide transition
	for (i=0; i<Object.keys(sequence).length-1; i++) {
		(function(count){
		slide = sequence[count];
		duration += slide.bars*(signature*interval);
		setTimeout(function(){
			progress(sequence,count+2);
			countdown(sequence[count+1].bars*(signature*interval));
			},duration)
		})(i);
	}

	// schedule reset following the final chord 
	duration += sequence[Object.keys(sequence).length-1].bars*(signature*interval)
	setTimeout(function(){
		reset();
		controls.forEach(function(control){
			control.disabled = false;
		})
	},duration)

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
	controls.forEach(function(control){
		if(control != muteButton) {
			control.disabled = true;
		}
	})
	reset();
	getChords(play);
}




