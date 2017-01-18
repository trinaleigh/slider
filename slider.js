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

// define time signature and tempo
const signature = 4 // beats per measure
const tempo = 120 // bpm

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
	console.log(total)
	var startTime = new Date().getTime()
	// display timer at zero
	var update = setInterval(function(){
		currentTime = new Date().getTime()
		completed = currentTime - startTime
		const ratio = Math.round(completed / total * 100);
		if (ratio <= 100){
		progressBar.style.flexBasis = `${ratio}%`
		} else {
			clearInterval(update)}
		}
		,100);
	}

function play(){
	// progress twice to set up
	progress(0);
	progress(1);
	countdown(sequence[0].length*(signature*60*1000/tempo))

	// schedule each subsequent slide transition
	duration = 0
	for(i=0; i<Object.keys(sequence).length -1 ; i++) {
		(function(count){
		slide = sequence[count];
		thisLength = slide.length*(signature*60*1000/tempo);
		duration += thisLength;
		setTimeout(function(){
			progress(count+2);
			countdown(sequence[count+1].length*(signature*60*1000/tempo));
			},duration)
		})(i);
	}

}

reset()
play()

