var assert = chai.assert;

describe('Get settings', function(){
	it('outputs the state', function(){
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

		assert.equal(testState.song, "Kiwi");
		assert.equal(testState.signature, "1");
		assert.equal(testState.interval, 600);
		assert.equal(testState.looping, false);
	})
})

describe('Filter controls', function(){
	it('disables with exception', function(){
		var testButton1 = document.createElement("button");
		var testButton2 = document.createElement("button");
		var testButton3 = document.createElement("button");

		filterControls([testButton1, testButton2, testButton3],[testButton3],"off");

		assert.equal(testButton1.disabled, true);
		assert.equal(testButton2.disabled, true);
		assert.equal(testButton3.disabled, false);

	})

	it('enables with exception', function(){
		var testButton1 = document.createElement("button");
		var testButton2 = document.createElement("button");
		var testButton3 = document.createElement("button");

		filterControls([testButton1, testButton2, testButton3],[testButton3],"on");

		assert.equal(testButton1.disabled, false);
		assert.equal(testButton2.disabled, false);
		assert.equal(testButton3.disabled, true);

	})

})

describe('Open modal', function(){
	it('disables default buttons and shows div', function(){
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

		openMode(controlList, [testButton3], testDiv, testButton3, testLabel, testSelect);

		assert.equal(testButton1.disabled, true);
		assert.equal(testButton2.disabled, true);
		assert.equal(testButton3.disabled, false);

		assert.equal(testDiv.style.display, 'flex');

	})

	it('adds event listener to trigger exit', function(){
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

		openMode(controlList, [testButton3], testDiv, testButton3, testLabel, testSelect);

		testEvent = document.createEvent('event');
		testEvent.initEvent("click", true, false);
		testButton3.dispatchEvent(testEvent);

		assert.equal(testButton1.disabled, false);
		assert.equal(testButton2.disabled, false);
		assert.equal(testButton3.disabled, false);

		assert.equal(testDiv.style.display, 'none');

		assert.equal(testLabel.innerHTML, "Kiwi")

	})
})

describe('Exit modal', function(){
	it('enables default buttons, hides div, and changes label', function(){
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

describe('Toggle looping button', function() {
  it('adds class and applies label', function() {
    var testButton = document.createElement("button");
    testButton.className = ""
    var buttonLabel = document.createElement("span");

    toggleLoop(testButton, buttonLabel);

    assert.equal(testButton.className, "looping");
    assert.equal(buttonLabel.innerHTML, "Loop");

  });

  it('removes class and applies label', function() {
    var testButton = document.createElement("button");
    testButton.className = "looping"
    var buttonLabel = document.createElement("span");

    toggleLoop(testButton, buttonLabel);

    assert.equal(testButton.className, "");
    assert.equal(buttonLabel.innerHTML, "1x");

  });

});

describe('Toggle mute button', function(){
	it('adds class and mutes audio', function(){
		var testButton = document.createElement("button");
	    testButton.className = ""
	    var audio = new Audio();

	    muteUnmute(testButton, audio);

	    assert.equal(testButton.className, "muted");
	    assert.equal(audio.muted, true);

	});

	it('removes class and unmutes audio', function(){
		var testButton = document.createElement("button");
	    testButton.className = "muted"
	    var audio = new Audio();
	    audio.muted = true;

	    muteUnmute(testButton, audio);

	    assert.equal(testButton.className, "");
	    assert.equal(audio.muted, false);

	});

});

describe('Enforce input min/max', function (){
	it('enforces min', function(){
		var testNumber = document.createElement("input")
		testNumber.setAttribute("type", "number");
		testNumber.max = 100;
		testNumber.min = 50;
		testNumber.value = 20;

		var testButton = document.createElement("button"); 

		testDiv = document.createElement("div");
		nextDiv = document.createElement("div");

		result = enforceMinMax(testNumber, testButton, testDiv);

		assert.equal(result, false)

	})

	it('enforces max', function(){
		var testNumber = document.createElement("input")
		testNumber.setAttribute("type", "number");
		testNumber.max = 100;
		testNumber.min = 50;
		testNumber.value = 200;

		var testButton = document.createElement("button"); 

		testDiv = document.createElement("div");
		nextDiv = document.createElement("div");

		result = enforceMinMax(testNumber, testButton, testDiv);

		assert.equal(result, false)
	})

	it('refuses null value', function(){
		var testNumber = document.createElement("input")
		testNumber.setAttribute("type", "number");
		testNumber.max = 100;
		testNumber.min = 50;

		var testButton = document.createElement("button"); 

		testDiv = document.createElement("div");
		nextDiv = document.createElement("div");

		result = enforceMinMax(testNumber, testButton, testDiv);

		assert.equal(result, false)
	})

	it('accepts value in range', function(){
		var testNumber = document.createElement("input")
		testNumber.setAttribute("type", "number");
		testNumber.max = 100;
		testNumber.min = 50;
		testNumber.value = 75;

		result = enforceMinMax(testNumber, testDiv);

		assert.equal(result, true)
	})

})



