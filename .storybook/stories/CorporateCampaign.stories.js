import Vue from 'vue';

// import plugins
import kivaPlugins from '@/plugins';
Vue.use(kivaPlugins);

import apolloStoryMixin from '../mixins/apollo-story-mixin';
import CorporateCampaignLanding from '@/pages/LandingPages/CorporateCampaign/CCLandingPage';
import CampaignHero from '@/components/CorporateCampaign/CampaignHero';
import CampaignStatus from '@/components/CorporateCampaign/CampaignStatus';
import cookieStoreStoryMixin from '../mixins/cookie-store-story-mixin';
import DynamicHeroClassic from '@/components/Contentful/DynamicHeroClassic';

export default {
	title: 'Page/CorporateCampaignLanding',
	component: CorporateCampaignLanding,
	args: {
		heroAreaContent: {
			"key":"promo-campaign-test-cg","name":"Promo Campaign Test Content Groups","contents":[{"key":"header-area","name":"Test Campaign Title GCB","bodyCopy":{"nodeType":"document","data":{},"content":[{"nodeType":"paragraph","content":[{"nodeType":"text","value":"The Kate Spade New York Foundation is giving you a $25 credit to lend to an entrepreneur who inspires you.\n\n","marks":[],"data":{}}],"data":{}}]},"headline":"Welcome to Kiva!","subHeadline":"__vue_devtool_undefined__","primaryCtaLink":"__vue_devtool_undefined__","primaryCtaKvTrackEvent":"__vue_devtool_undefined__","primaryCtaText":"__vue_devtool_undefined__"},{"name":"COVID fund Homepage Promo Images","description":"Lend a hand from afar and join the global COVID-19 response. Take action","images":[{"title":"hp-mg lg std","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/2F0fMUNds6qhAj6CyQ0kn4/360430aae71f90f2164625fbe5ce9d1e/Final_Homepage_lg_std.jpg","details":{"size":87066,"image":{"width":1025,"height":545}},"fileName":"Final_Homepage_lg_std.jpg","contentType":"image/jpeg"}},{"title":"hp-mg med std","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/4CZue28n9f0crCW7KdtmC3/62e687fdb3089ae04710b88db25b6da9/hp-mg_med_std.jpg","details":{"size":73397,"image":{"width":680,"height":675}},"fileName":"hp-mg_med_std.jpg","contentType":"image/jpeg"}},{"title":"hp-mg med retina","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/7xdmdw4GgKlUDRUSmvO5Iu/4ed7de5a67d27e2fbddb7f778dcb1317/hp-mg_med_retina.jpg","details":{"size":122452,"image":{"width":1360,"height":1350}},"fileName":"hp-mg_med_retina.jpg","contentType":"image/jpeg"}},{"title":"hp-mg lg retina","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/5H7wikO7DzKOEqnBBqric1/5ae2476c691165a4c400780b0857cb48/Final_Homepage_lg_retina.jpg","details":{"size":167314,"image":{"width":2048,"height":1090}},"fileName":"Final_Homepage_lg_retina.jpg","contentType":"image/jpeg"}},{"title":"hp-mg xl retina","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/5YzqkUttXksSAgaHuw9Cuv/23b7a0460c3616bf4f9e349631a5ab0a/hp-mg_xl_retina.jpg","details":{"size":270653,"image":{"width":2880,"height":1535}},"fileName":"hp-mg_xl_retina.jpg","contentType":"image/jpeg"}},{"title":"hp-mg xxl std","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/6zlivQBwWaw0XtJeYn8diS/c880e3eb4d5884ddc587742e6c010827/hp-mg_xxl_std.jpg","details":{"size":148815,"image":{"width":1921,"height":821}},"fileName":"hp-mg_xxl_std.jpg","contentType":"image/jpeg"}},{"title":"hp-mg xxl retina","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/1afYQ0d3JJDNbpet9oIr6J/2c21bba64857e54a1a936aa3d4783cbf/hp-mg_xxl_retina.jpg","details":{"size":271004,"image":{"width":3840,"height":1640}},"fileName":"hp-mg_xxl_retina.jpg","contentType":"image/jpeg"}},{"title":"hp-mg xl std","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/5tuiyeQcopJaHcUy3rDaTN/450b1136acedd6f218a2424ec4cfc5f9/hp-mp_xl_std.jpg","details":{"size":137038,"image":{"width":1441,"height":768}},"fileName":"hp-mp_xl_std.jpg","contentType":"image/jpeg"}},{"title":"hp-mg sm std","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/7alHPYp7xv7BUT5WLEieTz/e905db49ecfaa6ea102fe94f33c2555c/hp-mg_sm_std.jpg","details":{"size":50791,"image":{"width":480,"height":600}},"fileName":"hp-mg_sm_std.jpg","contentType":"image/jpeg"}},{"title":"hp-mg sm retina","description":"Lend a hand from afar and join the global COVID-19 response. Take action","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/1ykOTxkXIdoDTe8gZ6lRZ2/78faa1f3944065eb6780d20c32235c79/hp-mg_sm_retina.jpg","details":{"size":96212,"image":{"width":960,"height":1200}},"fileName":"hp-mg_sm_retina.jpg","contentType":"image/jpeg"}}]}],"media":[{"title":"Kate Spade New York Foundation","description":"Test Campaign Logo","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/32l10iSqfimSCylspmRCoy/0a59fa708139543539abd90b24406be9/Screen_Shot_2020-09-22_at_11.13.26_AM.png","details":{"size":91993,"image":{"width":854,"height":264}},"fileName":"Screen Shot 2020-09-22 at 11.13.26 AM.png","contentType":"image/png"}}]
		},
    content: {"key":"hp-classic-standard-hero","name":"hp-classic-standard-hero","type":"dynamicHeroClassic","title":null,"contents":[{"key":"hp-classic-standard-hero-gcb","name":"hp-classic-standard-hero-gcb","bodyCopy":{"nodeType":"document","data":{},"content":[{"nodeType":"heading-3","data":{},"content":[{"nodeType":"text","value":"With Kiva you can lend as little as $25 and make a big change in someone's life.  ","marks":[],"data":{}},{"nodeType":"hyperlink","data":{"uri":"google.com"},"content":[{"nodeType":"text","value":"Test link","marks":[],"data":{}}]},{"nodeType":"text","value":"","marks":[],"data":{}}]},{"nodeType":"paragraph","data":{},"content":[{"nodeType":"text","value":"","marks":[],"data":{}}]}]},"headline":"<nobr>Make a loan,</nobr> <nobr><span class=\"tw-text-brand\">change a life</span></nobr>.","contentType":"genericContentBlock"},{"label":"Find a borrower","style":"primary","webLink":"/lend-by-category","analyticsClickEvent":["homepage","click-standard-hero-cta","Find a borrower"],"contentType":"button"}, {"label":"Learn more","style":"secondary","webLink":"/lend-by-category","analyticsClickEvent":["homepage","click-standard-hero-cta","Find a borrower"],"contentType":"button"}, {"key":"second-hp-classic-standard-hero-gcb","name":"second-hp-classic-standard-hero-gcb","bodyCopy":{"nodeType":"document","data":{},"content":[{"nodeType":"heading-3","data":{},"content":[{"nodeType":"text","value":"With Kiva you can lend as little as $25 and make a big change in someone's life.  ","marks":[],"data":{}},{"nodeType":"hyperlink","data":{"uri":"google.com"},"content":[{"nodeType":"text","value":"Test link","marks":[],"data":{}}]},{"nodeType":"text","value":"","marks":[],"data":{}}]},{"nodeType":"paragraph","data":{},"content":[{"nodeType":"text","value":"","marks":[],"data":{}}]}]},"headline":"<nobr>Make a loan,</nobr> <nobr><span class=\"tw-text-brand\">change a life</span></nobr>.","contentType":"genericContentBlock"}],"media":[{"title":"StaticLoanCard","description":"Asunta | A loan of $1,950 helps to increase production by hiring more artisans for her workshop.","file":{"url":"//images.ctfassets.net/j0p9a6ql0rn7/3mOH6ZpXwkg8QjHud1tNMZ/cbfa3eaec8bcb730c09d8fb6aeee0080/MGCampaignLoanCardStatic.jpg","details":{"size":336770,"image":{"width":762,"height":906}},"fileName":"MGCampaignLoanCardStatic.jpg","contentType":"image/jpeg"}}]},
		activeCreditType: 'Active Credit Type',
		inContext: false,
		isMatching: false,
		loadingPromotion: false,
		promoErrorMessage: '',
		promoApplied: true,
		promoAmount: '$25.00',
		promoName: 'Kate Spade',
		statusMessageOverride: null
	},
	layout: 'fullscreen',
};

export const Combined = (args, { argTypes }) => ({
	props: Object.keys(argTypes),
	components: {
		CorporateCampaignLanding,
	},
	mixins: [ apolloStoryMixin(), cookieStoreStoryMixin()],
	template: `
		<div style="margin: 1rem;"><corporate-campaign-landing /></div>
	`,
});

export const Hero = (args, { argTypes }) => ({
	components: {
		CampaignHero,
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin()],
	template: `
		<campaign-hero :hero-area-content="heroAreaContent" />
	`,
});

export const StatusRow = (args, { argTypes }) => ({
	components: {
		CampaignStatus,
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin()],
	template: `
		<campaign-status
			:activeCreditType="activeCreditType"
			:inContext="inContext"
			:loading-promotion="loadingPromotion"
			:promo-error-message="promoErrorMessage"
			:promo-applied="promoApplied"
			:promo-amount="promoAmount"
			:promo-name="promoName"
			:statusMessageOverride="statusMessageOverride"
		/>
	`,
});

export const DynamicHeroClassic = (args, { argTypes }) => ({
	components: {
		DynamicHeroClassic,
	},
	props: Object.keys(argTypes),
	mixins: [apolloStoryMixin()],
	template: `
		<dynamic-hero-classic :content="content" />
	`,
});
