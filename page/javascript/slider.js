// listeners
libraryButton.addEventListener("click", function() {openMode(controls, [libraryButton, songList, pickSong], libraryList, pickSong, songLabel, songList)});
loopButton.addEventListener("click",function(){toggleLoop(this, loopLabel)});
muteButton.addEventListener("click",function(){muteUnmute(this, beep)});
startButton.addEventListener("click",function(){
	// check that inputs are valid before proceeding
	if (enforceMinMax(inputTempo, startButton, toolbar)) {	
		//store the state variables
		var currentState = getSettings(songList, inputSignature, inputTempo, loopButton);
		// disable controls (except for stop, mute) while playing
		filterControls(controls, [stopButton, muteButton], "off");
		// kick off the slideshow
		getChords(currentState.song, currentState.signature, currentState.interval, currentState.looping, play);
	}
});
stopButton.addEventListener("click",function(){
	stopAll();
	reset(controls, [stopButton], [progressBox, countin], images, blankPath);
});


// update time signature and tempo to match current inputs
function getSettings(songControl, signatureControl, tempoControl, loopingControl){

	state = {song: songControl.value, // song selected
			signature: signatureControl.value, // beats per measure
			interval: 60*1000/tempoControl.value, // time interval to play each beat
			looping: loopingControl.classList.contains("looping") // true or false
			};

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
		warning = document.createElement("span")
		warning.style.float = "right";
		warning.innerHTML = `⚠️ Value for ${input.id} must be between ${input.min} and ${input.max}`
		document.body.insertBefore(warning, referenceDiv.nextSibling)
		disabledAction.disabled = true;
		setTimeout(function(){
			disabledAction.disabled = false;
			warning.remove();
		}, 2000)
		return false;
	} else {
		return true;
	}}

function stopAll(){
	// clear all existing timers
	var lastTimer = setTimeout(function(){}, 0);
	for (var i=0; i < lastTimer; i++) { 
	    clearTimeout(i);
	}
}

function reset(allControls, exceptions, divs, images, filepath){
	// enable all controls minus exceptions
	filterControls(allControls, exceptions, "on");
	// hide divs
	divs.forEach(div =>  div.style.display = "none");
	// reset images to given file
	images.forEach(image => image.src = filepath);
	}

function progress(sequence,onDeck,looping){
	// move slides to the left
	images[0].src = images[1].src
	images[1].src = images[2].src
	// if there are slides remaining, add the next one on deck
	if (onDeck < Object.keys(sequence.chords).length){
		images[2].src = `images/tabs/${sequence.chords[onDeck].item}.jpeg`
	// if looping, go back to the start
	} else if (looping == true){
		images[2].src = `images/tabs/${sequence.chords[0].item}.jpeg`
	// otherwise, add blank slide
	} else {
		images[2].src = blankPath
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
			svgs.forEach(circle => circle.style.fill = `none`);
			svgs.forEach(circle => circle.style.display = `none`);
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
		reset(controls, [stopButton], [progressBox, countin], images, blankPath);
	},duration)}


// get the JSON file corresponding to the song selected
function getChords(song, signature, interval, looping, callback){
	$.ajax({
	    url: `library/${song}.json`,
	    success: function (data) {
	        callback(data, signature, interval, looping);
	    }
	});
}




