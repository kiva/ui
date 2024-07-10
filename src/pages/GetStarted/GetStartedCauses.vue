<template>
	<div class="causes">
		<kv-progress-bar class="progress-bar" value="33" max="100" />
		<form
			class="get-started__form tw-bg-primary tw-rounded"
			@submit.prevent="onSubmitForm"
			:disabled="selectedCauses.length === 0"
		>
			<fieldset>
				<div class="row align-middle collapse">
					<div class="small-12 xlarge-5 columns get-started__intro">
						<h1 class="tw-text-h2">
							Choose causes <br class="lu">you care about
						</h1>
						<p class="tw-text-subhead tw-text-secondary">
							With Kiva, you can choose causes you care about and borrowers to support.
							You’ll receive regular updates from borrowers as they receive and repay each loan.
						</p>
					</div>
					<div class="small-12 xlarge-7 columns">
						<ul class="get-started__list">
							<li
								class="get-started__list-item"
								v-for="cause in causeList"
								:key="`cause-${cause.id}`"
							>
								<kv-cause-selector
									class="get-started__cause-selector"
									:cause="cause.name"
									:checked="cause.checked"
									@change="onChangeCauseSelection($event, cause.id)"
								/>
							</li>
						</ul>
						<p
							class="get-started__summary tw-text-center"
							v-html="summaryText"
						></p>
					</div>
					<kv-button
						class="get-started__submit-btn"
						type="submit"
						:disabled="selectedCauses.length === 0"
						@click.native="trackTransition"
					>
						Next
					</kv-button>
				</div>
			</fieldset>
		</form>
	</div>
</template>

<script>
import { gql } from '@apollo/client';

import KvButton from '@/components/Kv/KvButton';
import KvCauseSelector from '@/components/Kv/KvCauseSelector';
import KvProgressBar from '@/components/Kv/KvProgressBar';

const lendingPreferencesCauses = gql`query lendingPreferences($visitorId: String) {
	general {
		lendingPreferences(visitorId: $visitorId) {
			id
			causes {
				values {
					id
				}
			}
		}
	}
}`;

