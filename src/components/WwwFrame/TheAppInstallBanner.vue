<template>
	<div>
		<button v-if="isPromptVisible" @click="showInstall">
			Install our cool app
		</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			deferredPrompt: null,
			isPromptVisible: false
		};
	},
	methods: {
		showInstall() {
			// hide our user interface that shows our install app button
			this.isPromptVisible = false;
			// Show the prompt
			this.deferredPrompt.prompt();
			// Wait for the user to respond to the prompt
			this.deferredPrompt.userChoice
				.then(choiceResult => {
					if (choiceResult.outcome === 'accepted') {
						console.log('User accepted the intall prompt');
					} else {
						console.log('User dismissed the intall prompt');
					}
					this.deferredPrompt = null;
				});
		}
	},
	mounted() {
		// https://developers.google.com/web/fundamentals/app-install-banners/native#prefer_related
		window.addEventListener('beforeinstallprompt', e => {
			console.log('beforeinstallprompt fired');
			console.log(e);
			// Prevent Chrome 67 and earlier from automatically showing the prompt
			e.preventDefault();
			// Stash the event so it can be triggered later.
			this.deferredPrompt = e;
			// Update UI notify the user they can add to home screen
			this.isPromptVisible = true;
		});
	}
};
</script>

<style lang="scss" scoped>

</style>
