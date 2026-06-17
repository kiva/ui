import ContentLightbox from '#src/components/BorrowerProfile/ContentLightbox';

export default {
	title: 'Components/BorrowerProfile/ContentLightbox',
	component: ContentLightbox,
};

const solution = {
	title: 'Why is this borrower anonymous?',
	content: '<p>To protect this borrower\'s privacy, identifying details have been removed'
		+ ' from their profile.</p>',
};

// The shell is driven imperatively: a trigger calls open({ title, content }).
export const Default = () => ({
	components: { ContentLightbox },
	data: () => ({ solution }),
	template: `
		<div>
			<button
				type="button"
				class="tw-text-action hover:tw-text-action-highlight tw-underline"
				@click="$refs.lightbox.open(solution)"
			>
				Open content lightbox
			</button>
			<content-lightbox ref="lightbox" />
		</div>
	`,
});