export default {
	name: 'GetStartedCauses',
	components: {
		KvButton,
		KvCauseSelector,
		KvProgressBar,
	},
	metaInfo: {
		title: 'Get Started'
	},
	inject: ['apollo', 'cookieStore'],
	apollo: {
		query: lendingPreferencesCauses,
		preFetch: true,
		preFetchVariables({ cookieStore }) {
			return {
				visitorId: cookieStore.get('uiv') || null
			};
		},
		variables() {
			return {
				visitorId: this.cookieStore.get('uiv') || null
			};
		},
		result({ data }) {
			const causesValues = data?.general?.lendingPreferences?.causes?.values || [];
			const previouslySelectedCauses = causesValues.map(causeObj => {
				return causeObj.id;
			});
			this.causeList.forEach((causeObj, index) => {
				if (previouslySelectedCauses.includes(causeObj.id)) {
					console.log('checking', causeObj.id);
					this.causeList[index].checked = true;
				}
			});
		}

	},
	data() {
		return {
			causeList: [
				{
					id: 5,
					name: 'women',
					checked: false,
				},
				{
					id: 6,
					name: 'shelter',
					checked: false,
				},
				{
					id: 4,
					name: 'education',
					checked: false,
				},
				{
					id: 102,
					name: 'technology',
					checked: false,
				},
				{
					id: 8,
					name: 'agriculture',
					checked: false,
				},
				{
					id: 96,
					name: 'COVID-19',
					checked: false,
				},
				{
					id: 25,
					name: 'health',
					checked: false,
				},
				{
					id: 32,
					name: 'refugees',
					checked: false,
				},
				{
					id: 29,
					name: 'arts',
					checked: false
				}
			]
		};
	},
	computed: {
		selectedCauses() {
			return this.causeList.filter(cause => cause.checked);
		},
		selectedCausesIds() {
			return this.selectedCauses.map(cause => cause.id);
		},
		summaryText() {
			if (this.selectedCauses.length === 0) {
				return `<b>Pick up to ${this.causeList.length} causes to lend to.</b>`;
			}

			let text = 'We\'ll show you loans for ';
			if (this.selectedCauses.length === 1) {
				return `${text} <b>${this.selectedCauses[0].name}</b>.`;
			}
			if (this.selectedCauses.length === 2) {
				return `${text} <b>${this.selectedCauses[0].name}</b> and <b>${this.selectedCauses[1].name}</b>.`;
			}
			this.selectedCauses.forEach((cause, index) => {
				if (index < this.selectedCauses.length - 1) {
					text += `<b>${cause.name}</b>, `;
				} else {
					text += `and <b>${cause.name}</b>.`;
				}
			});
			return text;
		}
	},
	methods: {
		onChangeCauseSelection(value, causeId) {
			this.causeList.find(cause => cause.id === causeId).checked = value;
			if (value === true) {
				this.$kvTrackEvent(
					'Lending',
					'click-cause-selector',
					this.causeList.find(cause => cause.id === causeId).name
				);
			}
		},
		async onSubmitForm() {
			const uiv = this.cookieStore.get('uiv');

			const userCauseIds = this.selectedCauses.map(cause => cause.id);

			try {
				const saveLendingPreferences = gql`mutation savePrefs($visitorId: String!, $causes: [Int]) {
					general {
						saveLendingPreferences(visitorId: $visitorId, causes: $causes) {
							id
						}
					}
				}`;

				await this.apollo.mutate({
					mutation: saveLendingPreferences,
					variables: {
						visitorId: uiv,
						causes: userCauseIds
					}
				});
				this.$router.push({
					path: '/get-started/places'
				});
			} catch (err) {
				console.error(err);
				this.$showTipMsg('There was a problem saving your causes', 'error');
			}
		},
		trackTransition() {
			this.$kvTrackEvent(
				'Lending',
				'click-cause-next',
				this.selectedCausesIds.join()
			);
		}
	},
};
</script>

<style lang="scss" scoped>
@import 'settings';

.get-started {
	&__form {
		padding: 1.5rem;
		margin: 2rem auto;
		width: 98%;
		max-width: rem-calc(1088);

		@include breakpoint(medium) {
			box-shadow: 0 2px 100px 0 rgba(0, 0, 0, 0.1);
		}

		@include breakpoint(large) {
			margin: 4.5rem auto;
			padding: 0.75rem 2.65rem 0.75rem 3.75rem;
		}
	}

	&__intro {
		text-align: center;
		margin-bottom: 1rem;

		@include breakpoint(xlarge) {
			text-align: left;
		}

		h1 {
			margin-bottom: 1.5rem;

			@include breakpoint(large) {
				margin-bottom: 0;
			}
		}

		p {
			@include breakpoint(xlarge) {
				padding: 1rem 1.5rem 1rem 0;
			}
		}
	}

	&__list {
		display: flex;
		flex-wrap: wrap;
		justify-items: center;
		justify-content: center;
		max-width: 30.5rem;
		margin: 0 auto;

		@include breakpoint(xlarge) {
			margin: 2rem 0 1.5rem auto;
		}
	}

	&__list-item {
		width: 33.3%;
		min-width: rem-calc(100);
		display: flex;
		justify-content: center;
	}

	&__cause-selector {
		width: 100%;
		margin: 10%;

		@include breakpoint(xlarge) {
			margin: 1.25rem;
		}
	}

	&__summary {
		max-width: 30.5rem;
		margin: 0 0 2.5rem auto;

		::v-deep b {
			text-transform: capitalize;
		}
	}

	&__submit-btn {
		display: block;
		margin: 0 1.25rem 3rem auto;
	}
}
</style>
