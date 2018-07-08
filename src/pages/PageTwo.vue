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
import helloQuery from '@/graphql/query/hello.graphql';

export default {
	components: { WwwPage },
	inject: ['apollo'],
	metaInfo: {
		title: 'Page two'
	},
	apollo: {
		query: helloQuery,
		preFetch: true,
	},
	// TODO: Remove after testing VUE-37
	created() {
		this.$showTipMsg('Show Message on Page Load', 'warning');
	}
};
</script>

<style lang="scss">
@import 'settings';
</style>
