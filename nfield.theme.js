var theme = {} || theme;


theme.init = function () {

    // init azure library
    $.getScript("https://cdn.jsdelivr.net/npm/microsoft-cognitiveservices-speech-sdk@latest/distrib/browser/microsoft.cognitiveservices.speech.sdk.bundle-min.js", function( data, textStatus, jqxhr ) {
        $("<p>Azure cognitive services init: " + textStatus + "</p>").insertAfter(".segment.active h2");
      });

    // azure API key

    // hide answer container

}; 