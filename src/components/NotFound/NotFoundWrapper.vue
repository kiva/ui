<template>
	<div>
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
			<router-link :to="redirectToMyKivaHomepage ? '/mykiva' : '/portfolio'">
				My portfolio
			</router-link>
		</div>

		<p class="tw-text-center">
			If you need us, we’re always available via email at
			<a href="mailto:contactus@kiva.org">contactus@kiva.org</a>.
		</p>
	</div>
</template>

<script setup>
import {
	inject,
} from 'vue';
import useMyKivaHome from '#src/composables/useMyKivaHome';

const apollo = inject('apollo');
const $kvTrackEvent = inject('$kvTrackEvent');

const { redirectToMyKivaHomepage } = useMyKivaHome(apollo, $kvTrackEvent);

</script>
