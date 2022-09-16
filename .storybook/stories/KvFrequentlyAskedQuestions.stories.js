import SectionWithBackgroundClassic from '@/components/Contentful/SectionWithBackgroundClassic';
import KvFrequentlyAskedQuestions from '@/components/Kv/KvFrequentlyAskedQuestions';
import KvPageContainer from '~/@kiva/kv-components/vue/KvPageContainer';

export default {
	title: 'Kv/KvFrequentlyAskedQuestions',
	component: KvFrequentlyAskedQuestions,
	args: {
		frequentlyAskedQuestionsHeadline: 'Questions',
		frequentlyAskedQuestions: [{
			name: 'First Question',
			richText: {
				"nodeType": "paragraph", // Can be paragraphs, images, lists, embedded entries
				"data": {},
				"content": [{
					"nodeType": "text",
					"value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis nunc sed id semper risus in hendrerit. Pharetra diam sit amet nisl suscipit adipiscing bibendum. Interdum varius sit amet mattis vulputate enim. Maecenas pharetra convallis posuere morbi leo urna molestie. Duis ut diam quam nulla porttitor. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Elit pellentesque habitant morbi tristique senectus et netus. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Non quam lacus suspendisse faucibus interdum posuere lorem. Magnis dis parturient montes nascetur ridiculus. Et tortor consequat id porta nibh venenatis cras sed felis. Dui ut ornare lectus sit amet est placerat. Eu non diam phasellus vestibulum lorem. Dignissim convallis aenean et tortor at.",
					"data": {},
					"marks": []
				}]
			}
		},{
			name: 'Second Question',
			richText:  {
				"nodeType": "paragraph", // Can be paragraphs, images, lists, embedded entries
				"data": {},
				"content": [{
					"nodeType": "text",
					"value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis nunc sed id semper risus in hendrerit. Pharetra diam sit amet nisl suscipit adipiscing bibendum. Interdum varius sit amet mattis vulputate enim. Maecenas pharetra convallis posuere morbi leo urna molestie. Duis ut diam quam nulla porttitor. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Elit pellentesque habitant morbi tristique senectus et netus. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Non quam lacus suspendisse faucibus interdum posuere lorem. Magnis dis parturient montes nascetur ridiculus. Et tortor consequat id porta nibh venenatis cras sed felis. Dui ut ornare lectus sit amet est placerat. Eu non diam phasellus vestibulum lorem. Dignissim convallis aenean et tortor at.",
					"data": {},
					"marks": []
				}]
			}
		},{
			name: 'Third Question',
			richText:  {
				"nodeType": "paragraph", // Can be paragraphs, images, lists, embedded entries
				"data": {},
				"content": [{
					"nodeType": "text",
					"value": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Mollis nunc sed id semper risus in hendrerit. Pharetra diam sit amet nisl suscipit adipiscing bibendum. Interdum varius sit amet mattis vulputate enim. Maecenas pharetra convallis posuere morbi leo urna molestie. Duis ut diam quam nulla porttitor. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Elit pellentesque habitant morbi tristique senectus et netus. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. Non quam lacus suspendisse faucibus interdum posuere lorem. Magnis dis parturient montes nascetur ridiculus. Et tortor consequat id porta nibh venenatis cras sed felis. Dui ut ornare lectus sit amet est placerat. Eu non diam phasellus vestibulum lorem. Dignissim convallis aenean et tortor at.",
					"data": {},
					"marks": []
				}]
			}
		}],
		verticalPadding: {},
		background: {}
	},
};

export const Default = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		SectionWithBackgroundClassic, KvFrequentlyAskedQuestions, KvPageContainer
	},
	template: `
		<section-with-background-classic
			:background-content="background"
			:vertical-padding="verticalPadding"
		>
			<template #content>
				<kv-page-container>
					<kv-frequently-asked-questions
						:headline="frequentlyAskedQuestionsHeadline"
						:questions="frequentlyAskedQuestions"
					/>
				</kv-page-container>
			</template>
		</section-with-background-classic>
	`,
});

