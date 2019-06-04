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

if(!isInArray(currentState,BufferStatus.seenStates)){
                    BufferStatus.seenStates.push(currentState);
                }
                BufferStatus.clearOldBuffers(currentState);
            } catch (e) {}
        }
    },

    clearOldBuffers: function (currentState) {
        for (var i=0; i < BufferStatus.seenStates.length; i++){
            var state = BufferStatus.seenStates[i];
            if(state !== currentState) {
                BufferStatus.updateStateBufferProgress(state,0);
            }
        }
    },
      updateStateBufferProgress: function(state, percentage) {
        if (typeof state === "string"){
            $('#jsSectionInner'+state).css('width', percentage + "%");
        }
    }
};
var ClosedCaptionSelector = {

    initialise: function () {
        ClosedCaptionSelector.events.initialise();
        $('#jsCCOffTick').show();
        $('#jsCCOnTick').hide();
    },

    setClosedCaptions: function(value){
        var captionsOn = VideoPlayerInterface.iframeWindow.rtc.player.vars.showCaptions;
        if (value === 'on' && !captionsOn) {
            VideoPlayerInterface.iframeWindow.rtc.player.toggleCC();
            $('#jsCCOnTick').show();
            $('#jsCCOffTick').hide();
        } else if (value === 'off' && captionsOn) {
            VideoPlayerInterface.iframeWindow.rtc.player.toggleCC();
            $('#jsCCOffTick').show();
            $('#jsCCOnTick').hide();
        }
    },
 events: {
        /**
         * Link up the events and the event handlers
         */
        initialise: function() {
            $('#jsCCMenuTitle').click(ClosedCaptionSelector.events.closeCCMenu);
            $('.jsTimelineSettingsCaption').click(ClosedCaptionSelector.events.ccItemClickEventHandler);
        },

        closeCCMenu: function (e) {
            $('#jsSettingsButtonPopout').show();
            $('#jsCCSelectorPopout').hide();
            $("#jsCCMenuItem").focus();
        },

        ccItemClickEventHandler: function(e) {
            //off or on
            var newValue = $(this).data('value');
            ClosedCaptionSelector.setClosedCaptions(newValue);
        }
    }
};


