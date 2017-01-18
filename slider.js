// get 3 slide positions
const firstImg = document.getElementById("first")
const secondImg = document.getElementById("second")
const thirdImg = document.getElementById("third")


// use blank image for begging / end of sequence
const blankPath = "images/blank.jpeg"

function reset(){
	firstImg.src = blankPath;
	secondImg.src = blankPath;
	thirdImg.src = blankPath;
	}

// define time signature and tempo
const signature = 4 // beats per measure
const tempo = 80 // bpm

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

function play(){
	 // progress twice to set up
	progress(0);
	progress(1);

	// schedule each subsequent slide transition
	duration = 0
	for(i=0; i<Object.keys(sequence).length; i++) {
		(function(count){
		slide = sequence[count];
		duration += slide.length*(signature*60*1000/tempo);
		setTimeout(function(){progress(count+2)},duration)
		})(i);
	}

}

reset()
play()