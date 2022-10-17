<template>
	<div class="lg:tw-mb-4">
		<div class="tw-w-full tw-relative">
			<span
				class="tw-block tw-text-center tw-mb-2"
				data-testid="bp-lend-cta-powered-by-text"
				key="numLendersStat"
			>
				<kv-material-icon
					class="tw-w-2.5 tw-h-2.5 tw-pointer-events-none tw-inline-block tw-align-middle"
					:icon="mdiLightningBolt"
				/>
				{{ poweredByText }}
			</span>
			<lenders-list-item
				v-for="item in sortedLenders" :key="item.id"
				:lender="item"
				class="last-of-type:tw-hidden last-of-type:lg:tw-flex"
			/>
			<span
				class="
					tw-absolute
					tw-left-0 tw-bottom-0
					tw-w-full tw-h-10
					tw-pointer-events-none
					tw-bg-gradient-to-b tw-from-transparent tw-to-white
				"
			></span>
		</div>
		<div class="tw-mt-2 tw-hidden lg:tw-block">
			<kv-button variant="secondary" @click="toggleLightBox">
				See all lenders
			</kv-button>
		</div>
	</div>
</template>

<script>
import { mdiLightningBolt } from '@mdi/js';
import LendersListItem from '@/components/BorrowerProfile/LendersListItem';
import gql from 'graphql-tag';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvMaterialIcon from '~/@kiva/kv-components/vue/KvMaterialIcon';

export default {
	name: 'LendersList',
	inject: ['apollo', 'cookieStore'],
	props: {
		lenders: {
			type: Array,
			default: () => []
		},
		numLenders: {
			type: Number,
			default: 0
		}
	},
	components: {
		LendersListItem,
		KvButton,
		KvMaterialIcon,
	},
	apollo: {
		query: gql`
			query inviterLent($publicId: String!, $getLender: Boolean!, $loanIds: [Int!]) {
				community @include(if: $getLender) {
					lender(publicId: $publicId) {
						id
 						name
 						publicId
 						image {
 							id
 							url
 						}
 						lenderPage {
 							city
 							country {
 								isoCode
 							}
 						}
						loans(loanIds: $loanIds) {
							totalCount
						}
					}
				}
			}
		`,
		preFetch: true,
		preFetchVariables({ route }) {
			const publicId = route?.query?.utm_content ?? '';
			return {
				publicId,
				getLender: !!publicId,
				loanIds: [Number(route.params?.id ?? 0)]
			};
		},
		variables() {
			const publicId = this.$route?.query?.utm_content ?? '';
			return {
				publicId,
				getLender: !!publicId,
				loanIds: [Number(this.$route.params?.id ?? 0)]
			};
		},
		result(result) {
			const lender = result?.data?.community?.lender;
			this.lender = lender;
			this.inviterLent = lender?.loans?.totalCount ?? 0;
		}
	},
	data() {
		return {
			mdiLightningBolt,
			lender: null,
			inviterLent: 0
		};
	},
	methods: {
		toggleLightBox() {
			this.$emit('togglelightbox');
		}
	},
	computed: {
		limit() {
			return this.numLenders > 3 ? 2 : 1;
		},
		filteredLenders() {
			return this.lenders.filter(lender => lender?.name?.toLowerCase() !== 'anonymous').slice(0, 3);
		},
		sortedLenders() {
			const inviterName = this.$route.query.utm_content ?? '';
			const inviterIndex = this.filteredLenders.findIndex(lender => {
				return inviterName.localeCompare(lender?.publicId) === 0;
			});
			if (this.inviterLent && inviterIndex >= 0) {
				return [
					this.filteredLenders[inviterIndex],
					...this.filteredLenders.slice(0, inviterIndex),
					...this.filteredLenders.slice(inviterIndex + 1, this.filteredLenders.length)
				];
			}
			if (this.inviterLent) {
				return [
					this.filteredLenders,
					...this.filteredLenders,
				];
			}
			return this.filteredLenders;
		},
		lendersListName() {
			if (this.numLenders < 4) return this.sortedLenders[0].name;
			const filteredLenders = [...this.sortedLenders].slice(0, this.limit);
			return filteredLenders.map(lender => lender.name)
				.join(', ')
				.replace(/,\s*$/, '');
		},
		poweredByText() {
			if (this.numLenders - this.limit <= 0) return `Powered by ${this.lendersListName}`;
			if (this.numLenders - this.limit === 1) return `Powered by ${this.lendersListName} and 1 more`;
			return `Powered by ${this.lendersListName} and ${this.numLenders - this.limit} others`;
		}
	}
};

</script>
