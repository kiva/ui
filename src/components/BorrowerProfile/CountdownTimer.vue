<template>
	<vue-countdown v-if="isClientReady" :time="time" :emit-events="false" :transform="transform">
		<template slot-scope="props">
			{{ props.hours }}h {{ props.minutes }}m {{ props.seconds }}s
		</template>
	</vue-countdown>
</template>

<script>
import VueCountdown from '@chenfengyuan/vue-countdown';

export default {
	components: {
		VueCountdown,
	},
	props: {
		time: {
			type: Number,
			default: 0,
		},
	},
	data() {
		return {
			isClientReady: false
		};
	},
	mounted() {
		this.isClientReady = !this.$isServer;
	},
	methods: {
		transform(props) {
			Object.entries(props).forEach(([key, value]) => {
				// Adds leading zero
				if (value < 10) {
					// eslint-disable-next-line no-param-reassign
					props[key] = `0${value}`;
				} else {
					// eslint-disable-next-line no-param-reassign
					props[key] = value;
				}
			});

			// adds days to hours
			// eslint-disable-next-line radix, no-param-reassign
			props.hours = parseInt(props.hours) + parseInt(props.days) * 24;
			return props;
		},
	},
};
</script>
