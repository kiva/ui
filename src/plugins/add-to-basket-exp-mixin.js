import logReadQueryError from '#src/util/logReadQueryError';
import { readBoolSetting } from '#src/util/settingsUtils';
import uiConfigSettingQuery from '#src/graphql/query/uiConfigSetting.graphql';

const NEW_ADD_TO_BASKET_KEY = 'new_atb_experience_enable';

export default {
	inject: ['apollo'],
	data() {
		return {
			enableAddToBasketExp: false,
		};
	},
	emits: ['show-cart-modal'],
	created() {
		this.apollo.query({
			query: uiConfigSettingQuery,
			variables: {
				key: NEW_ADD_TO_BASKET_KEY,
			}
		}).then(({ data }) => {
			this.enableAddToBasketExp = readBoolSetting(data, 'general.uiConfigSetting.value');
		}).catch(e => {
			logReadQueryError(e, 'New Add to basket experience');
		});
	},
	methods: {
		showCartModal(payload) {
			this.$emit('show-cart-modal', payload);
		},
	},
	computed: {
		isInExperimentPages() {
			return this.$route.path.includes('lend-by-category') || this.$route.path.includes('lend/filter');
		},
	}
};
