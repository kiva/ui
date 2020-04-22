<template>
	<div class="about">
		<div class="row">
			<div class="mall-12 large-6 columns">
				<kv-responsive-image class="about__img" :images="aboutImageSet" alt="" />
			</div>
			<div class="small-12 large-6 columns">
				<h2 class="about__header">
					About Kiva
				</h2>
				<p>
					Kiva is an international nonprofit, founded in 2005 in San Francisco, with a mission
					to expand financial access to help underserved communities thrive and in some cases,
					provide relief when crises may arise.
				</p>
				<p>
					We do this by crowdfunding loans and unlocking capital for the underserved, improving
					the quality and cost of financial services, and addressing the underlying barriers to
					financial access around the world. Through Kiva's work, students can pay for tuition,
					women can start businesses, farmers are able to invest in equipment and families can
					afford needed emergency care.
				</p>
				<p>
					By lending as little as $25 on Kiva, you can be part of the solution and make a real
					difference in someone’s life.
				</p>
				<p>
					<strong>
						100% of every dollar you lend on Kiva goes to funding loans.
					</strong>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
import KvResponsiveImage from '@/components/Kv/KvResponsiveImage';

export default {
	components: {
		KvResponsiveImage
	},
	data() {
		return {
			aboutImageSet: [
				['small', 'https://via.placeholder.com/430x350'],
				['small retina', 'https://via.placeholder.com/860x700'],
				['medium', 'https://via.placeholder.com/635x350'],
				['medium retina', 'https://via.placeholder.com/1270x700'],
				['large', 'https://via.placeholder.com/465x470'],
				['large retina', 'https://via.placeholder.com/930x940'],
			]
		};
	}
};

</script>

<style lang="scss" scoped>
@import 'settings';

.about {
	&__img {
		width: 100%;
		margin-bottom: 2em;

		@include breakpoint(large) {
			margin-bottom: 0;
		}
	}

	&__header {
		@include large-text();

		margin-bottom: 1rem;
	}
}
</style>
