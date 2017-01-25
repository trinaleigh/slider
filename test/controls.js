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

describe('Disable button', function(){
	it('disable with exception', function(){
		var testButton1 = document.createElement("button");
		var testButton2 = document.createElement("button");
		var testButton3 = document.createElement("button");

		filterControls([testButton1, testButton2, testButton3],[testButton3],"off");

		assert.equal(testButton1.disabled, true);
		assert.equal(testButton2.disabled, true);
		assert.equal(testButton3.disabled, false);

	})
	it('enable with exception', function(){
		var testButton1 = document.createElement("button");
		var testButton2 = document.createElement("button");
		var testButton3 = document.createElement("button");

		filterControls([testButton1, testButton2, testButton3],[testButton3],"on");

		assert.equal(testButton1.disabled, false);
		assert.equal(testButton2.disabled, false);
		assert.equal(testButton3.disabled, true);

	})

})

describe('Exit mode', function(){
	it('enable default buttons, hide div, and change label', function(){
		var testButton1 = document.createElement("button");
		var testButton2 = document.createElement("button");
		var testButton3 = document.createElement("button");
		var controlList = [testButton1, testButton2, testButton3]

		var testDiv = document.createElement("div");

		var testLabel = document.createElement("span");

		var testSelect = document.createElement("select");
		var option1 = document.createElement("option");
		option1.text = "Kiwi";
		testSelect.add(option1);
		var option2 = document.createElement("option");
		option2.text = "Banana";
		testSelect.add(option2);

		exitMode(controlList, testDiv, testLabel, testSelect);

		assert.equal(testButton1.disabled, false);
		assert.equal(testButton2.disabled, false);
		assert.equal(testButton3.disabled, false);

		assert.equal(testDiv.style.display, 'none');

		assert.equal(testLabel.innerHTML, "Kiwi")
	})
})

describe('Get settings', function(){
	it('output the state', function(){
		var testSelect = document.createElement("select")
		var option1 = document.createElement("option");
		option1.text = "Kiwi";
		testSelect.add(option1);
		var option2 = document.createElement("option");
		option2.text = "Banana";
		testSelect.add(option2);

		var testSignature = document.createElement("select")
		var option3 = document.createElement("option");
		option3.value = 1
		testSignature.add(option3)

		var testNumber = document.createElement("input")
		testNumber.setAttribute("type", "number");
		testNumber.value = 100

		var testButton1 = document.createElement("button");

		testState = getSettings(testSelect, testSignature, testNumber, testButton1)

		assert.equal(testState.currentSong, "Kiwi");
		assert.equal(testState.signature, "1");
		assert.equal(testState.interval, 600);
		assert.equal(testState.looping, false);
	})
})
