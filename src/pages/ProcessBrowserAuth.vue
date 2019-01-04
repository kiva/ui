<template>
	<div></div>
</template>

<script>
import { WebAuth } from 'auth0-js';

export default {
	inject: ['auth0Config'],
	mounted() {
		const webAuth = new WebAuth({
			domain: this.auth0Config.domain,
			clientID: this.auth0Config.clientID,
		});
		webAuth.popup.callback();
	},
};
</script>
