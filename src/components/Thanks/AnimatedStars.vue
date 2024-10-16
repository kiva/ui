<!-- eslint-disable max-len -->
<template>
	<div>
		<template v-if="badgeCompleted">
			<svg class="svg first-star tw-bottom-0 tw-left-4" width="20" height="38" viewBox="0 0 20 38" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M16.3283 8.29768L15.0814 8.47958C11.5591 8.99342 8.82807 11.821 8.4369 15.359L8.27546 16.8191L8.0741 15.364C7.58616 11.838 4.77873 9.08629 1.24365 8.66914L-0.0078125 8.52147L1.23913 8.33956C4.76145 7.82573 7.49246 4.99815 7.88363 1.46011L8.04507 0L8.24644 1.45514C8.73438 4.98114 11.5418 7.73285 15.0769 8.15L16.3283 8.29768Z" fill="#F4B539" />
				<path d="M19.5009 33.5749C17.4901 33.8682 15.9311 35.4823 15.7078 37.5021L15.697 37.6001L15.6834 37.5024C15.4049 35.4896 13.8022 33.9187 11.7842 33.6806C13.7949 33.3872 15.354 31.7731 15.5773 29.7533L15.5881 29.6553L15.6016 29.753C15.8802 31.7659 17.4828 33.3367 19.5009 33.5749Z" fill="#F4B539" />
			</svg>

			<svg class="svg second-star tw-top-0 tw-right-0" width="18" height="42" viewBox="0 0 18 42" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M16.3274 8.6219L15.0804 8.80381C11.5581 9.31764 8.82709 12.1452 8.43591 15.6833L8.27447 17.1434L8.0731 15.6882C7.58516 12.1622 4.77774 9.41052 1.24266 8.99337L-0.00878906 8.84569L1.23815 8.66378C4.76048 8.14995 7.49147 5.32238 7.88264 1.78433L8.04408 0.324219L8.24545 1.77936C8.73339 5.30536 11.5408 8.05707 15.0759 8.47423L16.3274 8.6219Z" fill="#F4B539" />
				<path d="M17.2021 37.0827C15.1913 37.376 13.6323 38.9902 13.409 41.0099L13.3982 41.108L13.3846 41.0102C13.1061 38.9974 11.5034 37.4265 9.48535 37.1884C11.4961 36.8951 13.0552 35.2809 13.2785 33.2612L13.2893 33.1631L13.3028 33.2608C13.5814 35.2737 15.184 36.8445 17.2021 37.0827Z" fill="#F4B539" />
			</svg>

			<svg class="svg third-star tw-top-0 tw-left-0" width="29" height="26" viewBox="0 0 29 26" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M23.128 15.3867C23.2344 18.1277 25.432 20.3253 28.173 20.4317C25.432 20.5381 23.2344 22.7357 23.128 25.4767C23.0216 22.7357 20.824 20.5381 18.083 20.4317C20.824 20.3253 23.0216 18.1277 23.128 15.3867Z" fill="#F4B539" />
				<path d="M17.0891 8.29668L15.8421 8.47861C12.3198 8.99245 9.5888 11.82 9.19763 15.3581L9.0362 16.8182L8.83483 15.363C8.34689 11.837 5.53946 9.0853 2.00438 8.66815L0.75293 8.52049L1.99987 8.33859C5.52219 7.82476 8.2532 4.99718 8.64437 1.45914L8.8058 -0.000976562L9.00717 1.45416C9.49511 4.98017 12.3025 7.73187 15.8376 8.14902L17.0891 8.29668Z" fill="#F4B539" />
			</svg>
		</template>
		<template v-else>
			<svg
				class="svg first-star tw-top-0 tw-right-0"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M15.6562 9.56756C10.5937 9.56756 9.32812 5.18919 9.32812 3C9.32812 5.18919 8.0625 9.56756 3 9.56756C8.0625 9.56756 9.32812 14.1892 9.32812 16.5C9.32812 14.1892 10.5937 9.56756 15.6562 9.56756Z"
					fill="#F4B539"
					stroke="#F4B539"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<path
					d="M18.75 16.5V21"
					stroke="#F4B539"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
				<path
					d="M21 18.75L16.5 18.75"
					stroke="#F4B539"
					stroke-width="1.5"
					stroke-linecap="round"
				/>
				<circle cx="19.875" cy="4.125" r="1.125" fill="#F4B539" />
			</svg>

			<svg
				class="svg second-star tw-bottom-0 tw-left-0"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M15.6562 11.8176C10.5937 11.8176 9.32812 7.43919 9.32812 5.25C9.32812 7.43919 8.0625 11.8176 3 11.8176C8.0625 11.8176 9.32812 16.4392 9.32812 18.75C9.32812 16.4392 10.5937 11.8176 15.6562 11.8176Z"
					fill="#F4B539"
					stroke="#F4B539"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
				<circle cx="19.875" cy="6.375" r="1.125" fill="#F4B539" />
			</svg>
		</template>
	</div>
</template>

<script>
export default {
	name: 'AnimatedStars',
	props: {
		badgeCompleted: {
			type: Boolean,
			default: false,
		},
	}
};
</script>

<style lang="postcss" scoped>

.svg {
	animation: fadeTransition 2s infinite alternate;
	@apply tw-absolute tw-w-3 tw-h-3 tw-opacity-0;
}

.first-star {
	animation-delay: 0s;
}

.second-star {
	animation-delay: 0.5s;
}

.third-star {
	animation-delay: 1s;
}

@keyframes fadeTransition {
	0% {
		opacity: 0;
	}

	50% {
		opacity: 1;
	}

	100% {
		opacity: 0;
	}
}
</style>
