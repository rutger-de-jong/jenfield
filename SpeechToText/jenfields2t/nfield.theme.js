var theme = {} || theme;

  var SpeechSDK;
  var recognizer;
  theme.init = function () {

    console.log = function(data) {
      $("<p>Console: " + data + "</p>").insertAfter(".segment.active h2");
    }

    var currentPath = $('script[src*=theme]').attr('src');
    currentPath = currentPath.replace(/nfield.theme.js*$/, '');
    $.getScript(currentPath + "dist/js/microsoft.cognitiveservices.speech.sdk.bundle-min.js").done(function() {
      console.log("Azure loading successful");

      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription("cff004e326644706a97b025c19495f4d", "westeurope");
      speechConfig.speechRecognitionLanguage = "en-US";
      const audioConfig  = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

      recognizer.recognizeOnceAsync(
        function (result) {
        // phraseDiv.innerHTML += result.text;
        window.console.log(result);
        },
        function (err) {
        startRecognizeOnceAsyncButton.disabled = false;
        // phraseDiv.innerHTML += err;
        window.console.log(err);
      });
    
      window.addEventListener('unload', function(event) {
        recognizer.close();
        recognizer = undefined;
      });

  }).fail(function() {
      console.log("Failed to open Cognitive Services: " + currentPath);
  });
}
