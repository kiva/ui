<template>
	<div class="appeal-banner" v-if="isVisible">
		<div class="appeal-banner-layout close" v-show="!isOpen">
			<div class="row">
				<div class="avatar rows">
				</div>
				<div class="info rows column">
					<div class="header columns">
						<h2 class="rows">Fighting for a better future? We need your help.</h2>
						<span class="rows open-icon"
							@click="toggleAccordion">
							<kv-icon name="small-chevron-mobile"/>
						</span>
					</div>
				</div>
			</div>
		</div>
		<div class="appeal-banner-layout" v-show="isOpen">
			<div class="row">
				<div class="avatar rows">
					<appeal-image />
				</div>
				<div class="info rows column">
					<div class="header columns">
						<h2 class="rows">Fighting for a better future? We need your help.</h2>
						<span class="rows close-icon">
							<a @click="toggleAccordion">
								<kv-icon
									:class="{ flipped: open }"
									class="toggle-arrow"
									name="medium-chevron"
								/>
							</a>
						</span>
					</div>
					<div class="columns column">
						<p class="small-text quote columns">
							Creating a more equitable world takes a lot of time and energy, but at Kiva we’re in it for
							the
							long haul. 100% of money lent on Kiva goes to funding loans. That means we rely on donations
							from people like you to make this work possible. For a limited time, if you donate $35 or
							more,
							a $25 bonus will be added to your account (you’ll get an email once it’s there).
						</p>
						<p class="small-text quote columns">
							Premal Shah, President & Co-Founder, Kiva
						</p>
					</div>
					<div class="row columns">
						<kv-button class="smaller rows">$20</kv-button>
						<kv-button class="smaller rows">$35</kv-button>
						<kv-button class="smaller rows">$50</kv-button>
						<kv-button class="smaller rows secondary">Submit</kv-button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/* eslint-disable max-len */
import _get from 'lodash/get';
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';
import AppealImage from '@/components/WwwFrame/EndOfYearAppealBanner/AppealImage';
import appealBannerQuery from '@/graphql/query/appealBanner.graphql';

export default {
	components: {
		KvButton,
		KvIcon,
		AppealImage,
	},
	inject: ['apollo'],
	data() {
		return {
			isOpen: true,
			isVisible: false,
		};
	},
	apollo: {
		query: appealBannerQuery,
		preFetch: true,
		result({ data }) {
			this.isVisible = _get(data, 'general.setting.value') === 'true' || false;
		},
	},
	methods: {
		toggleAccordion() {
			this.isOpen = !this.isOpen;
		},
	},
};
</script>

<style lang='scss'>
@import 'settings';

.appeal-banner {
	background: $kiva-alert-yellow;
}

.appeal-banner-layout {
	max-width: 61.875rem;
	margin: 0 auto;

	& .close {
		height: rem-cacl(50);
	}

	& > .row {
		// height: 100%;
		align-items: center;
	}

	.avatar {
		width: 13rem;
		align-items: center;
	}

	.info {
		max-width: 45rem;
	}

	.header {
		flex-direction: row;
		display: flex;
	}

	.quote {
		max-width: 40rem;
	}

	.column {
		padding: 0;
	}

	// .avatar-icon {
	// 	width: 10rem;
	// 	height: 10rem;
	// 	border-radius: 5rem;
	// }

	.close-icon {
		transform: scaleY(-1);
		height: rem-calc(35);
	}

	.icon {
		width: rem-calc(25);
		height: rem-calc(25);
		cursor: pointer;
		margin-left: rem-calc(50);
		margin-top: rem-calc(5);
	}
}
</style>
