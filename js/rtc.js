window.rtc = window.rtc || {};
window.rtc.strings = {
	get: function( container, key ) {
		return rtc.strings[container][key];
	},
	session: {
		preparedFor: 'Prepared for',
		from: 'from'
	},
	mailto: {
		mailBody: "Hi {{firstname}},%0A%0A{{message}}%0A%0AI wanted to share a personalized video presentation built specifically for you. Click on the link below to learn more:%0A%0A{{link}}%0A%0A{{fullname}}",
		mailSubject: "Have you seen this personalized video service?",
		ifSendDirectlyFailed: "If you were unable to send the email please copy and paste the content below into your email client:"
	},
	mailtoTooltips: {
		sendDirectly: 'Send directly from your email client – useful if recipients have overzealous spam filters',
		sendVia: 'Our presenter will send the link on your behalf'
	},
	mailtoCardButtonLabels: {
		sendVia: "Send via Security First",
		sendDirectly: "Send directly"
	},
	main: {
		organicPolicyDisclaimer: "The information contained in this video is for demonstration purposes only",
		timeline: {
			Introduction: { start: 0, label: "Introduction", state: "START" },
			YourCoverage: { start: 16, label: "Your Coverage", state: "START" },
			ImportantToKnow: { start: 32, label: "Important To Know", state: "START" },
			Deductibles: { start: 52, label: "Deductibles", state: "START" },
			Discounts: { start: 66, label: "Discounts", state: "START" },
			Billing: { start: 80, label: "Billing", state: "START" },
			Thanks: { start: 90, label: "Thanks", state: "START" }
		}
	}
};
