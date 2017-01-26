// get all user controls to easily enable/disable
const controls = document.querySelectorAll("button, input,select");
const toolbar = document.getElementById("toolbar");

// get library button and settings
const libraryButton = document.getElementById("library");
const libraryList = document.getElementById("library_list");
const songList = document.getElementById("song_list");
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
const images = document.querySelectorAll("img");

// get progress bar
const progressBox = document.querySelector(".progress");
const progressBar = document.querySelector(".progress_current");

// use blank image for begging / end of sequence
const blankPath = "images/blank.jpeg";

// get circles used to count into the song
const circles = document.querySelectorAll("circle");
const countin = document.getElementById("countin");