var ContrastProgress = {
    enabled: false,

    initialise: function (timelineSettings){
        ContrastProgress.enabled = timelineSettings.ContrastProgressBarEnabled;

        if (ContrastProgress.enabled) {
            ContrastProgress.createContrastTimeline();
        }
    },

    createContrastTimeline: function (){
        ContrastProgress.cloneDivAppendTo("jsTimelineContainer", "jsTimelineContrast", "jsTimelineControlsCenter");
        $("#jsTimelineContrast").addClass("timeline-contrast");
        $("#jsTimelineProgressHover").addClass("timeline-contrast-hover");

        ContrastProgress.addFixedDiv();
    },

    cloneDivAppendTo: function (divId, newDivId, appendToDivID) {
        $('#' + divId).clone(true).prop('id', newDivId).appendTo('#' + appendToDivID);
    },

    addFixedDiv: function () {
        $("#jsTimelineContrast").wrapInner("<div id='jsTimelineContrastFixed'></div>");
        $("#jsTimelineContrastFixed").css('width', $("#jsTimelineContainer").width() + "px");
    },

    setContrastTimelineProgress: function (progress){
        $("#jsTimelineContrast").width($("#jsTimelineContainer").width() * progress);
    },

    /**
     * Update the labels used on the Contrast Progress bar, by cloning them into the contrast div
     */

 updateLabels: function() {
        if (!ContrastProgress.enabled) {
            return;
        }

        $("#jsTimelineContrastFixed").empty();

        /**
         * Append each timeline chapter to the contrast progress bar
         *
         * @param {number} i       the index
         * @param {jQuery} chapter the chapter element
         */
        $(".jsTimelineChapter").each(function appendChapterToContrast(i, chapter) {
            $(chapter).clone(true).appendTo("#jsTimelineContrastFixed");
        });
    }
};



















 updateLanguage: function(langCode) {
        Timeline.render(LanguageSelector.currentLanguageObj.ChapterSettings);
        $("#jsTopWrapper").removeClass("top-wrapper--no-cta top-wrapper--no-promo");
        $("#jsBottomWrapper").removeClass("bottom-wrapper--no-cta bottom-wrapper--no-promo");

        // Checks whether promo or cta button content exists. If it doesn't then it adds in a css class to resize the other elements.
        if (isEmpty(LanguageSelector.currentLanguageObj.CtaButtonSettings)) {
            $("#jsTopWrapper").addClass("top-wrapper--no-cta");
            $("#jsBottomWrapper").addClass("bottom-wrapper--no-cta");
        } else {
            CtaButtons.render(LanguageSelector.currentLanguageObj.CtaButtonSettings);
        }

        if (isEmpty(LanguageSelector.currentLanguageObj.PromoSettings)) {
            $("#jsTopWrapper").addClass("top-wrapper--no-promo");
            $("#jsBottomWrapper").addClass("bottom-wrapper--no-promo");
        } else {
            Promos.render(LanguageSelector.currentLanguageObj.PromoSettings);
        }

        //Change the text of every .translate element to current language
        $(".translate").each(function () {
            var translateId = $(this).data('translate');
            if(LanguageSelector.currentLanguageObj.hasOwnProperty(translateId)){
                $(this).text(LanguageSelector.currentLanguageObj[translateId]);
                if($(this).parent().attr('title')){
                    $(this).parent().attr('title',LanguageSelector.currentLanguageObj[translateId]);
                }
            }
        });

        //Updates the lang tag at the top of the index.php html tag
        LanguageSelector.updateLangTag(langCode);

        /*
        * If the iframe is present and its src path already contains language=xx
        * then replace the lang code with new code else append the language parameter to iframe src url
        */
        if (document.getElementById('videoPlayerIframe') != null) {
            var iframe = document.getElementById("videoPlayerIframe"),
                videoUrl = iframe.src;

            if (videoUrl.search(/language=[a-z][a-z]/) != -1) {
                videoUrl = videoUrl.replace(/language=../, "language=" + langCode);
            } else if ("en" != langCode) {
                videoUrl += '&language=' + langCode;
            }

            if (videoUrl != iframe.src) {
                iframe.src = videoUrl;
            }
        }
    },

    updateLangTag: function(newLangCode){
        $('html').attr('lang', newLangCode);
    },

    getTextByKey: function (key) {
        if(typeof LanguageSelector.currentLanguageObj[key] === 'string'){
            return LanguageSelector.currentLanguageObj[key];
        }
        return false;
    },

    /**
     * Get available languages from navigator browser object
     *
     * @param {object} nav Browser Navigator object
     *
     * @return {array|boolean}
     */
    getNavigatorLanguages: function(nav) {
        if (nav.languages) {
            return nav.languages
        }

        var languages = [];

        if (nav.language) {
            languages.push(nav.language);
        }

        if (nav.userLanguage) {
            languages.push(nav.userLanguage);
        }

        if (nav.browserLanguage) {
            languages.push(nav.browserLanguage);
        }

        return languages.length ? languages : false;
    },

    /**
     * Define the events
     */
    events: {
        /**
         * Link up the events and the event handlers
         */
        initialise: function() {
            $('#jsLanguageMenuTitle').click(LanguageSelector.events.closeLanguageMenu);
            $('.jsTimelineSettingsLanguage').click(LanguageSelector.events.languageItemClickEventHandler);
        },

        closeLanguageMenu: function (e) {
            $('#jsSettingsButtonPopout').show();
            $('#jsLanguageSelectorPopout').hide();
            $("#jsLangMenuItem").focus();
        },

        languageItemClickEventHandler: function(e) {
            var newLang = $(this).data('language');
            LanguageSelector.loadLanguageJSON(newLang);
            LanguageSelector.setLanguage(newLang);
            ClosedCaptionSelector.setClosedCaptions('off');
        }
    }
};












