<template>
	<www-page>
		<kv-page-container
			class="tw-pt-4 tw-pb-8"
		>
			<h2 class="tw-text-center tw-mb-2">
				The page you're looking for has gone missing!
			</h2>
			<p class="tw-text-center">
				Please double check the spelling of the URL, or try one of these links:
			</p>

			<div class="tw-flex tw-flex-col tw-text-center tw-my-5 tw-gap-y-2 tw-text-subhead">
				<router-link to="/">
					Home
				</router-link>
				<router-link to="/lend">
					Lend
				</router-link>
				<router-link to="/borrow">
					Borrow
				</router-link>
				<router-link to="/blog">
					Blog
				</router-link>
				<router-link to="/portfolio">
					My portfolio
				</router-link>
			</div>

			<p class="tw-text-center">
				If you need us, we’re always available via email at
				<a href="mailto:contactus@kiva.org">contactus@kiva.org</a>.
			</p>
		</kv-page-container>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	name: 'NotFound',
	components: {
		WwwPage,
		KvPageContainer,
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
