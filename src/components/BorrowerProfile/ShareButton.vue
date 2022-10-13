<template>
	<kv-social-share-button
		:modal-title="modalTitle"
		:share-message="shareMessage"
		:share-url="shareLink"
		variant="caution"
		:utm-campaign="campaign"
		:utm-content="utmContent"
		:linked-in-title="linkedInTitle"
	>
		<template #modal-content>
			<!-- eslint-disable-next-line max-len -->
			<p>You can make change happen faster for {{ name }} by getting the word out. Each lender that supports {{ name }} brings them one step closer to being live for all to see on Kiva.org. Share their loan now.</p>
		</template>
	</kv-social-share-button>
</template>

<script>
import KvSocialShareButton from '@/components/Kv/KvSocialShareButton';

export default {
	name: 'ShareButton',
	components: {
		KvSocialShareButton
	},
	props: {
		lender: {
			type: Object,
			default: () => {}
		},
		loan: {
			type: Object,
			required: true
		},
		campaign: {
			type: String,
			required: true
		}
	},
	computed: {
		linkedInTitle() {
			return `A loan for ${this.loan.name}`;
		},
		modalTitle() {
			return `Help ${this.name} spread the word.`;
		},
		name() {
			if (this.loan.name && this.loan.anonymization !== 'full') {
				return this.loan.name;
			}
			return 'this lender';
		},
		shareMessage() {
			if (this.loan.name) {
				const location = this.loan?.geocode?.city || this.loan?.geocode?.country?.name;
				return `Kiva is an easy way to make a real difference in someone's life. Will you join me in helping ${this.loan.name} ${location ? `in ${location} ` : ''}to pursue their dream?`; // eslint-disable-line max-len
			}
			return '';
		},
		utmContent() {
			if (this.lender?.public && this.lender?.inviterName) return this.lender.inviterName;
			return 'anonymous';
		},
		shareLink() {
			if (this.loan.id && this.lender?.inviterName) {
				return `/invitedby/${this.lender.inviterName}/for/${this.loan.id}`; // eslint-disable-line max-len
			}
			return `${this.$route.path}`;
		},
	},
};
</script>
