<template>
	<div>
		<div v-if="prodRoutes.length">
			<h2 class="tw-mb-4">
				Prod Routes
			</h2>
			<ul class="tw-list-disc tw-list-inside tw-mb-4">
				<li v-for="route in prodRoutes" :key="route.path" class="tw-mb-1">
					<router-link :to="pathWithParams(route)">
						<!-- eslint-disable-next-line -->
						{{ pathWithParams(route).replace('/','') }} <span v-if="route.name !== 'no-name'">({{ route.name }})</span>
					</router-link>
					<input
						class="tw-ml-1 tw-px-1 tw-border"
						type="text"
						v-for="(value, key) in route.params"
						:key="key"
						v-model="route.params[key]"
						:placeholder="`set ${key}`"
					>
				</li>
			</ul>
		</div>
		<div v-if="devRoutes.length">
			<h2 class="tw-mb-4">
				Dev Routes
			</h2>
			<ul class="tw-list-disc tw-list-inside tw-mb-4">
				<li v-for="route in devRoutes" :key="route.path" class="tw-mb-1">
					<router-link :to="pathWithParams(route)">
						<!-- eslint-disable-next-line -->
						{{ pathWithParams(route).replace('/','') }} <small v-if="route.name !== 'no-name'">({{ route.name }})</small>
					</router-link>
					<input
						class="tw-ml-1 tw-px-1 tw-border"
						type="text"
						v-for="(value, key) in route.params"
						:key="key"
						v-model="route.params[key]"
						:placeholder="`set ${key}`"
					>
				</li>
			</ul>
		</div>
		<div v-if="redirectRoutes.length">
			<h2 class="tw-mb-4">
				Redirects
			</h2>
			<ul class="tw-list-disc tw-list-inside tw-mb-4">
				<li v-for="route in redirectRoutes" :key="route.path" class="tw-mb-1">
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
			paramRegex: /:\w+/g,
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
			const matchesArr = route.path.match(this.paramRegex) ?? [];
			const params = matchesArr.reduce((matchesObj, match) => ({ ...matchesObj, [match]: null }), {});
			const routeWithDefaults = {
				...defaults,
				...route,
				params,
			};
			if (route.redirect) {
				return this.redirectRoutes.push(routeWithDefaults);
			}
			if (route.status === 'dev') {
				return this.devRoutes.push(routeWithDefaults);
			}

			this.prodRoutes.push(routeWithDefaults);
		});
	},
	methods: {
		pathWithParams(route) {
			return route.path.replace(this.paramRegex, match => route.params[match] || match);
		}
	},
};
</script>
