<template>
	<div class="tw-flex tw-items-center tw-justify-center">
		<KvUserAvatar
			v-for="(loan, index) in loans"
			:key="loan.id"
			:lender-name="loan?.name"
			:lender-image-url="getLoanImageUrl(loan)"
			class="tw-shadow tw-border-white tw-box-content"
			:class="{
				'borrower-image tw-border-4': showLargeAvatars,
				'tw-border-2': !showLargeAvatars,
				'tw-w-4.5 tw-h-4.5': !showLargeAvatars && index !== 1 && loans.length > 2,
				'tw-w-6 tw-h-6': !showLargeAvatars && (index === 1 || loans.length <=2),
				'centered-borrower-image' : showLargeAvatars && index === 1 && loans.length === 3,
				'single-pair-loans': showLargeAvatars && loans.length < 3
			}"
			:style="{
				zIndex: index === 1 ? 2 : 1,
				marginRight: getMarginRight(index),
				marginLeft: getMarginLeft(index),
			}"
		/>
	</div>
</template>

<script setup>
import { getKivaImageUrl, KvUserAvatar } from '@kiva/kv-components';
import useIsMobile from '#src/composables/useIsMobile';
import {
	MOBILE_BREAKPOINT,
} from '#src/composables/useBadgeModal';
import { inject } from 'vue';

const { isMobile } = useIsMobile(MOBILE_BREAKPOINT);
const $appConfig = inject('$appConfig');

const props = defineProps({
	loans: {
		type: Array,
		default: () => ([]),
	},
	showLargeAvatars: {
		type: Boolean,
		default: false,
	},
});

const getMarginRight = index => {
	if (!props.showLargeAvatars) {
		return props.loans.length > 2 && index === 0 ? '-22px' : '0';
	}

	if (props.loans.length > 2 && index === 0) {
		if (isMobile.value) {
			return '-81.5px';
		}
		return '-100px';
	}

	return '0';
};

const getMarginLeft = index => {
	if (!props.showLargeAvatars) {
		return props.loans.length > 1 && index === props.loans.length - 1 ? '-22px' : '0';
	}

	if (props.loans.length > 1 && index === props.loans.length - 1) {
		if (props.loans.length === 2) {
			return '-63px';
		}

		if (isMobile.value) {
			return '-81.5px';
		}
		return '-100px';
	}

	return '0';
};

const getLoanImageUrl = loan => {
	if (!props.showLargeAvatars) {
		return loan?.image?.url;
	}

	return getKivaImageUrl({
		height: 500,
		width: 500,
		base: $appConfig.photoPath,
		hash: loan?.image?.hash,
	});
};

</script>

<style lang="postcss" scoped>
/* For large avatars */
.borrower-container {
	animation: fadein ease-in 1s;
	width: 70px;

	@screen md {
		width: 150px;
	}

	@apply tw-block tw-relative tw-mx-auto tw-z-4;
}

.borrower-container > div {
	height: 100px;

	@screen md {
		height: 200px;
	}
}

.borrower-image {
	width: 124px !important;
	height: 124px !important;

	@screen md {
		width: 160px !important;
		height: 160px !important;
	}
}

.single-pair-loans {
	width: 148px !important;
	height: 148px !important;

	@screen md {
		width: 200px !important;
		height: 200px !important;
	}
}

.centered-borrower-image {
	width: 164px !important;
	height: 160px !important;

	@screen md {
		width: 200px !important;
		height: 200px !important;
	}
}
</style>
