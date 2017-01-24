var assert = chai.assert;

describe('Toggle looping button', function() {
  it('add class and apply label', function() {
    var testButton = document.createElement("button");
    testButton.className = ""
    var buttonLabel = document.createElement("span");

    toggleLoop(testButton, buttonLabel);

    assert.equal(testButton.className, "looping");
    assert.equal(buttonLabel.innerHTML, "Loop");

  });

  it('remove class and apply label', function() {
    var testButton = document.createElement("button");
    testButton.className = "looping"
    var buttonLabel = document.createElement("span");

    toggleLoop(testButton, buttonLabel);

    assert.equal(testButton.className, "");
    assert.equal(buttonLabel.innerHTML, "1x");

  });

});

describe('Toggle mute button', function(){
	it('add class and mute audio', function(){
		var testButton = document.createElement("button");
	    testButton.className = ""
	    var audio = new Audio();

	    muteUnmute(testButton, audio);

	    assert.equal(testButton.className, "muted");
	    assert.equal(audio.muted, true);

	});

	it('remove class and unmute audio', function(){
		var testButton = document.createElement("button");
	    testButton.className = "muted"
	    var audio = new Audio();
	    audio.muted = true;

	    muteUnmute(testButton, audio);

	    assert.equal(testButton.className, "");
	    assert.equal(audio.muted, false);

	});

});