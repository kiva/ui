import ActivityFeed from '@/components/Iwd/ActivityFeed';
import apolloStoryMixin from '../mixins/apollo-story-mixin';

const queryResult = {
	data: {
		lend: {
		  campaignActions: {
			values: [
			  {
				lender: {
				  id: 723174,
				  name: "TonyB",
				  image: {
					url: "https://www-0.development.kiva.org/img/s100/6b1a24092be3aaa22216874e644a4acf.jpg"
				  }
				},
				shareAmount: "25.00"
			  },
			  {
				lender: {
				  id: 723174,
				  name: "Roger",
				  image: {
					url: ""
				  }
				},
				shareAmount: "25.00"
			  },
			  {
				lender: {
				  id: 723174,
				  name: "Anonymous",
				  image: {
					url: "https://www-0.development.kiva.org/img/s100/6b1a24092be3aaa22216874e644a4acf.jpg"
				  }
				},
				shareAmount: "25.00"
			  },
			  {
				lender: {
				  id: 723174,
				  name: "Default user",
				  image: {
					url: "https://www-0.development.kiva.org/img/s100/4d844ac2c0b77a8a522741b908ea5c32.jpg"
				  }
				},
				shareAmount: "25.00"
			  },
			  {
				lender: {
				  id: 723174,
				  name: "Jessica",
				  image: {
					url: "https://www-0.development.kiva.org/img/s100/6b1a24092be3aaa22216874e644a4acf.jpg"
				  }
				},
				shareAmount: "25.00"
			  },
			]
		  }
		}
	  }
};

export default {
	title: 'IWD/ActivityFeed',
	component: ActivityFeed,
};

const story = (args) => {
	const template = (_args, { argTypes }) => ({
		props: Object.keys(argTypes),
		components: { ActivityFeed },
		mixins: [apolloStoryMixin({ queryResult })],
		template: `
			<div>
				<activity-feed />
			</div>
		`,
	});
	template.args = args;
	return template;
};

export const Default = story();

