<template>
	<www-page class="autolending" :gray-background="true">
		<div class="title-area">
			<div class="row column">
				<h1>Auto-lending preferences</h1>
				<h2>Make the impact you want even if you’re away from your account for a while</h2>
			</div>
		</div>
		<div class="row column settings-area">
			<!-- main toggles -->
			<div class="setting-group">
				<main-toggle />
			</div>
			<!-- basic criteria -->
			<div class="setting-group">
				<h2>Auto-lending criteria</h2>
				<floating-counter class="show-for-large" />
				<!-- row for criteria components -->
				<div class="row">
					<div class="small-12 large-6 columns">
						<gender-radios />
					</div>
					<div class="small-12 large-6 columns">
						<!-- group -->
					</div>
					<div class="small-12 large-6 columns">
						<country-filter />
					</div>
					<div class="small-12 large-6 columns">
						<sector-filter />
					</div>
				</div>
			</div>
			<!-- advanced settings -->
			<div class="row column">
				<button @click="showAdvanced = !showAdvanced" class="advanced-settings-toggle">
					{{ showAdvanced ? 'Hide' : 'Show' }} advanced settings
				</button>
			</div>
			<kv-expandable>
				<div class="row" v-show="showAdvanced">
					<div class="small-12 large-6 columns">
						<!-- loan increment -->
					</div>
					<div class="small-12 large-6 columns">
						<!-- <attribute-filter /> -->
					</div>
					<div class="small-12 large-6 columns">
						<!-- loan term -->
					</div>
					<div class="small-12 large-6 columns">
						<partner-filter />
					</div>
					<div class="small-12 large-6 columns">
						<!-- delinquency -->
					</div>
					<div class="small-12 large-6 columns">
						<!-- risk rating -->
					</div>
					<div class="small-12 large-6 columns">
						<!-- default rate -->
					</div>
				</div>
			</kv-expandable>
			<!-- save button -->
			<save-button class="show-for-large" />
		</div>
		<!-- mobile-only footer -->
		<div class="mobile-footer hide-for-large">
			<mobile-counter />
			<save-button :show-warning="false" />
		</div>
	</www-page>
</template>

<script>
import _get from 'lodash/get';
import KvExpandable from '@/components/Kv/KvExpandable';
import WwwPage from '@/components/WwwFrame/WwwPage';
import initAutolending from '@/graphql/mutation/autolending/initAutolending.graphql';
import autolendingQuery from '@/graphql/query/autolending/autolendingPage.graphql';
// import AttributeFilter from './AttributeFilter';
import CountryFilter from './CountryFilter';
import FloatingCounter from './FloatingCounter';
import MainToggle from './MainToggle';
import GenderRadios from './GenderRadios';
import MobileCounter from './MobileCounter';
import PartnerFilter from './PartnerFilter';
import SaveButton from './SaveButton';
import SectorFilter from './SectorFilter';

export default {
	inject: ['apollo'],
	components: {
		WwwPage,
		KvExpandable,
		// AttributeFilter,
		CountryFilter,
		FloatingCounter,
		MainToggle,
		GenderRadios,
		MobileCounter,
		PartnerFilter,
		SaveButton,
		SectorFilter,
	},
	data() {
		return {
			isChanged: false,
			showAdvanced: false,
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

	.settings-area {
		margin-bottom: 5rem;
	}

	label {
		font-size: $autolending-font-size;
	}

	.setting-group {
		position: relative;
		margin: 2rem 0;
		border-bottom: 1px solid $kiva-stroke-gray;
	}

	.advanced-settings-toggle {
		color: $kiva-textlink;
		font-weight: 300;
		margin-bottom: 2rem;
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
