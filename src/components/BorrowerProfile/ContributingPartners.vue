<template>
	<section v-if="showSection">
		<collapsible-section
			id="bp-contributing-partners"
			:collapsible="collapsible"
			tracking-property="contributing-partners"
		>
			<template #heading>
				<h2 class="tw-mb-4">
					Contributing partners
				</h2>
			</template>
			<template #title>
				Contributing partners
			</template>
			<template #subtitle>
				Partners that matched this loan
			</template>
			<div
				v-for="matcher in simultaneousMatching"
				:key="matcher.managedAccountId"
				class="tw-flex tw-items-center tw-mb-4 last:tw-mb-0"
			>
				<component
					:is="matcher.partnerContentfulPage ? 'a' : 'div'"
					:href="matcher.partnerContentfulPage
						? `/impact-dashboard/${matcher.partnerContentfulPage}`
						: undefined"
					v-kv-track-event="matcher.partnerContentfulPage
						? ['borrower-profile', 'click', 'contributing-partner-avatar', matcher.partnerContentfulPage]
						: undefined"
					class="tw-flex-none tw-w-12 tw-h-12 tw-rounded-full tw-overflow-hidden tw-shadow tw-mr-2"
				>
					<kv-user-avatar
						class="tw-w-full tw-h-full"
						:lender-name="matcher.displayName || 'Anonymous'"
						:lender-image-url="matcher.avatar?.url || matcher.logo?.url || ''"
					/>
				</component>
				<div>
					<p class="tw-text-upper">
						{{ matcher.ratio }}:1 MATCHING
					</p>
					<p class="tw-mt-0.5">
						{{ getDisplayName(matcher) }}
					</p>
				</div>
			</div>
		</collapsible-section>
	</section>
</template>

<script>
import { gql } from 'graphql-tag';
import { KvUserAvatar } from '@kiva/kv-components';
import useMultiMatching from '#src/composables/useMultiMatching';
import CollapsibleSection from '#src/components/BorrowerProfile/CollapsibleSection';

export default {
	name: 'ContributingPartners',
	components: { CollapsibleSection, KvUserAvatar },
	inject: ['apollo', 'cookieStore'],
	props: {
		loanId: {
			type: Number,
			default: 0,
		},
		collapsible: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const { enableMultiMatching } = useMultiMatching();
		return { enableMultiMatching };
	},
	data() {
		return {
			status: '',
			simultaneousMatching: [],
		};
	},
	apollo: {
		query: gql`
			query contributingPartners($loanId: Int!) {
				lend {
					loan(id: $loanId) {
						id
						status
						simultaneousMatching {
							managedAccountId
							displayName
							ratio
							partnerContentfulPage
							avatar {
								id
								url
							}
							logo {
								id
								url
							}
						}
					}
				}
			}
		`,
		preFetch: false,
		variables() {
			return { loanId: this.loanId };
		},
		result({ data }) {
			const loan = data?.lend?.loan;
			this.status = loan?.status ?? '';
			this.simultaneousMatching = loan?.simultaneousMatching ?? [];
		},
	},
	computed: {
		showSection() {
			return this.enableMultiMatching
				&& this.simultaneousMatching.length > 0
				&& this.status === 'fundraising';
		},
	},
	methods: {
		getDisplayName(matcher) {
			return matcher.displayName && matcher.displayName !== 'Anonymous'
				? matcher.displayName
				: 'A Kiva supporter';
		},
	},
};
</script>
