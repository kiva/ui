<template>
	<kv-button @click.native="addToBasket"
		:v-kv-track-event="`['Lending', 'Add to basket', 'lend-button-click', ${loanId}, 'true']`"
		v-if="!loading"
	>
		<slot>Lend now</slot>
	</kv-button>
	<kv-button v-else>
		<kv-loading-spinner />
		Adding to basket
	</kv-button>
</template>

<script>
import numeral from 'numeral';
import addToBasketMutation from '@/graphql/mutation/addToBasket.graphql';
import loanCardBasketed from '@/graphql/query/loanCardBasketed.graphql';
import KvButton from '@/components/Kv/KvButton';
import KvLoadingSpinner from '@/components/Kv/KvLoadingSpinner';

export default {
	components: {
		KvButton,
		KvLoadingSpinner,
	},
	inject: ['apollo'],
	props: {
		loanId: {
			type: Number,
			default: null
		},
		price: {
			type: [Number, String],
			default: 25,
		},
	},
	data() {
		return {
			loading: false,
		};
	},
	methods: {
		addToBasket() {
			this.loading = true;
			this.apollo.mutate({
				mutation: addToBasketMutation,
				variables: {
					id: this.loanId,
					price: numeral(this.price).format('0.00'),
				},
			}).then(() => this.apollo.query({
				query: loanCardBasketed,
				variables: {
					id: this.loanId,
				},
				fetchPolicy: 'network-only',
			})).finally(() => {
				this.loading = false;
			});
		}
	},
};

</script>

<style lang="scss" scoped>
@import 'settings';

.loading-spinner {
	width: 1.5rem;
	height: 1.5rem;
	vertical-align: middle;
	margin-right: 3px;

	.line {
		background: $white;
	}
}

</style>
