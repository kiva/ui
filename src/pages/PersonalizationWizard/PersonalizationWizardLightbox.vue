<template>
	<kv-lightbox
		title="Let's find you the perfect loan!"
		:visible="isLightboxVisible"
		@lightbox-closed="closeLightbox"
	>
		<div>
			<div class="tw-flex tw-gap-2" v-show="step == 1" style="min-height: 530px;">
				<div class="tw-w-1/2 tw-flex tw-items-center">
					<h3 class="tw-text-base">
						Do you want to help others locally or internationally?
					</h3>
				</div>
				<div class="tw-flex tw-items-center tw-gap-3 tw-p-4">
					<kv-cause-selector
						v-for="location of locationList"
						:key="`location-${location.id}`"
						:cause="location.name"
						:checked="location.checked"
						:hackathon-test="true"
						class="tw-cursor-pointer"
						@change="onChangeLocationSelection($event, location.id)"
					/>
				</div>
			</div>
			<div class="tw-flex tw-gap-2" v-show="step == 2" style="min-height: 530px;">
				<div class="tw-w-1/2 tw-flex tw-items-center">
					<h3 class="tw-text-base">
						Which of these areas are you most passionate about?
					</h3>
				</div>
				<div class="tw-w-full tw-columns-3 tw-gap-0">
					<kv-cause-selector
						v-for="cause of causeList"
						:key="`cause-${cause.id}`"
						:cause="cause.name"
						:checked="cause.checked"
						class="tw-cursor-pointer tw-pt-2 -tw-px-1"
						@change="onChangeCauseSelection($event, cause.id)"
					/>
				</div>
			</div>
			<div class="tw-flex tw-gap-2" v-show="step == 3" style="min-height: 530px;">
				<div class="tw-w-1/2 tw-flex tw-items-center">
					<h3 class="tw-text-base">
						How much are you interested in lending?
					</h3>
				</div>
				<div class="tw-w-full tw-my-auto">
					<kv-button @click="goToResults" class="tw-w-full" variant="secondary" state="active">
						Less than $25
					</kv-button>
					<kv-button @click="goToResults" class="tw-w-full tw-mt-2" variant="secondary">
						$25-$50
					</kv-button>
					<kv-button @click="goToResults" class="tw-w-full tw-mt-2" variant="secondary">
						$50-$100
					</kv-button>
					<kv-button @click="goToResults" class="tw-w-full tw-mt-2" variant="secondary">
						More than $100
					</kv-button>
					<kv-button @click="goToResults" class="tw-w-full tw-mt-2" variant="secondary">
						Show me everything
					</kv-button>
				</div>
			</div>
		</div>
	</kv-lightbox>
</template>

<script>
import KvCauseSelector from '@/components/Kv/KvCauseSelector';
import KvButton from '~/@kiva/kv-components/vue/KvButton';
import KvLightbox from '~/@kiva/kv-components/vue/KvLightbox';

export default {
	components: {
		KvLightbox,
		KvCauseSelector,
		KvButton,
	},
	props: {
		isLightboxVisible: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			step: 1,
			locationList: [
				{
					id: 1,
					name: 'locally',
					checked: false,
				},
				{
					id: 2,
					name: 'international',
					checked: false,
				},
				{
					id: 3,
					name: 'open-to-all',
					checked: false,
				},
			],
			causeList: [
				{
					id: 5,
					name: 'women',
					checked: false,
				},
				{
					id: 6,
					name: 'shelter',
					checked: false,
				},
				{
					id: 4,
					name: 'education',
					checked: false,
				},
				{
					id: 102,
					name: 'technology',
					checked: false,
				},
				{
					id: 8,
					name: 'agriculture',
					checked: false,
				},
				{
					id: 96,
					name: 'COVID-19',
					checked: false,
				},
				{
					id: 25,
					name: 'health',
					checked: false,
				},
				{
					id: 32,
					name: 'refugees',
					checked: false,
				},
				{
					id: 29,
					name: 'arts',
					checked: false
				}
			]
		};
	},
	methods: {
		closeLightbox() {
			this.$emit('close-lightbox');
			this.step = 1;
		},
		onChangeLocationSelection(value, locationId) {
			this.locationList.find(location => location.id === locationId).checked = value;
			this.step = 2;
		},
		onChangeCauseSelection(value, causeId) {
			this.causeList.find(cause => cause.id === causeId).checked = value;
			this.step = 3;
		},
		goToResults() {
			this.$router.push({
				path: '/personalization-wizard-results'
			}).catch(() => {});
		}
	},
};
</script>
