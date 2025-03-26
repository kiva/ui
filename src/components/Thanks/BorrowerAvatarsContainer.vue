<template>
	<div class="tw-flex tw-items-center tw-justify-center">
		<KvUserAvatar
			v-for="(loan, index) in loans"
			:key="loan.id"
			:lender-name="loan?.name"
			:lender-image-url="getLoanImageUrl(loan)"
			class="tw-rounded-full tw-shadow"
			:class="{
				'borrower-image': showLargeAvatars,
				'tw-border-white tw-border-2 tw-w-auto': !showLargeAvatars,
				'smaller-borrower-avatar': !showLargeAvatars && loans.length > 2 && index !== 1,
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
import { KvUserAvatar } from '@kiva/kv-components';
import useIsMobile from '#src/composables/useIsMobile';
import {
	MOBILE_BREAKPOINT,
} from '#src/composables/useBadgeModal';
import { getKivaImageUrl } from '#src/util/imageUtils';
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
.smaller-borrower-avatar :deep(img), .smaller-borrower-avatar :deep(.loading-placeholder) {
	height: 36px;
	width: 36px;
}

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

.borrower-image, .borrower-image :deep(img), .borrower-image :deep(.loading-placeholder) {
	width: 124px;
	height: 124px;

	@screen md {
		width: 160px;
		height: 160px;
	}
}

.single-pair-loans, .single-pair-loans :deep(img), .single-pair-loans :deep(.loading-placeholder) {
	width: 148px !important;
	height: 148px !important;

	@screen md {
		width: 200px !important;
		height: 200px !important;
	}
}

.centered-borrower-image, .centered-borrower-image :deep(img), .centered-borrower-image :deep(.loading-placeholder) {
	width: 164px !important;
	height: 160px !important;

	@screen md {
		width: 200px !important;
		height: 200px !important;
	}
}

.borrower-image :deep(img), .centered-borrower-image :deep(img) {
	@apply tw-border-4 tw-border-white;
}

</style>
