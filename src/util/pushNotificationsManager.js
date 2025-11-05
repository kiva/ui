export function registerServiceWorker() {
	return new Promise((resolve, reject) => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.register('/js/kv-notifications/kvPushNotificationsServiceWorker.js', { scope: '/' })
				.then(() => {
					return navigator.serviceWorker.ready
						.then(registration => {
							return registration.pushManager.subscribe({ userVisibleOnly: true })
								.then(subscription => {
									const fetchFail = () => {
										subscription.unsubscribe();
										// eslint-disable-next-line max-len
										throw new Error('Oops - setting up notifications didn\'t work. Please refresh the page and try again.');
									};
									return fetch('/ajax/addPushEndpoint', { endpoint: subscription.endpoint })
										.then(response => {
											if (!response.ok) {
												fetchFail();
											}
											return response.json();
										})
										.then(data => {
											if (data.success) {
												resolve();
											} else {
												fetchFail();
											}
										});
								});
						});
				})
				.catch(error => {
					if (!error) {
						reject('Oops - setting up notifications didn\'t work.');
					}
					reject(error);
				});
		} else {
			reject('Oops - setting up notifications didn\'t work.');
		}
	});
}

export function isSubscribed() {
	return new Promise((resolve, reject) => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistration()
				.then(registration => {
					if (registration) {
						return registration.pushManager.getSubscription()
							.then(subscription => {
								if (subscription) {
									resolve();
								} else {
									reject();
								}
							})
							.catch(error => {
								reject(error);
							});
					}
					reject();
				})
				.catch(error => {
					reject(error);
				});
		} else {
			reject();
		}
	});
}

export function unsubscribe() {
	return new Promise((resolve, reject) => {
		if ('serviceWorker' in navigator) {
			navigator.serviceWorker.getRegistration()
				.then(registration => {
					if (registration) {
						return registration.pushManager.getSubscription()
							.then(subscription => {
								const fetchFail = () => {
									// eslint-disable-next-line max-len
									throw new Error('Oops - unsubscribing didn\'t work. Please refresh the page and try again.');
								};
								return fetch('/ajax/removePushEndpoint', { endpoint: subscription.endpoint })
									.then(response => {
										if (!response.ok) {
											fetchFail();
										}
										return response.json();
									})
									.then(res => {
										if (res.success || res.message === 'no such token') {
											subscription.unsubscribe();
											resolve();
										} else {
											fetchFail();
										}
									});
							});
					}
					reject();
				})
				.catch(() => {
					reject('Oops - unsubscribing didn\'t work. Please refresh the page and try again.');
				});
		} else {
			reject('Oops - unsubscribing didn\'t work. Please refresh the page and try again.');
		}
	});
}
