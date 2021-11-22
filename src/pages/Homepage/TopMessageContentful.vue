<template>
	<www-page id="homepage"
		class="homepage-top-message"
	>
		<div class="row align-center">
			<div class="columns small-12" v-html="content">
			</div>
		</div>
	</www-page>
</template>

<script>
import WwwPage from '@/components/WwwFrame/WwwPage';

export default {
	components: {
		WwwPage,
	},
	props: {
		content: {
			type: String,
			default: '',
		},
	},
};
</script>

<style lang="scss">
@import 'settings';

.homepage-top-message {
	padding: rem-calc(120) 0;
	background-color: #141413;
	color: $white;
	text-align: center;

	.columns {
		max-width: rem-calc(550);
	}

	h1 {
		font-weight: bold;
		font-size: 2.75rem;
		margin-bottom: 3.5rem;
	}

	p {
		font-size: 1.4rem;
		line-height: 1.2;
		text-align: justify;
		margin-bottom: 1.5rem;
	}

	a,
	a:hover,
	a:focus,
	a:visited,
	a:active {
		color: $kiva-green;
		text-decoration: underline;
	}

	a:hover,
	a:focus {
		color: $kiva-light-green;
	}
}
</style>
