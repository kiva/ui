<template>
	<div>
		<div v-if="prodRoutes.length">
			<h2 class="tw-mb-4">
				Prod Routes
			</h2>
			<ul class="tw-list-disc tw-list-inside">
				<li v-for="route in prodRoutes" :key="route.path">
					<router-link :to="route.path">
						<!-- eslint-disable-next-line -->
						{{ route.path.replace('/','') }} <span v-if="route.name !== 'no-name'">({{ route.name }})</span>
					</router-link>
				</li>
			</ul>
		</div>
		<div v-if="devRoutes.length">
			<h2 class="tw-mb-4">
				Dev Routes
			</h2>
			<ul class="tw-list-disc tw-list-inside">
				<li v-for="route in devRoutes" :key="route.path">
					<router-link :to="route.path">
						<!-- eslint-disable-next-line -->
						{{ route.path.replace('/','') }} <small v-if="route.name !== 'no-name'">({{ route.name }})</small>
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import _orderBy from 'lodash/orderBy';

export default {
	data() {
		return {
			devRoutes: [],
			prodRoutes: [],
		};
	},
	created() {
		this.$router.options.routes = _orderBy(this.$router.options.routes, [route => route.path.toLowerCase()]);

		this.$router.options.routes.forEach(route => {
			if (route.status === 'dev') {
				this.devRoutes.push({
					name: route.name ? route.name : 'no-name',
					path: route.path ? route.path : 'no-path',
					status: route.status ? route.status : 'no-status',
				});
			} else {
				this.prodRoutes.push({
					name: route.name ? route.name : 'no-name',
					path: route.path ? route.path : 'no-path',
					status: route.status ? route.status : 'no-status',
				});
			}
		});
	},
};
</script>
