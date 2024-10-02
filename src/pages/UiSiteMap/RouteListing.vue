<template>
	<div>
		<div v-if="prodRoutes.length">
			<h2 class="tw-mb-4">
				Prod Routes
			</h2>
			<ul class="tw-list-disc tw-list-inside tw-mb-4">
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
			<ul class="tw-list-disc tw-list-inside tw-mb-4">
				<li v-for="route in devRoutes" :key="route.path">
					<router-link :to="route.path">
						<!-- eslint-disable-next-line -->
						{{ route.path.replace('/','') }} <small v-if="route.name !== 'no-name'">({{ route.name }})</small>
					</router-link>
				</li>
			</ul>
		</div>
		<div v-if="redirectRoutes.length">
			<h2 class="tw-mb-4">
				Redirects
			</h2>
			<ul class="tw-list-disc tw-list-inside tw-mb-4">
				<li v-for="route in redirectRoutes" :key="route.path">
					<router-link :to="route.path">
						<!-- eslint-disable-next-line -->
						{{ route.path.replace('/','') }} <small v-if="route.name !== 'no-name'">({{ route.name }})</small>
					</router-link>
					&rarr;
					<router-link :to="route.redirect">
						<!-- eslint-disable-next-line -->
						{{ route.redirect }}
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
import _orderBy from 'lodash/orderBy';

export default {
	name: 'RouteListing',
	data() {
		return {
			devRoutes: [],
			prodRoutes: [],
			redirectRoutes: [],
		};
	},
	created() {
		this.$router.options.routes = _orderBy(this.$router.options.routes, [route => route.path.toLowerCase()]);

		const defaults = {
			name: 'no-name',
			path: 'no-path',
			status: 'no-status',
		};

		this.$router.options.routes.forEach(route => {
			const routeWithDefaults = { ...defaults, ...route };
			if (route.redirect) {
				return this.redirectRoutes.push(routeWithDefaults);
			}
			if (route.status === 'dev') {
				return this.devRoutes.push(routeWithDefaults);
			}

			this.prodRoutes.push(routeWithDefaults);
		});
	},
};
</script>
