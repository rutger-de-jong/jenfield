var theme = {} || theme;

theme.init = function () {

    console.log = function(data) {
        $("<p>Console: " + data + "</p>").insertAfter(".segment.active h2");
    }

    var currentPath = $('script[src*=theme]').attr('src');
    currentPath = currentPath.replace(/nfield.theme.js*$/, '');
    $.getScript(currentPath + "dist/js/microsoft.cognitiveservices.speech.sdk.bundle-min.js").done(function() {
    
        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("cff004e326644706a97b025c19495f4d", "westeurope");
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

        recognizer.recognizeOnceAsync(
          function (result) {

            let oldText = answerTextarea.val();
            
            answerTextarea.val(oldText + result.text)
            
            recognizer.close();
            recognizer = undefined;
          },
          function (err) {
            
            answerTextarea.val(oldText + result.text)
            window.console.log(err);

            recognizer.close();
            recognizer = undefined;
        });


    }).fail(function() {
        console.log("Failed to open Cognitive Services: " + currentPath);
    });      
    
    // hide answer container

};

