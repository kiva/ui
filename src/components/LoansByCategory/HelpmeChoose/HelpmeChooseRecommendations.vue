<template>
	<div class="tw-flex">
		<!-- eslint-disable max-len -->
		<helpme-choose-borrower-selector
			image-url="https://res.cloudinary.com/kiva/w_960,h_600,c_fill,g_faces/a_ignore,fl_progressive,q_auto:best,f_auto/remote/ea3be8ae591d38de82c7a81b3657b22e.jpg"
			name="BV Goudiry Group"
			tag="Latinx/Hispanic-Owned Business"
			:selected-loan="true"
		/>
	</div>
</template>

<script>
import HelpmeChooseBorrowerSelector from './HelpmeChooseBorrowerSelector';

export default {
	name: 'HelpmeChooseRecommendations',
	components: {
		HelpmeChooseBorrowerSelector
	}
};
</script>
