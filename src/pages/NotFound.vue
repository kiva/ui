<template>
	<div>
		<p>Not found</p>
	</div>
</template>

<script>
export default {
	name: 'NotFound',
	beforeRouteEnter(to, from, next) {
		if (typeof window !== 'undefined') {
			// No routes match our path, so force a page refresh to that path for other apps to handle.
			window.location = to.fullPath;
		} else {
			// We're in a server environment, so redirecting would just bring us back here.
			// Instead, we'll just render this page as normal.
			next();
		}
	},
};
</script>
