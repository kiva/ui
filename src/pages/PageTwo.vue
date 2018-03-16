<template>
	<www-page>
		<div class="row">
			<div class="small-12 columns">
				<h1>Another Page</h1>
				<p>This is page two!</p>
				<p><router-link to="/">go home</router-link></p>
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: { WwwPage },
	metaInfo: {
		title: 'Page two'
	},
	asyncData({ store }) {
		return store.dispatch('hello');
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
