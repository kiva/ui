<template>
	<www-page class="autolending" :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h1>Auto-lending preferences</h1>
				<h2>Make the impact you want even if you’re away from your account for a while</h2>
			</div>
		</div>
		<div class="row column">
			<!-- main toggles -->
			<div class="setting-group">
				<main-toggle />
				<gender-radios />
			</div>
			<!-- basic criteria -->
			<div class="setting-group">
				<h2>Auto-lending criteria</h2>
				<floating-counter class="show-for-medium" />
				<!-- row for criteria components -->
			</div>
			<!-- advanced settings -->
			<!-- save button -->
			<save-button class="show-for-medium" />
		</div>
		<!-- mobile-only footer -->
		<div class="mobile-footer hide-for-medium">
			<mobile-counter />
			<save-button :show-warning="false" />
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import WwwPage from '@/components/WwwFrame/WwwPage';
import initAutolending from '@/graphql/mutation/autolending/initAutolending.graphql';
import autolendingQuery from '@/graphql/query/autolending/autolendingPage.graphql';
import FloatingCounter from './FloatingCounter';
import MainToggle from './MainToggle';
import GenderRadios from './GenderRadios';
import MobileCounter from './MobileCounter';
import SaveButton from './SaveButton';

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
		FloatingCounter,
		MainToggle,
		GenderRadios,
		MobileCounter,
		SaveButton,
	},
	data() {
		return {
			isChanged: false,
		};
	},
	apollo: {
		query: autolendingQuery,
		preFetch(config, client) {
			return client.mutate({ mutation: initAutolending })
				.then(() => client.query({ query: autolendingQuery }));
		},
		result({ data }) {
			this.isChanged = !!_get(data, 'autolending.profileChanged');
		},
	},
	mounted() {
		window.addEventListener('beforeunload', this.onLeave);
	},
	beforeDestroy() {
		window.removeEventListener('beforeunload', this.onLeave);
	},
	methods: {
		onLeave(event) {
			if (this.isChanged) {
				// eslint-disable-next-line no-param-reassign
				event.returnValue = 'You have unsaved settings! Are you sure you want to leave?';
			}
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

$autolending-font-size: rem-calc(18.8);

.autolending {
	.title-area {
		padding: 1.625rem 0;
		margin-bottom: 2rem;
		background-color: $white;
	}

	.setting-group {
		position: relative;
		margin: 2rem 0;
		border-bottom: 1px solid $kiva-stroke-gray;

		label {
			font-size: $autolending-font-size;
		}
	}

	.mobile-footer {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		background-color: $white;
		box-shadow: 0 -2px 9px 0 rgba(0, 0, 0, 0.1);

		.save-button-wrapper {
			padding: 0 1rem 0.5rem;

			.button {
				width: 100%;
			}
		}
	}
}
</style>
