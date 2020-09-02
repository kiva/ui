<template>
	<div class="causes">
		<kv-progress-bar class="progress-bar" value="33" max="100" />
		<form
			@submit.prevent="onSubmitForm"
			:disabled="selectedCauses.length === 0"
		>
			<div class="page-content">
				<fieldset>
					<div class="row">
						<div class="small-12 xlarge-5 columns causes__intro">
							<h1>Choose causes <br class="xlu">you care about</h1>
							<p>
								With Kiva, you can choose causes you care about and borrowers to support.
								You’ll get updates from borrowers as they repay their loan.
							</p>
						</div>
						<div class="small-12 xlarge-7 columns">
							<ul class="causes__list">
								<li
									class="causes__list-item"
									v-for="cause in causeList"
									:key="`cause-${cause.id}`"
								>
									<kv-cause-selector
										class="causes__cause-selector"
										:cause="cause.name"
										:checked="cause.checked"
										@change="onChangeCauseSelection($event, cause.id)"
									/>
								</li>
							</ul>
							<p
								class="causes__summary text-center"
								v-html="summaryText"
							></p>
						</div>
						<kv-button
							class="causes__submit-btn"
							type="submit"
							:disabled="selectedCauses.length === 0"
						>
							Next
						</kv-button>
					</div>
				</fieldset>
			</div>
		</form>
	</div>
</template>

<script>
import cookieStore from '@/util/cookieStore';
import gql from 'graphql-tag';

import KvButton from '@/components/Kv/KvButton';
import KvCauseSelector from '@/components/Kv/KvCauseSelector';
import KvProgressBar from '@/components/Kv/KvProgressBar';

export default {
	components: {
		KvButton,
		KvCauseSelector,
		KvProgressBar,
	},
	metaInfo: {
		title: 'Get Started'
	},
	inject: ['apollo'],
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
					id: 0, // TODO: Couldn't find an id for technology
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
		summaryText() {
			if (this.selectedCauses.length === 0) {
				return `<b>Pick up to ${this.causeList.length} causes to lend to.`;
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
		},
		async onSubmitForm() {
			const uiv = cookieStore.get('uiv');
			console.log(uiv);

			const userCauseIds = this.selectedCauses.map(cause => cause.id);
			console.log(userCauseIds);

			const saveLendingPreferencesMutation = gql`mutation testing($visitorId: String!, $causes: [Int]) {
				my {
					saveLendingPreferefnces(visitorId: $visitorId, causes: $causes) {
						id
						causes {
							values {
								name
								id
							}
						}
					}
				}
			}`;

			try {
				const result = await this.apollo.mutate({
					mutation: saveLendingPreferencesMutation,
					variables: {
						visitorId: uiv,
						causes: userCauseIds
					}
				});
				console.log(result);
				this.$router.push('get-started/places');
			} catch (err) {
				console.error(err);
				// TODO: Show error message to user?
			}
		}
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.page-content {
	padding: 1.625rem 0;
}

.progress-bar {
	height: rem-calc(4);

	@include breakpoint(xlarge) {
		height: auto;
	}
}

.causes {
	&__intro {
		text-align: center;
		margin-bottom: 1rem;

		@include breakpoint(xlarge) {
			text-align: left;
		}
	}

	&__list {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		justify-items: center;
		justify-content: center;
		max-width: 30.5rem;
		margin: 0 auto 1.5rem auto;
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
		margin: 0 0 2.5rem 0;
	}

	&__submit-btn {
		display: block;
		margin-left: auto;
	}
}
</style>
