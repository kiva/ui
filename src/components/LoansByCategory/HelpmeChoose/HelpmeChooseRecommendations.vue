<template>
	<div class="tw-flex tw-flex-col lg:tw-flex-row tw-gap-3 tw-w-full">
		<div class="tw-flex tw-flex-col tw-gap-1 lg:tw-gap-1.5">
			<!-- eslint-disable max-len -->
			<helpme-choose-borrower-selector
				image-url="https://res.cloudinary.com/kiva/w_960,h_600,c_fill,g_faces/a_ignore,fl_progressive,q_auto:best,f_auto/remote/ea3be8ae591d38de82c7a81b3657b22e.jpg"
				name="BV Goudiry Group"
				tag="Latinx/Hispanic-Owned Business"
				:selected="selectedLoan"
				:index="0"
				@select="selectLoan"
			/>

			<!-- eslint-disable max-len -->
			<helpme-choose-borrower-selector
				image-url="https://res.cloudinary.com/kiva/w_960,h_600,c_fill,g_faces/a_ignore,fl_progressive,q_auto:best,f_auto/remote/ea3be8ae591d38de82c7a81b3657b22e.jpg"
				name="BV Goudiry Group"
				tag="Agriculture"
				:selected="selectedLoan"
				:index="1"
				@select="selectLoan"
			/>

			<!-- eslint-disable max-len -->
			<helpme-choose-borrower-selector
				image-url="https://res.cloudinary.com/kiva/w_960,h_600,c_fill,g_faces/a_ignore,fl_progressive,q_auto:best,f_auto/remote/ea3be8ae591d38de82c7a81b3657b22e.jpg"
				name="BV Goudiry Group"
				tag="Retain"
				:selected="selectedLoan"
				:index="2"
				@select="selectLoan"
			/>

			<button @click="$emit('show-triggers')" class="tw-hidden lg:tw-flex tw-items-center tw-justify-center tw-gap-1 tw-text-action tw-text-small tw-mt-1">
				<img src="@/assets/images/helpmechoose/replay.svg"> Start over
			</button>
		</div>
		<div>
			<!-- Loan Card code -->
		</div>
		<button @click="$emit('show-triggers')" class="lg:tw-hidden tw-flex tw-items-center tw-justify-center tw-gap-1 tw-text-action tw-text-small tw-mt-1">
			<img src="@/assets/images/helpmechoose/replay.svg"> Start over
		</button>
	</div>
</template>

<script>
import HelpmeChooseBorrowerSelector from './HelpmeChooseBorrowerSelector';

export default {
	name: 'HelpmeChooseRecommendations',
	components: {
		HelpmeChooseBorrowerSelector
	},
	data() {
		return {
			selectedLoan: 0
		};
	},
	methods: {
		selectLoan(evt) {
			this.selectedLoan = evt;
		},
	}
};
</script>
