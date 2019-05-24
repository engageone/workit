function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function isEmpty(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            return false;
        }
    }
    return true;
}

if (!Object.keys) {
    Object.keys = function(obj) {
        var keys = [];

        for ( var i in obj) {
            if (obj.hasOwnProperty(i)) {
                keys.push(i);
            }
        }

        return keys;
    };
}

$(document).ready(function() {

   
    /**
     * Initialise the mobile orientation handler
     */
    MobileOrientationHandler.initialise();

    /**
     * Initialise timeline with settings defined in settings.js
     */
    Timeline.initialise(0, timelineSettings);

    /**
     * Initialise contrast progress bar with settings defined in settings.js
     */
    ContrastProgress.initialise(timelineSettings);

    /**
     * Initialise the social icons with settings defined in settings.js
     */
    SocialIcons.initialise(socialIconSettings);

    /**
     * Initialise cta buttons with settings defined in settings.js
     */
    CtaButtons.initialise();

    /**
     * Initialise promos with settings defined in settings.js
     */
    Promos.initialise();

    /**
     * Initialise volume slider
     */
    VolumeSlider.initialise();

    /**
     * Initialise language selector
     */
    LanguageSelector.initialise(languageSettings);

    /**
     * Initialise closed caption selector
     */
    ClosedCaptionSelector.initialise();

    /**
     * Initialise the fullscreen handler
     */
    FullScreenHandler.initialise();

    /**
     * Initialise video player interface and quality selector with settings defined in settings.js
     */
    VideoPlayerInterface.initialise();

    /**
     * Initialise the keyboard input controller
     */
    KeyboardInputController.initialise();
});
var Utils = {
    /**
     * Checks whether the current useragent is in the provided array of regular expressions
     * Taken in part from the jPlayer _uaBlocklist method.
     *
     * @param {string} userAgent     the current user agent
     * @param {array}  userAgentList the user agents (in the form of regular expressions) to check against
     *
     * @return {boolean} whether the current user agent is in the list
     */
    userAgentInList: function(userAgent, userAgentList) {
        var inList = false;
        userAgent = userAgent.toLowerCase();

        /**
         * Test each agent in the list against the one provided
         *
         * @param {number} index the array index
         * @param {string} agentExpression the regular expression to test
         */
        $.each(userAgentList, function testEachAgent(index, agentExpression) {
            if (agentExpression.test(userAgent)) {
                inList = true;
                return false;
            }
        });

        return inList;
    }
};












