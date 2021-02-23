<template>
	<router-link
		v-if="count > 0"
		:to="basketLink"
		class="basket-bar hide-for-large"
		:class="{'basket-bar--floating' : floating}"
		v-kv-track-event="['BasketBar','click-Basket']"
	>
		<template v-if="floating">
			<kv-icon
				v-if="floating"
				class="basket-bar__icon"
				name="cart"
				:from-sprite="true"
			/>
			<span class="basket-bar__count">{{ count }}</span>
			<span class="show-for-sr">items in your cart</span>
		</template>

		<template v-else>
			Basket ({{ count }})
		</template>
	</router-link>
</template>

<script>
import countQuery from '@/graphql/query/basketCount.graphql';
import KvIcon from '@/components/Kv/KvIcon';

export default {
	components: {
		KvIcon
	},
	inject: ['apollo', 'cookieStore'],
	data() {
		return {
			count: 0
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

<style lang="scss" scoped>
@import 'settings';

.basket-bar {
	display: block;
	position: fixed;
	bottom: 0;
	width: 100%;
	box-shadow: 0 -1px 3px 0 rgba(51, 51, 51, 0.3);
	transition: bottom 500ms ease;
	text-align: center;
	padding: rem-calc(18) rem-calc(36);
	color: $white;
	background-color: $kiva-accent-blue;
	font-size: rem-calc(20);
	font-weight: normal;
	z-index: 1000;

	&:hover,
	&:focus {
		color: $white;
		background-color: $kiva-accent-darkblue;
		text-decoration: none;
	}

	&__icon {
		flex-shrink: 0;
		fill: $white;
		width: rem-calc(20);
		height: rem-calc(20);
	}
}

.basket-bar--floating {
	display: flex;
	align-items: center;
	justify-content: center;
	bottom: 1rem;
	right: 1rem;
	width: auto;
	min-width: rem-calc(60);
	height: rem-calc(60);
	padding: rem-calc(12);
	border-radius: rem-calc(60);
}

</style>
