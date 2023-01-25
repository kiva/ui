<template>
	<!-- eslint-disable max-len -->
	<div
		v-if="count > 0 && !hideBasketBar"
		class="basket-bar tw-flex md:tw-hidden tw-fixed tw-z-sticky"
		:class="[
			{ 'tw-w-full tw-bg-primary tw-border-t tw-border-tertiary tw-py-1 tw-px-2 tw-left-0 tw-bottom-0' : !floating },
			{ 'tw-w-auto tw-items-center tw-justify-center tw-bottom-2 tw-right-2 tw-rounded-full tw-p-1.5 ': floating }
		]"
	>
		<!--eslint-enable max-len -->
		<kv-button
			:to="basketLink"
			v-kv-track-event="['BasketBar','click-Basket']"
			:class="[
				{ 'tw-w-full tw-shadow-sm' : !floating },
			]"
		>
			<span v-if="floating" class="tw-flex tw-content-center tw-justify-center tw-gap-1">
				<kv-material-icon
					:icon="mdiCart"
					class="tw-w-3 tw-h-3"
				/>
				<span>{{ count }}</span>
				<span class="tw-sr-only">items in your cart</span>
			</span>
			<template v-else>
				Basket ({{ count }})
			</template>
		</kv-button>
	</div>
</template>

<script>
import countQuery from '@/graphql/query/basketCount.graphql';
import { mdiCart } from '@mdi/js';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'TheBasketBar',
	components: {
		KvButton,
		KvMaterialIcon
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			count: 0,
			mdiCart
		};
	},
	apollo: {
		query: countQuery,
		preFetch: true,
		result({ data }) {
			this.count = data?.shop?.nonTrivialItemCount || 0;
		}
	},
	props: {
		corporate: {
			type: Boolean,
			default: false
		},
		floating: {
			type: Boolean,
			default: false
		},
	},
	computed: {
		basketLink() {
			return this.corporate ? this.addHashToRoute('show-basket') : '/basket';
		},
		hideBasketBar() {
			// hide this banner on managed lending landing + checkout pages
			const routeExclusions = ['/join-team', '/checkout', '/lend'];
			const routePath = this.$route?.path;
			const matchedRoutes = routeExclusions.filter(item => {
				return routePath.indexOf(item) !== -1;
			});
			return matchedRoutes.length > 0;
		}
	},
	methods: {
		addHashToRoute(hash) {
			const route = { ...this.$route };
			route.hash = hash;
			return route;
		},
	}
};
</script>
