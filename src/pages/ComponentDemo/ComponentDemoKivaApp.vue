<template>
	<www-page>
		<div class="row page-content">
			<div class="small-12 columns">
				<h1>Component Demos (REQUIRE Kiva App Access)</h1>
				<p>Components placed here are for demo only and may not represent the final use case.</p>
				<br>
				<!-- TODO: Remove after testing VUE-97/LC-41 -->
				<hr>
				<h3>Experimental Experiment Assignment:</h3>
				<p>Assigned: {{ assignedVersion }}</p>

				<hr>
				<br>
				<a href="/ui-site-map">Return to Ui Site Map</a>
				<br>
			</div>
		</div>
	</www-page>
</template>

<script>
import expQuery from '@/graphql/query/experimentSetting.graphql';
import verQuery from '@/graphql/query/experimentAssignment.graphql';
import experimentVersionFragment from '@/graphql/fragments/experimentVersion.graphql';
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage
	},
	inject: ['apollo'],
	metaInfo: {
		title: 'Component Demo - Kiva App'
	},
	data() {
		return {
			assignedVersion: null,
		};
	},
	apollo: {
		// example prefetch function to get an experiment setting and then an assigned version
		preFetch(config, client) {
			return new Promise((resolve, reject) => {
				// first query the setting
				client.query({
					query: expQuery,
					variables: { key: 'test' },
				}).then(() => {
					// with the cache now primed, query for a version assignment
					client.query({
						query: verQuery,
						variables: { id: 'test' },
					}).then(resolve).catch(reject);
				}).catch(reject);
			});
		},
	},
	created() {
		// read the experiment version assignment from the cache for ssr
		const data = this.apollo.readFragment({
			id: 'Experiment:test',
			fragment: experimentVersionFragment,
		}) || {};
		this.assignedVersion = data.version;

		// alternatively, comment out the above and the preFetch function and uncomment this
		// section to only do the experiment assignment from the client.
		// this.apollo.query({
		// 	query: expQuery,
		// 	variables: { key: 'test' },
		// }).then(() => {
		// 	this.apollo.query({
		// 		query: verQuery,
		// 		variables: { id: 'test' },
		// 	}).then(({ data }) => {
		// 		this.assignedVersion = _get(data, 'experiment.version');
		// 	});
		// });
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}
</style>
