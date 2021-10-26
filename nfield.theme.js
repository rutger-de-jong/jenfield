var theme = {} || theme;

theme.init = function () {

    console.log = function(data) {
        $("<p>Console: " + data + "</p>").insertAfter(".segment.active h2");
    }

    var currentPath = $('script[src*=theme]').attr('src');
    currentPath = currentPath.replace(/nfield.theme.js*$/, '');
    $.getScript(currentPath + "dist/js/microsoft.cognitiveservices.speech.sdk.bundle-min.js").done(function() {
        console.log("Azure loading successful");

        const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("cff004e326644706a97b025c19495f4d", "westeurope");
        speechConfig.speechSynthesisLanguage = "en-US";
        speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

        const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();

        const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

        let questionText = $(".segment.active h2").text().trim();

        synthesizer.speakTextAsync(
            questionText,
            result => {
                if (result) {
                    synthesizer.close();
                    return result.audioData;
                }
            },
            error => {
                console.log(error);
                synthesizer.close();
            });


    }).fail(function() {
        console.log("Failed to open Cognitive Services: " + currentPath);
    });      
    
    // hide answer container

};

