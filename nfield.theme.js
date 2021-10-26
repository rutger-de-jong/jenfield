var theme = {} || theme;
var recognizer;
var speechConfig;
var lastText ="";

theme.init = function () {

    console.log = function(data) {
        $("<p>Console: " + data + "</p>").insertAfter(".segment.active h2");
    }

    var currentPath = $('script[src*=theme]').attr('src');
    currentPath = currentPath.replace(/nfield.theme.js*$/, '');
    $.getScript(currentPath + "dist/js/microsoft.cognitiveservices.speech.sdk.bundle-min.js").done(function() {
    
        speechConfig = SpeechSDK.SpeechConfig.fromSubscription("cff004e326644706a97b025c19495f4d", "westeurope");
        speechConfig.speechSynthesisLanguage = "en-US";
        speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";
        
        const ttsAudioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

        const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, ttsAudioConfig);

        let questionText = $(".segment.active h2").text().trim();

        let answerTextarea = $(".answerCategory .form-control.open");

        synthesizer.speakTextAsync(
            questionText,
            result => {
                if (result) {
                    synthesizer.close();
                    return result.audioData;
                }
            },
            error => {
                window.console.log(error);
                synthesizer.close();
            });

        speechConfig.speechRecognitionLanguage = "en-US";
        var sttAudioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, sttAudioConfig);

        recognizer.startContinuousRecognitionAsync();

        function onRecognizing(sender, recognitionEventArgs) {
            var result = recognitionEventArgs.result;

            // Update the hypothesis line in the phrase/result view (only have one)
            let oldText = answerTextarea.val();
            answerTextarea.val(oldText.replace(/(.*)(^|[\r\n]+).*\[\.\.\.\][\r\n]+/, '$1$2')
                + `${result.text} [...]\r\n`);
            answerTextarea.scrollTop = answerTextarea.scrollHeight;
        }

        function onRecognized(sender, recognitionEventArgs) {
            var result = recognitionEventArgs.result;
            onRecognizedResult(recognitionEventArgs.result);
        }

        function onRecognizedResult(result) {
            answerTextarea.scrollTop = answerTextarea.scrollHeight;

            let oldText = answerTextarea.val();
            answerTextarea.val(oldText.replace(/(.*)(^|[\r\n]+).*\[\.\.\.\][\r\n]+/, '$1$2'));

            switch (result.reason) {

                case SpeechSDK.ResultReason.RecognizedSpeech:
                case SpeechSDK.ResultReason.RecognizedIntent:

                    if (result.text) {
                        oldText = answerTextarea.val();
                        answerTextarea.val(oldText + `${result.text}\r\n`);
                    }
                    break;
            }
        }

        
        recognizer.recognizing = onRecognizing;
        recognizer.recognized = onRecognized;

    }).fail(function() {
        console.log("Failed to open Cognitive Services: " + currentPath);
    });

    window.addEventListener('unload', function(event) {
        recognizer.close();
        recognizer = undefined;
    });
};

