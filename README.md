# slider

## summary

timed slideshow plays through chord changes for a library of songs. current implementation displays ukulele chord tabs.

## instructions

npm install and run node index.js

compatibility: tested for Chrome (v55)

## files

* index.js: express app
* page folder
	- index.html
	- sliderstyle.css
	- javascript folder: contains elements.js (identifies page elements) and slider.js (includes functions to control and play the slideshow)
	- audio folder: contains mp3 file for metronome click
	- images folder: contains svg images for control buttons. tabs subfolder contains jpeg images of ukulele chord tabs.
	- library folder: contains JSON files, each representing a song with chord progression and duration (# measures) for each chord
* mocha_tests.html: mocha test runner
* test folder: mocha test suite