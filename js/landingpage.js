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

    $("#jsDate").text(Utils.getFullYear());
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
    //Promos.initialise();

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
    },

    getFullYear: function() {
        return (new Date()).getFullYear();
    }
};
var BufferStatus = {

    seenStates: [],

    initBuffer: function () {
        if(Timeline.SettingsJsonObject.BufferBarEnabled){
            BufferStatus.createBufferDivs();
        }
    },

    createBufferDivs: function () {
        var counter = 1;

        var bufferSectionHTMLTemplate =
            '<div id="jsBufferSection" class="timeline__buffer-section"> \
                <div id="jsSectionInner" class="timeline__buffer-section-inner"></div> \
            </div>';

        var bufferTimeline = $('#jsBufferTimeline');

        bufferTimeline.children().remove();

        $('.jsTimelineState').each(function () {
            var stateTemplate = $(bufferSectionHTMLTemplate).clone();
            var stateName = $(this).data('state');
            var stateWidth = $(this).data('percent-width');
            stateTemplate.attr('id', 'jsBufferSection'+counter);
            stateTemplate.data('interaction-id', stateName);
            stateTemplate.find('.timeline__buffer-section-inner').attr('id', 'jsSectionInner' + stateName);
            stateTemplate.css('width', stateWidth + "%");
            bufferTimeline.append(stateTemplate);
            counter++;
        });
        BufferStatus.applyBufferSettings();
    },

    applyBufferSettings: function () {
        var opacity = Timeline.SettingsJsonObject.BufferBarOpacity;
        var color = Timeline.SettingsJsonObject.BufferBarColor;
    },

    updateBuffer: function () {
        if(LanguageSelector.currentLanguageObj !== {}){
            try {
                var videoTimes = VideoPlayerInterface.iframeWindow.rtc.player.getVideoTimes(),
                    currentState = Timeline.getStateFromProgress(),
                    chapters = VideoPlayerInterface.getVideoChapters();

                //Checks if the video has reached the end and prevents the introduction buffer bar loading
                if(Timeline.getProgress() !== 1){
                    if(isInArray(currentState,BufferStatus.seenStates)){
                        $.each(chapters, function(state, chapter) {
                            if (videoTimes.buffered > chapter.start + chapter.duration) {
                                BufferStatus.updateStateBufferProgress(state, 100);
                            } else {
                                BufferStatus.updateStateBufferProgress(
                                    state,
                                    ((videoTimes.buffered - chapter.start) / chapter.duration) * 100
                                );
                            }
                        });
                    }
                }





















