var recognition;
var recognizing = false;
var final_transcript = "";
var ignore_onend;
var start_timestamp;

var speech_info_init = "Click the microphone to talk about your problem, and click again to stop!";

var showInfo = function(s) {
	$("#speech-info").text(s);
};

var startSpeech = function(event){
	if (recognizing){
		recognition.stop();
		return;
	}
	final_transcript = "";
	recognition.lang = "en-US";
	recognition.start();
	ignore_onend = false;
	$("#final_span").text("");
	$("#interim_span").text("");
	start_timestamp = event.timeStamp;
};

$(document).ready(function(){

	$("#send-speech-button").hide();

	if ('webkitSpeechRecognition' in window){
		recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;

		recognition.onstart = function() {
			recognizing = true;
			showInfo("Please speak now.");
		};

		recognition.onresult = function(event) {
			var interim_transcript = "";
			for (var i = event.resultIndex; i < event.results.length; i++){
				if (event.results[i].isFinal){
					final_transcript += event.results[i][0].transcript;
				} else {
					interim_transcript += event.results[i][0].transcript;
				}
			}

			$("#final_span").text(final_transcript);
			$("#interim_span").text(interim_transcript);
		};

		recognition.onerror = function(event){
			if (event.error == "no-speech") {
				showInfo("No speech detected!");
				ignore_onend = true;
			} 
			if (event.error = "audio-capture"){
				showInfo("No microphone was found!");
			}
			if (event.error == "not-allowed"){
				if (event.timeStamp - start_timestamp < 100){
					showInfo("Permission to use microphone is blocked.");
				} else {
					showInfo("Permission to use microphone is denied.");
				}
				ignore_onend = true;
			}
		};

		recognition.onend = function(){
			recognizing = false;
			if (ignore_onend == true) return;

			if (!final_transcript){
				showInfo(speech_info_init);
				return;
			}

			showInfo("Click Send to let a mentor know about your problem.");
			$("#send-speech-button").show();
		}
	} else {
		showInfo("Web Speech API is not supported by this browser. Please upgrade to Chrome version 25 or later.");
	}
});