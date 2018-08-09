<template>
	<kv-button class="smaller facebook">Continue with Facebook</kv-button>
</template>

<script>
import KvButton from '@/components/Kv/KvButton';

export default {
	components: {
		KvButton,
	}
};
</script>

<style lang="scss" scoped>
@import 'settings';

.facebook {
	width: 100%;
	box-shadow: 0 2px #2e5193;
	padding: 1.1rem .5rem 1rem 2rem !important;
	background: #4267B2 url(/img/icon/facebook-logo-2018.svg) rem-calc(12) rem-calc(16) no-repeat;
	background-size: rem-calc(22) rem-calc(22);
}

.facebook {
	&:hover,
	&:focus {
		text-decoration: none;
		background: #2e5193 url(/img/icon/facebook-logo-2018.svg) rem-calc(12) rem-calc(16) no-repeat;
		background-size: rem-calc(22) rem-calc(22);
	}
}
</style>
