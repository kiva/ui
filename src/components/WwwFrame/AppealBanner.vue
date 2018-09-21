<template>
	<div class="appeal-banner">

		<div class="appeal-banner-layout close" v-show="!isOpen">
			<div class="row">
				<div class="avatar rows">
				</div>
				<div class="info rows column">
					<div class="header columns">
						<h2 class="rows">Fighting for a better future? We need your help.</h2>
						<span v-show="!isOpen"
							class="rows dropdown-icon"
							@click="toggleBanner">
							<kv-icon name="small-chevron-mobile"/>
						</span>
						<span v-show="isOpen"
							class="rows updown-icon"
							@click="toggleBanner">
							<kv-icon name="small-chevron-mobile" class="upside"/>
						</span>
					</div>
				</div>
			</div>
		</div>

		<div class="appeal-banner-layout" v-show="isOpen">
			<div class="row">
				<div class="avatar rows">
					<!-- TODO: Make component -->
					<img class="avatar-icon" src="http://styleguide.kiva.org/images/leadership/premal-shah-std.jpg">
				</div>
				<div class="info rows column">
					<div class="header columns">
						<h2 class="rows">Fighting for a better future? We need your help.</h2>
						<span v-show="!isOpen"
							class="rows dropdown-icon"
							@click="toggleBanner">
							<kv-icon name="small-chevron-mobile"/>
						</span>
						<span v-show="isOpen"
							class="rows updown-icon"
							@click="toggleBanner">
							<kv-icon name="small-chevron-mobile" class="upside"/>
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
						<kv-button class="smaller rows">$25</kv-button>
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
import KvButton from '@/components/Kv/KvButton';
import KvIcon from '@/components/Kv/KvIcon';

export default {

	components: {
		KvButton,
		KvIcon,
	},
	data() {
		return {
			isOpen: true,
		};
	},
	methods: {
		toggleBanner() {
			this.isOpen = !this.isOpen;
		},
	},
};

</script>
<style lang='scss'>
	@import 'settings';
	@import 'foundation';

	@include foundation-flex-classes;
	@include foundation-flex-grid;

	.appeal-banner {
		background: $kiva-alert-yellow;
	}

	.appeal-banner-layout {
		max-width: 61.875rem;
		margin: 0 auto;
		height: 300px;
		transition: all 0.4s ease;

		&.close {
			height: 50px;
		}

		& > .row {
			height: 100%;
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

		.avatar-icon {
			width: 10rem;
			height: 10rem;
			border-radius: 5rem;
		}

		.icon {
			width: 25px;
			height: 25px;
			cursor: pointer;
			margin-left: 50px;
			margin-top: 5px;
		}
	}

</style>
