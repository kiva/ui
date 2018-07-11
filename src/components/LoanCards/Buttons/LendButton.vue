<template>
	<kv-button @click.native="addToBasket"
		:v-kv-track-event="`['Lending', 'Add to basket', 'lend-button-click', ${loanId}, 'true']`"
	>
		<slot>Lend now</slot>
	</kv-button>
</template>

<script>
import numeral from 'numeral';
import addToBasketMutation from '@/graphql/mutation/addToBasket.graphql';
import basketCountQuery from '@/graphql/query/basketCount.graphql';
import basketItemsQuery from '@/graphql/query/basketItems.graphql';
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
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
	methods: {
		addToBasket() {
			this.apollo.mutate({
				mutation: addToBasketMutation,
				variables: {
					id: this.loanId,
					price: numeral(this.price).format('0.00'),
				},
				refetchQueries: [
					{ query: basketCountQuery },
					{ query: basketItemsQuery },
				]
			});
		}
	},
};

</script>
