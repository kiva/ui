<template functional>
	<div
		id="donation-nudge-intro"
		class="tw-mb-5"
		:class="{
			'hide-header-on-mobile': props.hideHeaderOnMobile,
			'tw-mb-0 lg:tw-mb-2': !props.description,
			'tw-mb-0': props.hideDescriptionMobile,
		}"
	>
		<div
			v-if="props.mobileImageUrl"
			id="borrower-image-mobile-container"
			class="hide-for-large tw-mb-1"
			:class="{'tw-mb-2': props.description}"
		>
			<img id="nudge-donation-borrower-image-mobile" :src="props.mobileImageUrl">
		</div>
		<h2
			id="nudge-donation-top-header"
			class="tw-px-10"
		>
			{{ props.header }}
		</h2>
		<div
			class="row tw-px-10 tw-mx-auto"
			id="nudge-donation-top-content-row"
			v-if="props.description"
			:class="{'show-for-large': props.hideDescriptionMobile}"
		>
			<div
				v-if="props.noPaddingDescription"
				class="nudge-donation-top-content tw-w-full"
				v-html="props.description"
			></div>
			<div v-else class="small-10 small-offset-1 columns" v-html="props.description"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'DonationNudgeIntro',
	props: {
		header: {
			type: String,
			default: ''
		},
		description: {
			type: String,
			default: ''
		},
		hideHeaderOnMobile: {
			type: Boolean,
			default: false,
		},
		noPaddingDescription: {
			type: Boolean,
			default: false,
		},
		mobileImageUrl: {
			type: String,
			default: '',
		},
		hideDescriptionMobile: {
			type: Boolean,
			default: false,
		},
	},
};
</script>
