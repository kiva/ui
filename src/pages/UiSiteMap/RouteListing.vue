<template>
	<div>
		<div v-if="prodRoutes.length">
			<h2 class="tw-text-headline tw-mb-4">
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
			<h2 class="tw-text-headline tw-mb-4">
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
			<h2 class="tw-text-headline tw-mb-4">
				Redirects
			</h2>
			<ul class="tw-list-disc tw-list-inside tw-mb-4">
				<li v-for="route in redirectRoutes" :key="route.path" class="tw-mb-1">
					<router-link :to="pathWithParams(route)">
						<!-- eslint-disable-next-line -->
						{{ pathWithParams(route).replace('/','') }} <small v-if="route.name !== 'no-name'">({{ route.name }})</small>
					</router-link>
					&rarr;
					<router-link v-if="isLinkableRedirect(route.redirect)" :to="redirectTarget(route)">
						{{ redirectLabel(route) }}
					</router-link>
					<!-- A target read out of a redirect function can point outside the app's
						own routes (/lend-by-category is served externally), so link it with a
						plain anchor. <router-link> would warn about an unmatched location, and
						a full browser navigation is what the redirect itself performs. -->
					<a v-else-if="functionTarget(route)" :href="functionTarget(route)">
						{{ functionTarget(route) }}
					</a>
					<small v-else>{{ redirectLabel(route) }}</small>
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
			if (route.status === 'dev' && !this.$appConfig?.host?.includes('www.kiva.org')) {
				return this.devRoutes.push(routeWithDefaults);
			}

			this.prodRoutes.push(routeWithDefaults);
		});
	},
	methods: {
		// Substitute whatever has been typed into the param inputs, leaving the
		// `:param` placeholder in place wherever nothing has been entered yet.
		withParams(path, params) {
			return path.replace(this.paramRegex, match => params[match] || match);
		},
		pathWithParams(route) {
			return this.withParams(route.path, route.params);
		},
		// vue-router allows `redirect` to be a string, an object, or a function.
		// Only the first two are valid `to` values for <router-link>.
		isLinkableRedirect(redirect) {
			return typeof redirect === 'string'
				|| (typeof redirect === 'object' && redirect !== null);
		},
		redirectTarget(route) {
			return typeof route.redirect === 'string'
				? this.withParams(route.redirect, route.params)
				: route.redirect;
		},
		// Best-effort target for a function redirect, read from the function's
		// source. The function is deliberately never called: redirects like the
		// /lend/:category one assign to window.location in the browser and throw
		// on the server, so invoking it here would navigate away from this page.
		//
		// Instead take the first path-like literal out of the source and turn any
		// `${to.params.x}` interpolation back into `:x`, so a dynamic redirect
		// still shows where it points. Returns null when the shape isn't
		// recognisable, since a confidently wrong path is worse than no path.
		parseFunctionRedirect(redirect) {
			const literal = redirect.toString().match(/[`'"](\/[^`'"\s]*)[`'"]/);
			if (!literal) return null;
			const path = literal[1].replace(/\$\{[^}]*\bparams\.(\w+)[^}]*\}/g, ':$1');
			// Any interpolation we couldn't name means we can't trust the result.
			return path.includes('${') ? null : path;
		},
		// The resolved target of a function redirect, with any typed params
		// substituted in, or null when the source couldn't be read.
		functionTarget(route) {
			if (typeof route.redirect !== 'function') return null;
			const parsed = this.parseFunctionRedirect(route.redirect);
			return parsed ? this.withParams(parsed, route.params) : null;
		},
		redirectLabel(route) {
			const { redirect } = route;
			if (typeof redirect === 'string') return this.withParams(redirect, route.params);
			if (typeof redirect === 'function') return this.functionTarget(route) ?? '(dynamic redirect)';
			return JSON.stringify(redirect);
		},
	},
};
</script>
