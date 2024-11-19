<template>
	<www-page>
		<kv-page-container
			class="tw-pt-4 tw-pb-8"
		>
			<not-found-wrapper />
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '#src/components/WwwFrame/WwwPage';
import NotFoundWrapper from '#src/components/NotFound/NotFoundWrapper';
import KvPageContainer from '@kiva/kv-components/dist/components/KvPageContainer';

export default {
	name: 'NotFound',
	components: {
		WwwPage,
		KvPageContainer,
		NotFoundWrapper,
	},
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
