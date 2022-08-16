const trackOptEvent = (eventName, eventTags) => {
	if (typeof window === 'undefined') {
		return;
	}

	window.optimizely = window.optimizely || [];
	window.optimizely.push({
		type: 'event',
		name: eventName,
		tags: eventTags
	});
};

export default trackOptEvent;
